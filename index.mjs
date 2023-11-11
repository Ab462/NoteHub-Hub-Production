import express from "express";
import auth from "./routes/auth.mjs";
import notes from "./routes/notes.mjs";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import path,{ dirname } from "path";
import cors from "cors";
import("./db.mjs");

const app = express();
const port = 8000 || process.env.PORT;
dotenv.config();

// current directory
const __dirname = dirname(fileURLToPath(import.meta.url));

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join("./Client/build")));

// Available Routes
app.use("/api/auth", auth);
app.use("/api/notes", notes);

app.get("*", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "./Client/build/index.html"));
});

app.listen(port, () => {
  console.log(`Server is listening at localhost:${port}`);
});
