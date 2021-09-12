require("dotenv").config();

const express = require("express")
const server = express();
const PORT = process.env.PORT || 3333;
// const cookieParser = require("cookie-parser");
const path = require("path");
// const mongo = require("mongodb")

server.use(express.json())

server.use(express.urlencoded({
    extended:true
}));
server.use(express.static(path.join(__dirname,"public")))
server.set("view engine","ejs");
server.listen(PORT,() =>{
    console.log(`Server Ready at ${PORT}`);
});

