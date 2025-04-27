require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const fileupload = require("express-fileupload")

const mainRouter = require("./src/routes/main")

mongoose.connect(process.env.DATABASE)
mongoose.Promise = global.Promise;
mongoose.connection.on("error", (error) => {
   console.log("ERROR", error.message)
})

const server = express()


server.use(cors({
   origin: '*',
   methods: ['GET', 'POST', 'PUT', 'DELETE'],
   allowedHeaders: ['Content-Type', 'Authorization'],
 }));
server.use(express.json())
server.use(express.urlencoded({ extended: true }))
server.use(fileupload())

server.use(express.static(__dirname+ "/public"))

server.use("/", mainRouter)



const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

 