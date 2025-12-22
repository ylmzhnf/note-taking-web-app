import env from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Adjust path to point to server directory root where .env is located
// src/config/init.js -> ../../.env
env.config({ path: join(__dirname, '../../.env') });

console.log("Environment variables loaded.");
