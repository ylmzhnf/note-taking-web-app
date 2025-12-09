import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { getNotes, getArchivedNotes, archiveNote, searchNotes, getNotesByTag, getNoteById, createNote, updateNote } from "../controllers/notesController.js";

const router = express.Router();

router.get("/", verifyToken , getNotes); //tüm notları getir
router.get("/archived", verifyToken, getArchivedNotes);// arşivlenmiş notları getir
router.patch("/archive/:id", verifyToken, archiveNote);// silmek yerine notu arşivleme
router.get("/search", verifyToken, searchNotes);// notlarda arama yapma
router.get("/tag/:tagId", verifyToken, getNotesByTag);// etiketlere göre notları getir
router.get("/:id", verifyToken, getNoteById);
router.post("/", verifyToken, createNote);
router.patch("/:id", verifyToken, updateNote);




export default router;