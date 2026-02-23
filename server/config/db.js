import mongoose from 'mongoose';
import dns from 'dns';

function configureDnsResolvers() {
  const customServers = (process.env.DNS_SERVERS || '8.8.8.8,1.1.1.1')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  if (customServers.length > 0) {
    try {
      dns.setServers(customServers);
    } catch {
      // ignore invalid DNS config and continue with system defaults
    }
  }
}

export async function connectToDatabase(mongoUri) {
  if (!mongoUri) {
    throw new Error('MONGODB_URI is missing');
  }

  configureDnsResolvers();
  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: Number(process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS || 15000),
    connectTimeoutMS: Number(process.env.MONGODB_CONNECT_TIMEOUT_MS || 15000),
  });
  console.log('MongoDB connected');
}
