import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { getNotes, getArchivedNotes, archiveNote, searchNotes, getNotesByTag, getNoteById, createNote, updateNote, getTags, deleteNote } from "../controllers/notesController.js";

const router = express.Router();

router.get("/", verifyToken, getNotes); //tüm notları getir
router.get("/archived", verifyToken, getArchivedNotes);// arşivlenmiş notları getir
router.get("/tags", verifyToken, getTags); // etiketleri getir (fixed order)
router.patch("/archive/:id", verifyToken, archiveNote);// silmek yerine notu arşivleme
router.get("/search", verifyToken, searchNotes);// notlarda arama yapma
router.get("/tag/:tagId", verifyToken, getNotesByTag);// etiketlere göre notları getir
router.get("/:id", verifyToken, getNoteById);
router.post("/", verifyToken, createNote);
router.patch("/:id", verifyToken, updateNote);
router.delete("/:id", verifyToken, deleteNote);




export default router;