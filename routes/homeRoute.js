const router = require("express").Router();
const {SignUpValidation} = require("../modules/validation");

router.get("/",(req,res) =>{
    // console.log(req.db);
    res.render("index");
});

router.post("/registration",(req,res) =>{
    // console.log(req.body);
    try {
        const data = await SignUpValidation.validateAsync(req.body);
        console.log(data);
        res.redirect("/register");
    }
    catch(error){
        console.log(error);
        res.redirect("/register");
    }
});

module.exports = {
    router,
    path: "/",
};