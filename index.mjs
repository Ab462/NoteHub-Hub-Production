import express from "express";
import auth from "./routes/auth.mjs";
import notes from "./routes/notes.mjs";
import dotenv from "dotenv";
import path from "path"
import cors from "cors";
import("./db.mjs");

const app = express();
const port = 8000;
dotenv.config();


// middlewares
app.use(cors({
  origin:"*",
  credentials:true
}));
app.use(express.json());
app.use(express.static('./build'));

// Available Routes
app.use("/api/auth", auth);
app.use("/api/notes", notes);

app.get("/",(req,res)=>{
  res.status(200).sendFile(path.join('./build/index.html'));
})


app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
