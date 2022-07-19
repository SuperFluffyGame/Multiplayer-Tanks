import "./ws-server";
import express from "express";
import * as fs from "fs";

console.log("starting server");

const app = express();

app.use(express.static("dist"));
app.use(express.static("styles"));

app.get("/", (req, res) => {
    const data = fs.readFileSync("index.html");
    res.end(data);
});

app.listen(3000);
