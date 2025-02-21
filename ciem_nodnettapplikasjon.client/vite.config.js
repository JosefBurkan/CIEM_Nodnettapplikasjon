import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { env } from 'process';

// Path to ssl folder inside the frontend folder
const sslFolderPath = path.join(__dirname, 'ssl');

// Define the certificate and key file paths
const certificateName = "ciem_nodnettapplikasjon.client";
const certFilePath = path.join(sslFolderPath, `${certificateName}.pem`);
const keyFilePath = path.join(sslFolderPath, `${certificateName}.key`);

// Check if the certificates exist, or create them if not
if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
    console.log("SSL certificate not found, creating new one...");
    // You can optionally run the .NET cert creation logic here if needed
    // Or just make sure the certificate exists manually if you've already generated it
}

const target = env.ASPNETCORE_HTTPS_PORT
    ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}`
    : 'https://localhost:7088';  // Default backend URL

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        proxy: {
            '^/weatherforecast': {
                target: 'https://localhost:7088',  // Backend API endpoint
                secure: false, // Allow insecure connections (we assume local dev certificates are self-signed)
            },
        },
        port: 5173,  // Frontend runs on port 5173
        https: {
            key: fs.readFileSync(keyFilePath),  // Use the SSL key
            cert: fs.readFileSync(certFilePath), // Use the SSL certificate
        },
    },
});
