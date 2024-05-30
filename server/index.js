import express from 'express';
import result from './db.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import router1 from './routes/auth.js'
import router2 from './routes/socketID.js';
import router3 from './routes/contacts.js';
import router4 from './routes/chat.js';

const port = 3000;
const app = express();

const server = createServer(app);
const io = new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        methods:["GET","POST"],
        credentials: true
    }
});

app.use(cors({
    origin:"http://localhost:5173",
    methods:["GET","POST"],
    credentials: true
}))


app.use(express.json());
app.use('/api/auth', router1)
app.use('/api/socketID',router2)
app.use('/api/contacts',router3)
app.use('/api/chat',router4)

io.on("connection", (socket)=>{
    console.log("User Connected",socket.id);

    socket.on('message',({msg, receiver})=>{
        socket.to(receiver).emit("recieve",msg);
        console.log(msg+" "+ receiver+" ");
    })

    socket.on("disconnect",()=>{
        console.log("User Disconnected",socket.id)
    });
})

server.listen(port);