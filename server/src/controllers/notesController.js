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
    });
    res.status(200).json(notes);
  } catch (error) {
    console.error("Error fetching notes: ", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
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
    });
    console.log(notes);
    res.status(200).json(notes);
  } catch (error) {
    console.error("Error fetching archived notes: ", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};

export const archiveNote = async (req, res) => {
  const noteId = req.params.id;
  const userId = req.user.id;

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
    console.log(archivedNote);
    if (archivedNote.count === 0) {
      res.status(404).json({ error: "Note not found or unauthorized" });
    }
    res.status(200).json({ message: "Note archived successfully" });
  } catch (error) {
    console.error("Error archiving note: ", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
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
    });
    console.log(notes);
    res.status(200).json(notes);
  } catch (error) {
    console.error("Error searching notes: ", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};

export const getNotesByTag = async (req, res) => {
  const userId = req.user.id;
  const tagId = parseInt(req.params.tagId);
  if (isNaN(tagId)) {
    return res.status(400).json({ error: "Invalid Tag ID format" });
  }

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
    console.log(notes);
    res.status(200).json(notes);
  } catch (error) {
    console.error("Error fetching notes by tag: ", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};

export const createNote = async (req, res) => {
  const userId = req.user.id;
  const { title, content, tagNames } = req.body;

  // Basit kontrol
  if (!tagNames || !Array.isArray(tagNames)) {
    return res.status(400).json({ error: "tagNames must be an array." });
  }
  try {
    const existingTags = await prisma.tag.findMany({
      where: { name: { in: tagNames } },
    });
    const existingTagNames = existingTags.map((tag) => tag.name);
    const newTagNames = tagNames.filter(name => !existingTagNames.includes(name));

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
        where: { name: { in: tagNames } },
        select: { id: true },
      });

      // Bağlantı verisini NoteTag ara tablosu için hazırla
      const linkData = allTags.map((tag) => ({ tagId: tag.id }));

      // 2C. Notu Oluştur ve Etiketleri Bağla
      const newNote = await tx.note.create({
        data: {
          title,
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
      details: error.message,
    });
  }
};

export const getNoteById = async (req, res) => {
  const noteId = req.params.id;
  const userId = req.user.id;
  try {
    const note = await prisma.note.findUnique({
      where: {
        id: noteId,
        userId: userId,
      },
    });
    console.log(note);

    if (!note) {
      res.status(404).json({ error: "Note not found" });
    }

    res.status(200).json(note);
  } catch (error) {
    console.error("Error fetching note by ID: ", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};

export const updateNote = async (req, res) => {
  const noteId = req.params.id;
  const userId = req.user.id;
  const { title, content } = req.body;

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
      res.status(404).json({ error: "Note not found or unauthorized" });
    }
    res.status(200).json({ message: "Note updated successfully" });
  } catch (error) {
    console.error("Error updating note: ", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};
