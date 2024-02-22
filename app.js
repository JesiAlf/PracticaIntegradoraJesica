import express from 'express';
import handlebars from 'express-handlebars';
import path from 'path';
import __dirname from './utils.js';
import mongoose from 'mongoose';
import {Server} from "socket.io";
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/routesMongo/carts.Mongo.router.js';
import chatRouter from './routes/routesMongo/chatMongo.router.js';
//import uploadRouter from './routes/upload.router.js';
import socketIo from "socket.io";
import viewsRouter from "./routes/views.router.js";

const app = express();
const PORT = 8080;
const server= http.createServer(app)
const io=new Server(server)

//Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use('/', express.static(path.join(__dirname+ '/public')));

//Handlebars
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

//Router
app.use('/', productsRouter)
app.use('/', cartsRouter)
app.use('/', chatRouter)
app.use('/', uploadRouter)
 
//ruta
app.get("/",(req,res)=>{
    res.render('index.handlebars');
});

const users={}
//Endpoint
app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`)
})

//socket.io
io.on("connection", (socket)=>{
    console.log("un usuario se ha conectado")
    socket.on("newUser",(username)=>{
        users[socket.id] = username
        io.emit("userConnected", username)
    })

    socket.on("chatMessage",(message)=>{
        const username= users[socket.id]
        io.emit("message",{username, message})
    })
    })

//Conexion de mongo con mongo de atlas
mongoose.connect('mongodb+srv://jesiALf:jesica.l.alfonso@cluster0.cuvxaea.mongodb.net/ecommerce?retryWrites=true&w=majority')
    .then(() => {
        console.log('Connection successful to MongoDb Atlas');
    })
    .catch((error) => {
        console.error('Error connecting:', error.message);
    });