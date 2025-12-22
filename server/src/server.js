import "./config/init.js"; // MUST be the first import to load env vars
import app from "./app.js";
import { prisma } from "../src/lib/prisma.js";

// Removed manual dotenv config as it's now handled in init.js

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
