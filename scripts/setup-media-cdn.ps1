$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$uploadsDir = Join-Path $root "uploads"
$mediaDir = Join-Path $uploadsDir "media"
$deployDir = Join-Path $root "deploy\nginx"
$nginxSnippet = Join-Path $deployDir "media-cache.conf"

Write-Host "Preparing media upload directories..."
New-Item -ItemType Directory -Path $uploadsDir -Force | Out-Null
New-Item -ItemType Directory -Path $mediaDir -Force | Out-Null
New-Item -ItemType Directory -Path $deployDir -Force | Out-Null

$snippet = @"
# Include this in your Nginx server block
location /uploads/ {
  alias /var/www/qarwaan/uploads/;
  add_header Access-Control-Allow-Origin * always;
  add_header Vary Origin always;
}

location ~* ^/uploads/media/.*\.(jpg|jpeg|png|webp|avif|gif|svg|mp4|webm)$ {
  alias /var/www/qarwaan/uploads/media/;
  add_header Cache-Control "public, max-age=31536000, immutable" always;
  expires 365d;
}
"@

Set-Content -Path $nginxSnippet -Value $snippet -Encoding UTF8

Write-Host "Done."
Write-Host "Created: $mediaDir"
Write-Host "Created: $nginxSnippet"
Write-Host "Next: open docs/enterprise-media-cdn-setup.md for CDN and cache strategy."
