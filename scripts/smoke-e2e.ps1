$ErrorActionPreference = "Stop"

function Get-DotEnvValue([string]$key) {
  if (!(Test-Path ".env")) { return "" }
  $line = Get-Content .env | Where-Object { $_ -match "^$key=" } | Select-Object -First 1
  if (!$line) { return "" }
  return ($line -replace "^$key=", "").Trim()
}

function Add-Result([string]$test, [string]$status, [string]$detail) {
  $script:results += [pscustomobject]@{
    Test = $test
    Status = $status
    Detail = $detail
  }
}

$mongo = Get-DotEnvValue "MONGODB_URI"
$dnsServers = Get-DotEnvValue "DNS_SERVERS"
$adminUser = Get-DotEnvValue "ADMIN_USERNAME"
$adminPass = Get-DotEnvValue "ADMIN_PASSWORD"
if (!$adminUser) { $adminUser = "admin" }
if (!$adminPass) { $adminPass = "admin123" }

$results = @()
$job = $null
$tmpPng = Join-Path (Get-Location) "tmp-smoke.png"
$adminToken = ""

try {
  $job = Start-Job -ScriptBlock {
    param($wd, $mongoUri, $dns)
    Set-Location $wd
    if ($mongoUri) { $env:MONGODB_URI = $mongoUri }
    if ($dns) { $env:DNS_SERVERS = $dns }
    $env:STRIPE_SECRET_KEY = "sk_test_123"
    $env:STRIPE_WEBHOOK_SECRET = "whsec_test_123"
    $env:RAZORPAY_WEBHOOK_SECRET = "rzp_webhook_secret"
    $env:RAZORPAY_KEY_SECRET = "rzp_key_secret_dummy"
    npm run server
  } -ArgumentList (Get-Location).Path, $mongo, $dnsServers

  Start-Sleep -Seconds 6

  try {
    $health = Invoke-RestMethod -Method GET -Uri "http://localhost:5000/api/health" -TimeoutSec 8
    Add-Result "Health" "PASS" ($health | ConvertTo-Json -Compress)
  } catch {
    Add-Result "Health" "FAIL" $_.Exception.Message
    throw
  }

  try {
    $loginBody = @{ username = $adminUser; password = $adminPass } | ConvertTo-Json
    $adminLogin = Invoke-RestMethod -Method POST -Uri "http://localhost:5000/api/admin/login" -ContentType "application/json" -Body $loginBody
    $adminToken = $adminLogin.token
    if (!$adminToken) { throw "No token in admin login response" }
    Add-Result "Admin Login" "PASS" "token issued"
  } catch {
    Add-Result "Admin Login" "FAIL" $_.Exception.Message
    throw
  }

  try {
    $orderBody = @{
      payerName = "Smoke User"
      payerEmail = "smoke@example.com"
      payerPhone = "9999999999"
      amount = 1299
      gateway = "mock"
    } | ConvertTo-Json
    $order = Invoke-RestMethod -Method POST -Uri "http://localhost:5000/api/payments/create-order" -ContentType "application/json" -Body $orderBody
    $verifyBody = @{ paymentId = $order.paymentId; status = "paid" } | ConvertTo-Json
    $verify = Invoke-RestMethod -Method POST -Uri "http://localhost:5000/api/payments/verify" -ContentType "application/json" -Body $verifyBody

    $payments = Invoke-RestMethod -Method GET -Uri "http://localhost:5000/api/admin/payments" -Headers @{ Authorization = "Bearer $adminToken" }
    $paidRow = $payments.payments | Where-Object { $_._id -eq $order.paymentId } | Select-Object -First 1
    if ($paidRow -and $paidRow.status -eq "paid") {
      Add-Result "Mock Payment Flow" "PASS" "gateway=$($order.gateway); verify=$($verify.message)"
    } else {
      Add-Result "Mock Payment Flow" "FAIL" "Payment not marked paid in admin ledger"
    }
  } catch {
    Add-Result "Mock Payment Flow" "FAIL" $_.Exception.Message
  }

  try {
    $seedBody = @{
      payerName = "Stripe Smoke"
      payerEmail = "stripe@example.com"
      payerPhone = "9000000000"
      amount = 1500
      gateway = "mock"
    } | ConvertTo-Json
    $seedOrder = Invoke-RestMethod -Method POST -Uri "http://localhost:5000/api/payments/create-order" -ContentType "application/json" -Body $seedBody

    $stripeEvent = @{
      id = "evt_smoke_1"
      type = "checkout.session.completed"
      data = @{
        object = @{
          id = "cs_smoke_1"
          metadata = @{ paymentId = $seedOrder.paymentId }
          client_reference_id = $seedOrder.paymentId
          payment_intent = "pi_smoke_1"
        }
      }
    } | ConvertTo-Json -Depth 10 -Compress

    $env:PAYLOAD = $stripeEvent
    $env:WHSEC = "whsec_test_123"
    $sig = node -e "const Stripe=require('stripe');const s=Stripe('sk_test_123');process.stdout.write(s.webhooks.generateTestHeaderString({payload:process.env.PAYLOAD,secret:process.env.WHSEC}));"
    $sig = $sig.Trim()

    $stripeWebhook = Invoke-RestMethod -Method POST -Uri "http://localhost:5000/api/payments/webhook/stripe" -ContentType "application/json" -Headers @{ "stripe-signature" = $sig } -Body $stripeEvent

    $payments = Invoke-RestMethod -Method GET -Uri "http://localhost:5000/api/admin/payments" -Headers @{ Authorization = "Bearer $adminToken" }
    $row = $payments.payments | Where-Object { $_._id -eq $seedOrder.paymentId } | Select-Object -First 1
    if ($stripeWebhook.received -eq $true -and $row -and $row.status -eq "paid") {
      Add-Result "Stripe Webhook Reconciliation" "PASS" "status=$($row.status)"
    } else {
      Add-Result "Stripe Webhook Reconciliation" "FAIL" "Webhook accepted but status not paid"
    }
  } catch {
    Add-Result "Stripe Webhook Reconciliation" "FAIL" $_.Exception.Message
  }

  try {
    $seedBody = @{
      payerName = "Razorpay Smoke"
      payerEmail = "razorpay@example.com"
      payerPhone = "9000000001"
      amount = 1800
      gateway = "mock"
    } | ConvertTo-Json
    $seedOrder = Invoke-RestMethod -Method POST -Uri "http://localhost:5000/api/payments/create-order" -ContentType "application/json" -Body $seedBody

    $rzEvent = @{
      event = "payment.captured"
      payload = @{
        payment = @{ entity = @{ id = "pay_smoke_1"; order_id = "order_smoke_1"; notes = @{ paymentId = $seedOrder.paymentId } } }
        order = @{ entity = @{ id = "order_smoke_1"; notes = @{ paymentId = $seedOrder.paymentId } } }
      }
    } | ConvertTo-Json -Depth 10 -Compress

    $secret = "rzp_webhook_secret"
    $hmac = [System.Security.Cryptography.HMACSHA256]::new([System.Text.Encoding]::UTF8.GetBytes($secret))
    $hashBytes = $hmac.ComputeHash([System.Text.Encoding]::UTF8.GetBytes($rzEvent))
    $rzSig = -join ($hashBytes | ForEach-Object { $_.ToString("x2") })

    $rzWebhook = Invoke-RestMethod -Method POST -Uri "http://localhost:5000/api/payments/webhook/razorpay" -ContentType "application/json" -Headers @{ "x-razorpay-signature" = $rzSig } -Body $rzEvent

    $payments = Invoke-RestMethod -Method GET -Uri "http://localhost:5000/api/admin/payments" -Headers @{ Authorization = "Bearer $adminToken" }
    $row = $payments.payments | Where-Object { $_._id -eq $seedOrder.paymentId } | Select-Object -First 1
    if ($rzWebhook.received -eq $true -and $row -and $row.status -eq "paid") {
      Add-Result "Razorpay Webhook Reconciliation" "PASS" "status=$($row.status)"
    } else {
      Add-Result "Razorpay Webhook Reconciliation" "FAIL" "Webhook accepted but status not paid"
    }
  } catch {
    Add-Result "Razorpay Webhook Reconciliation" "FAIL" $_.Exception.Message
  }

  try {
    $pngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO7+9y8AAAAASUVORK5CYII="
    [IO.File]::WriteAllBytes($tmpPng, [Convert]::FromBase64String($pngBase64))
    $uploadRaw = curl.exe -s -X POST "http://localhost:5000/api/media/admin/upload" -H "Authorization: Bearer $adminToken" -F "file=@$tmpPng;type=image/png" -F "title=smoke-test-asset" -F "type=gallery" -F "tags=smoke,test"
    $upload = $uploadRaw | ConvertFrom-Json
    if ($upload.asset -and $upload.asset._id) {
      Add-Result "Admin Media Upload" "PASS" "assetId=$($upload.asset._id); url=$($upload.asset.url)"
    } else {
      Add-Result "Admin Media Upload" "FAIL" $uploadRaw
    }
  } catch {
    Add-Result "Admin Media Upload" "FAIL" $_.Exception.Message
  }
}
finally {
  if (Test-Path $tmpPng) { Remove-Item $tmpPng -Force }
  if ($job) {
    try { Stop-Job $job -ErrorAction SilentlyContinue } catch {}
    try { Remove-Job $job -Force -ErrorAction SilentlyContinue } catch {}
  }
}

$results | Format-Table -AutoSize
