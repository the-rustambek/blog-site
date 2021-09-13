const router = require("express").Router();

router.get("/",(req,res) =>{
    res.render("index");
});

router.post("/registration",(req,res) =>{
    console.log(req.body)
    res.redirect("/")
})

module.exports = {
    router,
    path: "/",
};