const express = require("express");
const router = express.Router();
const path = require("path");

router.use(express.static(path.join(__dirname, 'public')))
// Middlewares
const Auth = require("../middlewares/Auth");

// Schema
const SignupSchema = require("../schemas/signup-schema");
const SigninSchema = require("../schemas/signin-schema");
const editActionSchema = require("../schemas/editaction-schema");

// Controllers
const AuthController = require("../controllers/AuthController");
const UserController = require("../controllers/UserController");
const AdsController = require("../controllers/AdsController");

// PING para teste
router.get("/ping", (req, res) => {
  res.json({ pong: true });
});

// Listagem dos Estados
router.get("/states", UserController.getStates);

// Login e Cadastro
router.post("/user/signin", Auth.validate(SigninSchema), AuthController.signin);
router.post("/user/signup", Auth.validate(SignupSchema), AuthController.signup);

// Informações do usuário
router.get("/user/me", Auth.private, UserController.info);
router.put("/user/me", Auth.validate(editActionSchema), Auth.private, UserController.editAction);

// Pegar categorias
router.get("/categories", AdsController.getCategories);

// Ações do Anúncio
router.post("/ad/add", Auth.private, AdsController.addAction);
router.get("/ad/list", AdsController.getList);
router.get("/ad/item", AdsController.getItem);
router.post("/ad/:id", Auth.private, AdsController.editAction);

// Roteamento de imagens de categorias e anúncios
router.get("/assets/images", (req, res) => {
  const imagePath = path.join(__dirname, "../public/media");
  res.sendFile(imagePath);
});

// Exportando as rotas
module.exports = router;