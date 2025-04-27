const express = require("express")
const router = express.Router()
const path = require("path")


const Auth = require("../middlewares/Auth")

// schema 
const SignupSchema = require("../schemas/signup-schema")
const SigninSchema = require("../schemas/signin-schema")
const editActionSchema = require("../schemas/editaction-schema")

const AuthController = require("../controllers/AuthController")
const UserController = require("../controllers/UserController")
const AdsController = require("../controllers/AdsController")

router.get("/ping", (req,res) => {
   res.json({ pong: true })
});

//listagem dos Estados
router.get("/states", UserController.getStates)

//login and register
router.post("/user/signin", Auth.validate(SigninSchema), AuthController.signin)
router.post("/user/signup", Auth.validate(SignupSchema), AuthController.signup)

// users info
router.get("/user/me", Auth.private, UserController.info)
router.put("/user/me", Auth.validate(editActionSchema) ,Auth.private, UserController.editAction)

// pegar categorias
router.get("/categories", AdsController.getCategories)

// acoes do Anuncio
router.post("/ad/add", Auth.private, AdsController.addAction)
router.get("/ad/list", AdsController.getList)
router.get("/ad/item", AdsController.getItem)
router.post("/ad/:id", Auth.private, AdsController.editAction)


module.exports = router