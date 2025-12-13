import { Router } from "express";
import {
    createNote,
    deleteNote,
    fetchAllNotes,
    searchNote,
    updateNote,
} from "../controllers/note.controller.js";
import { verifyJwtToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJwtToken);

router.route("/").post(createNote).get(fetchAllNotes);

router.route("/:noteId").get(searchNote).patch(updateNote).delete(deleteNote);

export default router;
