require("dotenv").config();

const express = require("express");
const server = express();
const PORT = process.env.PORT || 3333;
const cookieParser = require("cookie-parser");
const path = require("path");
const mongodb = require("./modules/mongo");
const routes =  require("./routes/routes");

server.use(express.json());

server.use(express.urlencoded({
    extended:true
}));
server.use(express.static(path.join(__dirname,"public")));

server.set("view engine","ejs");

server.listen(PORT,() =>{
    console.log(`Server Ready at ${PORT}`);
});

server.use(cookieParser());



(async () =>{
    const db = await mongodb();
    try{
        server.use((req,res,next) =>{
            req.db = db;
            next();
        });
    }
    catch(error){
        console.log(error);
        next()
    }
    finally{
        routes(server);
    }
})();

