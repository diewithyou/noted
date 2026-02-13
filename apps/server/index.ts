import express from "express";
import cors from "cors";
import {
    getTree,
    readFileContent,
    updateFileContent,
    moveItem,
    removeItem,
    createFile,
    createDirectory,
} from "./api/fileController.js";

const app = express();
const PORT = process.env.PORT || 5172;

app.use(cors());
app.use(express.json());

app.post("/api/files/tree", getTree);
app.post("/api/files/content", readFileContent);
app.post("/api/files/save", updateFileContent);
app.post("/api/files/move", moveItem);
app.post("/api/files/delete", removeItem);
app.post("/api/files/createFile", createFile);
app.post("/api/files/createDir", createDirectory);

app.listen(PORT, () => {
    console.log(`TS Server running at http://localhost:${PORT}`);
});
