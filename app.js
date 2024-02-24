import express from 'express';
import handlebars from 'express-handlebars';
import http from "http";
import __dirname from './utils.js';
import mongoose from 'mongoose';
import {Server} from "socket.io";
import productsRouter from './routes/routesMongo/productsMongo.router.js';
import cartsRouter from './routes/routesMongo/carts.Mongo.router.js';
import chatRouter from './routes/routesMongo/chatMongo.router.js';
import viewsRouter from "./routes/views.router.js";
import path from "path";
import MessageManager from "./dao/FSManager/models/controllers/chat.model.js";

//import uploadRouter from './routes/upload.router.js';
//import socketIo from "socket.io";
//import { dirname } from 'path';

const app = express();
const PORT = 8080;
const server= http.createServer(app)
const io = new Server(server)

//Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname+'/public')));

//Conexion de mongo con mongo de atlas
//mongodb+srv://<username>:<password>@clustercoder.b3macky.mongodb.net/
mongoose.connect('mongodb+srv://Jesicaalfonso:jesica.l.alfonso@cluster0.cuvxaea.mongodb.net/ecommerce?retryWrites=true&w=majority')
    .then(() => {
        console.log('Connection successful to MongoDb Atlas');
    })
    .catch((error) => {
        console.error('Error connecting:', error.message);
    });
//Handlebars
app.engine('handlebars', handlebars.engine({extname:".handlebars"}));
app.set('view engine', 'handlebars');
app.set('views', path.join/*resolve*/(__dirname,'views'));

//Router
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/', chatRouter)
app.use("/", viewsRouter);
//app.use('/', uploadRouter)
 

//ruta
app.get("/",(req,res)=>{
    res.render('index.handlebars');
});

const users={}
//Endpoint
const httpServer = http.createServer(app);
httpServer.listen(PORT, () =>
  console.log(`Servidor corriendo en el puerto ${PORT}`)
);
//instancia del MessageManager
const messageManager = new MessageManager();

//socket.io
io.on("connection", (socket)=>{
    console.log("un usuario se ha conectado")
    socket.on("newUser",(username)=>{
        users[socket.id] = username
        io.emit("userConnected", username)
    })

    //se recibe el evento de chatMessage
    socket.on("chatMessage",(message)=>{
        const username= users[socket.id]
        messageManager
        //Almacena el mensaje y el email en la base de datos llamando al método addMessage
        .addMessages(username, message)
        .then(io.emit("message", { username, message }))
        .catch((error) => io.emit("error", error));
    });
        //io.emit("message",{username, message})
        socket.on("disconnect", () => {
            //se elimina el usuario del arreglo
            const username = users[socket.id];
            delete users[socket.id];
            io.emit("userDisconnected", username);
          });
        });
    
    

