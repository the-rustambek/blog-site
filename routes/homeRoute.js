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



router.get("/", (req, res) => {
    // console.log(req.db);
    res.render("index");
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

        let user = await req.db.users.findOne({
            email: data.email.toLowerCase(),
        });

        if (user) throw new Error("Email already exists");

        user = await req.db.users.insertOne({
            ...data,
            password:await generateCrypt(data.password)
        });
        console.log(user);
        
        res.redirect("register");
    } catch (error) {
        // console.log(error);
        res.render("register",{
            error,
        })
        // res.redirect("/register");
    }
});

router.post("/login", async (req, res) => {
    // console.log(req.body);
    try {
        const data = await LoginValidation.validateAsync(req.body);

        const user = await req.db.users.findOne({
            email: data.email.toLowerCase(),
        });

        console.log(user)

        if (!user) throw new Error("User not found");

       const isTrust = await compareHash(user.password,data.password);

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








// router.post("/register", async (req, res) => {
//     // console.log(req.body)
//     const {email,password,fullname} = req.body;

//     if (!(email && password)) {
//         res.render("login", {
//             error: "Email or Password not found",
//         });
//         return; // keyingi qatorga kod o'tib ketib qolmasligi uchun return qo'yildi
//     }
//     let user = await req.db.users.findOne({ // shu email ga boshqa odam ro'yhatdan o'tganmi yo'qmi shuni qidirib tekshirib ko'ramiz
//         email: email.toLowerCase(),
//     });
//     if (user) {
//         res.render("index", {
//             error: "Email already exists"
//         });
//         return; // keyingi qatorga kod o'tib ketib qolmasligi uchun return qo'yildi
//     }
//     // console.log(user)



//     user = await req.db.users.insertOne({ // bu yerda else ni o'rniga shunday yozsa bo'ladi, yani else siz ham shunday yozsa boladi, oldinlari ko'rgan edik boshida . yani bu yerda user bo'lmasa shunday user yaratib ol deyapti insertOne() qilib
//         fullname: fullname.toLowerCase(),
//         email: email.toLowerCase(),
//         password: await createCrypt(password),
//         data: [],
//     });
//     // console.log(user)
//     res.redirect("/login")

// });


// router.post("/login", async (req, res) => {
//     const {
//         email,
//         password
//     } = req.body;

//     if (!(email && password)) {
//         res.render("login", {
//             error: "Email or Password not found",
//         })
//         return;
//     }
//     let user = await req.db.users.findOne({
//         email: email.toLowerCase(),
//     });
//     if (!user) {
//         res.render("login", {
//             error: "User not found",
//         });
//         return;
//     };
//     // console.log(user)

//     if (!(await compareCrypt(user.password, password))) {
//         res.render("index", {
//             error: "Password is incorrect",
//         });
//         return;
//     }

//     const token = createToken({
//         user_id: user._id,
//     });

//     res.cookie("token", token).redirect("/index")


// });



























module.exports = {
    router,
    path: "/",
};