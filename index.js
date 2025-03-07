const express = require("express");
const cors = require("cors");
const http = require('http');
const app = express();
const {Server} = require("socket.io");

const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "https://socket-react-ui.vercel.app",
        methods: ["GET", "POST"]
    }
})

io.on("connection", (socket) => {
    console.log(`Usuario actual:${socket.id}`);

    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`Usuario con id:${socket.id} se unio a la sala: ${data}`);
    })

    socket.on("send_message", (data) => {
        socket.to(data.room).emit("received_message", data)
    })

    socket.on("disconnect", () => {
        console.log("Usuario desconectado", socket.id);
    })
})

server.listen(port, () =>{
    console.log(`Server in port http://localhost:${port}`);
})
