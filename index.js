const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");
const {Server} = require("socket.io")

const io = new Server(server,{
    cors:{
        origin:"http://localhost:3000",
        methods:["GET","POST"]
    }
});

app.use(cors());
const PORT = process.env.PORT || 5000;

app.get('/',(req,res)=>{
    res.send("server is running");
})

io.on("connection",(socket)=>{
    socket.emit("me",socket.id);

    socket.on("disconnect",()=>{
        socket.broadcast.emit("callended");
    })

    socket.on("calluser",({userToCall,signalData,from,name})=>{
        io.to(userToCall).emit("calluser",{signal:signalData,from,name});
    })

    socket.on("answercall",(data)=>{
        socket.to(data.to).emit("callaccepted",data.signal,data.name);
    })

    socket.on("refresh",()=>{
        socket.broadcast.emit("refreshClient");
    })
})


server.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
})