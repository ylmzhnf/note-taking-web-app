import app from "./app.js";
import { prisma } from "../src/lib/prisma.js";
import env from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

env.config({ path: join(__dirname, "../.env") });

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({ message: "Note Taking API is running" });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
