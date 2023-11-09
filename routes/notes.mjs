import express from "express";
import Notes from "../models/Note.mjs";
import fetchUser from "../middleware/fetchUser.mjs";
import { body, validationResult } from "express-validator";
const router = express.Router();

// Get all the notes of a Logged in user using GET "/api/notes/fetchallnotes" auth required

router.get("/fetchallnotes", fetchUser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.status(200).json(notes);
  } catch (error) {
    return res.status(500).send("Internal Server Error", error);
  }
});

// create a note of a Logged in user using POST "/api/notes/addnote" auth required

router.post("/addnote",
  [
    body("title", "title must be atleast 3 characters").isLength({ min: 3 }),
    body("description", "description must be atleast 5 characters").isLength({ min: 5, }),
  ],
  fetchUser, async (req, res) => {
    // Check for validation errors
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }
    try {
      const { title, description, tag } = req.body;

      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();
      res.status(201).json(savedNote);
    } catch (error) {
      return res.status(400).send("Internal Server Error", error);
    }
  }
);

// updating the note of a Logged in user using PUT "/api/notes/updatenotes" auth required

router.put("/updatenotes/:id",
  [
    body("title", "title must be atleast 3 characters").isLength({ min: 3 }),
    body("description", "description must be atleast 5 characters").isLength({ min: 5, }),
  ],
  fetchUser, async (req, res) => {
    // Check for validation errors
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }
    try {
      const { title, description, tag } = req.body;
      const newNote = {};
      if (title) {
        newNote.title = title;
      }
      if (description) {
        newNote.description = description;
      }
      if (tag) {
        newNote.tag = tag;
      }

      // find the note to be updated and update it
      let note = await Notes.findById(req.params.id);
      if (!note) {
        return res.status(404).send("Not Found!");
      }
      // prevent if someone else trying to update other user note
      if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not Allowed!");
      }

      await Notes.findByIdAndUpdate(
        req.params.id,
        { $set: newNote },
        { new: true }
      );
      res.status(201).json(note);
    } catch (error) {
      console.log(error)
      return res.status(400).send("Internal Server Error message", error);
    }
  }
);

// deleting the note of a Logged in user using PUT "/api/notes/deletenote" auth required

router.delete("/deletenote/:id", fetchUser, async (req, res) => {
  try {
    let success = false;
    // find the note to be deleted and delete it
    const note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).send(success, "Not Found!");
    }

    // prevent if someone else trying to delete other user note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send(success, "Not Allowed!");
    }

    await Notes.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Note has been deleted successfully!" });
  } catch (error) {
    return console.log(error)
  }
});
export default router;
