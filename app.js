const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const cookieParser = require("cookie-parser")
const formidable = require("formidable");
const fs = require("fs")

app.use(cookieParser())

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html");
});


io.on("connection", (socket) => {
	io.to(socket.id).emit("id", socket.id)
});


app.post("/upload", (req, res) => {
	console.log(req.cookies.id)
	const form = formidable({
		multiples: true,
		keepExtensions: true,
		maxFileSize: 10000 * 1024 * 1024,
		uploadDir: __dirname + "/uploads",
	});

	form.on("progress", (bytesReceived, bytesExpected) => {
		let progress = (bytesReceived/bytesExpected)*100
		io.to(req.cookies.id).emit("progress", progress)
	});

	form.parse(req, (err, fields, files) => {
		if (err) {
			console.log(err);
		}
		// console.log("working");
		res.json({message:"Ok"});
	});
});

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
	console.log("http://localhost:" + PORT);
});
