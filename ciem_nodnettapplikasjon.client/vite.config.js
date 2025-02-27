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

// Check if the certificates exist
if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
    console.log("SSL certificate not found, creating new one...");

}

const target = env.ASPNETCORE_HTTPS_PORT
    ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}`
    : 'https://localhost:5255';  // Default backend URL

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        proxy: {
            '^/api': {
                target: 'https://localhost:5255',  // Backend API endpoint
                secure: false,
                changeOrigin: true,
            },
        },
        port: 5173,  // Frontend runs on port 5173
        https: {
            key: fs.readFileSync(keyFilePath),  // Use the SSL key
            cert: fs.readFileSync(certFilePath), // Use the SSL certificate
        },
    },
    build: {
        outDir: 'dist'
    }
});
