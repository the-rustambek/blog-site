const router = require("express").Router();
const {
    SignUpValidation
} = require("../modules/validation");
const {
    generateCrypt
} = require("../modules/bcrypt")
const {LoginValidation} = require("../modules/validation")
const {compareHash} = require("../modules/bcrypt")
const {createToken} = require("../modules/jwt")
const expressFileupload = require("express-fileupload");
const path = require("path")
const {
    checkToken
} = require("../modules/jwt")


router.get("/", (req, res) => {
    // console.log(req.db);
    const contact = req.db.contact.find().toArray();
    
    res.render("index",{
        contact,
    });
});


router.get("/login", (req, res) => {
    res.render("login")
})

router.get("/register", (req, res) => {
    res.render("register")
})

router.post("/register", async (req, res) => {
    // console.log(req.body);
    try {
        const data = await SignUpValidation.validateAsync(req.body);
        // console.log(data)
        let user = await req.db.users.findOne({
            email: data.email.toLowerCase(),
        });

        if (user) throw new Error("Email already exists");

        user = await req.db.users.insertOne({
            ...data,
            password:await generateCrypt(data.password)
        });
        // console.log(user);
        
        res.redirect("login");
    } catch (error) {
        console.log(error);
        res.render("register",{
            error,
        })
        // res.redirect("/login");
    }
});

router.post("/login", async (req, res) => {
    // console.log(req.body);
    try {
        const data = await LoginValidation.validateAsync(req.body);

        const user = await req.db.users.findOne({
            email: data.email,
        });

        // console.log(user);

        if (!user) throw new Error("User not found");

       const isTrust = await compareHash(data.password,user.password);
    // console.log(isTrust);
       if(!isTrust) throw new Error("Password is incorrect");

       const token = await createToken({
           id: user._id,
       })
        
       res.cookie("token", token).redirect("/")
        
    } catch (error) {
        // console.log(error);
        res.render("login",{
            error,
        })
        
    }
});

async function AuthUserMiddleware(req, res, next) { //global middleware
    if (!req.cookies.token) {
        res.redirect("/login");
        return
    }

    const isTrust = checkToken(req.cookies.token);

    console.log(isTrust)

    if (isTrust) {
        req.user = isTrust;
        console.log(isTrust);
        next()
    } else {
        res.redirect("/login")
        return 
    }
};



router.post("/contact", AuthUserMiddleware,expressFileupload(), async(req,res) =>{

    req.files.file.mv(path.join(__dirname,".." ,"public","files",req.files.file.name));

    await req.db.contact.insertOne({
        name: req.body.name,
        file: req.files.file.name,
        textarea: req.body.textarea,
    })
res.redirect("/")
})



module.exports = {
    router,
    path: "/",
};