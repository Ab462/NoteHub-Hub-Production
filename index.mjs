import express from "express";
import auth from "./routes/auth.mjs";
import notes from "./routes/notes.mjs";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import("./db.mjs");

const app = express();
const port = 8000;
dotenv.config();

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join('./Client/build')));

// Available Routes
app.use("/api/auth", auth);
app.use("/api/notes", notes);

app.use("*",(req,res)=>{
  res.status(200).sendFile('./Client/build/index.html');
})

app.listen(port, () => {
  console.log(`Server is listening at https://localhost:${port}`);
});