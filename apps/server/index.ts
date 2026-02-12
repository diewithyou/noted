import express from "express";
import cors from "cors";
import { getTree, readFileContent } from "./fileController.js";

const app = express();
const PORT = process.env.PORT || 5172;

app.use(cors());
app.use(express.json());

app.post("/api/files/tree", getTree);
app.post("/api/files/content", readFileContent);

app.listen(PORT, () => {
    console.log(`TS Server running at http://localhost:${PORT}`);
});
