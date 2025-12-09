import express from 'express';
import cors from 'cors';
import authRoutes from "./routes/authRoutes.js";
import notesController from "./routes/notesRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";

const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/auth", authRoutes)
app.use("/notes", notesController);

// Settings routes
app.use("/settings", settingsRoutes);

export default app;
