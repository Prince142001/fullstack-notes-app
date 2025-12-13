import { Note } from "../models/note.model.js";
const createNote = async (req, res) => {
    try {
        const { title, content, tags, isPinned } = req.body;

        if (!title) {
            console.log("Title is required");
            return res.status(409).json({
                message: "Title is required",
            });
        }

        const note = await Note.create({
            title,
            content: content || "",
            tags: tags || [],
            isPinned: isPinned || false,
            createdBy: req.user._id,
        });

        const createNote = await Note.findById(note._id);
        if (!createNote) {
            console.log("Something went wrong while creating note");
            return res.status(500).json({
                message: "Something went wrong while creating note",
            });
        }

        return res.status(201).json({
            message: "Note created successfully",
            note: createNote,
        });
    } catch (error) {
        console.log("Failed to create note", error);
        res.status(500).json({
            message: "Failed to create note",
            error: error.message,
        });
    }
};

const fetchAllNotes = async (req, res) => {
    try {
        const notes = await Note.find({ createdBy: req.user._id });

        return res.status(200).json({
            message: "Notes fetched successfully",
            count: notes.length,
            notes: notes,
        });
    } catch (error) {
        console.log("Failed to fetch notes", error);
        res.status(500).json({
            message: "Failed to fetch notes",
            error: error.message,
        });
    }
};

const searchNote = async (req, res) => {
    try {
        const { noteId } = req.params;

        const note = await Note.findOne({
            _id: noteId,
            createdBy: req.user._id,
        });

        if (!note) {
            console.log("Note not found with this ID");
            return res.status(404).json({
                message: "Note not found with this ID",
            });
        }

        res.status(200).json({
            message: "Note found successfully",
            note: note,
        });
    } catch (error) {
        console.log("Failed to find note");
        res.status(500).json({
            message: "Failed to find note",
            error: error.message,
        });
    }
};

const updateNote = async (req, res) => {
    try {
        const { noteId } = req.params;
        const { title, content, tags, isPinned } = req.body;

        const updates = {};

        if (title) updates.title = title;

        if (content) updates.content = content;

        if (tags) updates.tags = tags;

        if (isPinned !== undefined) updates.isPinned = isPinned;

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                message: "No fields provided for update",
            });
        }

        const updatedNote = await Note.findOneAndUpdate(
            {
                _id: noteId,
                createdBy: req.user._id,
            },
            {
                $set: updates,
            },
            { new: true }
        );

        if (!updatedNote) {
            console.log(
                "Note not found or you do not have permission to update it"
            );
            return res.status(404).json({
                message:
                    "Note not found or you do not have permission to update it",
            });
        }

        return res.status(200).json({
            message: "Note updated successfully",
            user: updatedNote,
        });
    } catch (error) {
        console.log("Error updating note", error);
        res.status(500).json({
            message: "Failed to update note",
            error: error.message,
        });
    }
};

const deleteNote = async (req, res) => {
    try {
        const { noteId } = req.params;

        const note = await Note.findOneAndDelete({
            _id: noteId,
            createdBy: req.user._id,
        });

        if (!note) {
            console.log("Note not found with this ID");
            return res.status(404).json({
                message: "Note not found with this ID",
            });
        }

        return res.status(200).json({
            message: "Note deleted successfully",
        });
    } catch (error) {
        console.log("Error deleting note", error);
        res.status(500).json({
            message: "Failed to delete note",
            error: error.message,
        });
    }
};

export { createNote, fetchAllNotes, searchNote, updateNote, deleteNote };
