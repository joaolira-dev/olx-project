const mongoose = require("mongoose");
const User = require("../models/User");
const State = require("../models/State");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  const { name, email, password, state } = req.body;

  const user = await User.findOne({ email: email });
  if (user) {
    res.json({ error: "Email já existe" });
    return;
  }

  if (mongoose.Types.ObjectId.isValid(state)) {
    const stateItem = await State.findById(state);
    if (!stateItem) {
      res.json({ error: "Estado não existe" });
      return;
    }
  } else {
    res.json({ error: "Codigo de estado não existe" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const token = jwt.sign({ email, name }, process.env.JWT_SECRET_KEY);

  const newUser = new User({
    name,
    email,
    passwordHash,
    token,
    state
  });
  await newUser.save();

  res.json({ name, email, passwordHash, token, state });
}

const signin = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email });
  if (!user) {
    res.json({ error: "E-mail e/ou senha errados!" });
    return;
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    res.json({ error: "E-mail e/ou senha errados!" });
    return;
  }


  const passwordHash = await bcrypt.hash(password, 10);

  const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY);

  user.token = token;
  await user.save();

  res.json({ message: "Logado com sucesso", email: email, token: token });
}

module.exports = { signup, signin };
