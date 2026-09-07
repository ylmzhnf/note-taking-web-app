import { prisma } from "../lib/prisma.js";

export const getNotes = async (req, res) => {
  const userId = req.user.id;
  try {
    const notes = await prisma.note.findMany({
      where: {
        userId: userId,
        isArchived: false,
      },
      orderBy: { updatedAt: "desc" },
      include: {
        tags: {
          include: { tag: true },
        },
      },
    });
      return res.status(200).json(notes);
  } catch (error) {
    console.error("Error fetching notes: ", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getArchivedNotes = async (req, res) => {
  const userId = req.user.id;
  try {
    const notes = await prisma.note.findMany({
      where: {
        userId: userId,
        isArchived: true,
      },
      orderBy: { updatedAt: "desc" },
      include: {
        tags: {
          include: { tag: true },
        },
      },
    });
    res.status(200).json(notes);
  } catch (error) {
    console.error("Error fetching archived notes: ", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const archiveNote = async (req, res) => {
  const noteId = parseInt(req.params.id);
  const userId = req.user.id;

  if (Number.isNaN(noteId)) {
    return res.status(400).json({ error: "Invalid note ID format" });
  }

  try {
    const archivedNote = await prisma.note.updateMany({
      where: {
        id: noteId,
        userId: userId,
      },
      data: {
        isArchived: true,
      },
    });
    if (archivedNote.count === 0) {
      return res.status(404).json({ error: "Note not found or unauthorized" });
    }
    res.status(200).json({ message: "Note archived successfully" });
  } catch (error) {
    console.error("Error archiving note: ", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const restoreNote = async (req, res) => {
  const noteId = Number.parseInt(req.params.id, 10);
  const userId = req.user.id;

  if (Number.isNaN(noteId)) {
    return res.status(400).json({ error: "Invalid note ID format" });
  }

  try {
    const restoredNote = await prisma.note.updateMany({
      where: { id: noteId, userId },
      data: { isArchived: false },
    });

    if (restoredNote.count === 0) {
      return res.status(404).json({ error: "Note not found or unauthorized" });
    }

    return res.status(200).json({ message: "Note restored successfully" });
  } catch (error) {
    console.error("Error restoring note: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const searchNotes = async (req, res) => {
  const userId = req.user.id;
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  try {
    const notes = await prisma.note.findMany({
      where: {
        userId: userId,
        isArchived: false,
        OR: [
          { title: { contains: query, mode: "insensitive" } }, // 1. Başlıkta ara
          { content: { contains: query, mode: "insensitive" } }, // 2. İçerikte ara
          {
            tags: {
              some: {
                tag: {
                  name: {
                    contains: query, // 3. Etiket adında ara
                    mode: "insensitive",
                  },
                },
              },
            },
          },
        ],
      },
      include: {
        tags: {
          include: { tag: true },
        },
      },
    });
    res.status(200).json(notes);
  } catch (error) {
    console.error("Error searching notes: ", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};
export const getNotesByTag = async (req, res) => {
  const userId = req.user.id;
  const tagId = parseInt(req.params.tagId);
  if (isNaN(tagId)) {
    return res.status(400).json({ error: "Invalid Tag ID format" });

  try {
    const notes = await prisma.note.findMany({
      where: {
        userId: userId,
        isArchived: false,
        tags: {
          some: {
            tagId: tagId,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      include: {
        tags: {
          select: {
            tag: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
    res.status(200).json(notes);
  } catch (error) {
    console.error("Error fetching notes by tag: ", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
}};

export const createNote = async (req, res) => {
  const userId = req.user.id;
  const { title, content, tagNames } = req.body;

  if (typeof title !== "string" || !title.trim()) {
    return res.status(400).json({ error: "A note title is required." });
  }
  if (typeof content !== "string") {
    return res.status(400).json({ error: "Note content must be text." });
  }
  if (!Array.isArray(tagNames) || tagNames.some((tag) => typeof tag !== "string")) {
    return res.status(400).json({ error: "tagNames must be an array." });
  }

  const normalizedTagNames = [...new Set(tagNames.map((tag) => tag.trim()).filter(Boolean))];
  if (normalizedTagNames.some((tag) => tag.length > 50)) {
    return res.status(400).json({ error: "Tags cannot exceed 50 characters." });
  }

  try {
    const existingTags = await prisma.tag.findMany({
      where: { name: { in: normalizedTagNames } },
    });
    const existingTagNames = existingTags.map((tag) => tag.name);
    const newTagNames = normalizedTagNames.filter(name => !existingTagNames.includes(name));

    // ⚛️ 2. PRISMA İŞLEMLERİ (TRANSACTION): Oluşturma ve Bağlama
    const result = await prisma.$transaction(async (tx) => {
      // 2A. Yeni Etiketleri Oluştur
      if (newTagNames.length > 0) {
        await tx.tag.createMany({
          data: newTagNames.map((name) => ({ name })),
        });
      }

      // 2B. Tüm Etiket ID'lerini Tekrar Al (Yeni Oluşturulanlar Dahil)
      // Bu sorgu, hem eski hem de yeni etiketlerin ID'lerini garanti eder.
      const allTags = await tx.tag.findMany({
        where: { name: { in: normalizedTagNames } },
        select: { id: true },
      });

      // Bağlantı verisini NoteTag ara tablosu için hazırla
      const linkData = allTags.map((tag) => ({ tagId: tag.id }));

      // 2C. Notu Oluştur ve Etiketleri Bağla
      const newNote = await tx.note.create({
        data: {
          title: title.trim(),
          content,
          userId,
          tags: {
            create: linkData, // NoteTag tablosuna kayıtları oluşturur
          },
        },
        // Yanıt için etiket isimlerini dahil et
        include: {
          tags: {
            include: { tag: true },
          },
        },
      });

      return newNote;
    });

    // 3. Başarılı yanıt
    res.status(201).json(result);
  } catch (error) {
    console.error("Error creating note with tags: ", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getNoteById = async (req, res) => {
  const noteId = parseInt(req.params.id);
  const userId = req.user.id;

  if (Number.isNaN(noteId)) {
    return res.status(400).json({ error: "Invalid note ID format" });
  }

  try {
    const note = await prisma.note.findFirst({
      where: {
        id: noteId,
        userId: userId,
      },
      include: {
        tags: {
          include: { tag: true },
        },
      },
    });

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.status(200).json(note);
  } catch (error) {
    console.error("Error fetching note by ID: ", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const updateNote = async (req, res) => {
  const noteId = parseInt(req.params.id);
  const userId = req.user.id;
  const { title, content } = req.body;

  if (Number.isNaN(noteId)) {
    return res.status(400).json({ error: "Invalid note ID format" });
  }

  try {
    const updateNote = await prisma.note.updateMany({
      where: {
        id: noteId,
        userId: userId,
      },
      data: {
        title,
        content,
      },
    });
    if (updateNote.count === 0) {
      return res.status(404).json({ error: "Note not found or unauthorized" });
    }
    res.status(200).json({ message: "Note updated successfully" });
  } catch (error) {
    console.error("Error updating note: ", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const deleteNote = async (req, res) => {
  const noteId = parseInt(req.params.id);
  const userId = req.user.id;

  if (Number.isNaN(noteId)) {
    return res.status(400).json({ error: "Invalid note ID format" });
  }
  try {
    const deleteNote = await prisma.note.deleteMany({
      where: {
        id: noteId,
        userId: userId,
      },
    });
    if (deleteNote.count === 0) {
      return res.status(404).json({ error: "Note not found or unauthorized" });
    }
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error deleting note: ", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getTags = async (req, res) => {
  const userId = req.user.id;
  try {
    const tags = await prisma.tag.findMany({
      where: {
        notes: {
          some: {
            note: {
              userId: userId
            }
          }
        }
      },
      orderBy: { name: "asc" }
    });
    res.status(200).json(tags);
  } catch (error) {
    console.error("Error fetching tags: ", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};
