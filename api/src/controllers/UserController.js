const State = require("../models/State");
const mongoose = require("mongoose") 
const Category = require("../models/Category");
const Ad = require("../models/Ad");
const User = require("../models/User");
const bcrpyt = require("bcryptjs")
const jwt = require("jsonwebtoken")

module.exports = {
  getStates: async (req, res) => {
    let states = await State.find();
    res.json({ states });
  },
  info: async (req, res) => {
    const token = req.body.token || req.query.token || req.headers["authorization"] ;

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
    const user = await User.findOne({ token });
    if (!user) {
      res.json({ error: "Token inválido " });
      return;
    }

    const state = await State.findById(user.state);
    const ads = await Ad.find({ idUser: user._id.toString() });


    let adList = [];



    for (let i in ads) {
      const ad = ads[i]

      adList.push({ ...ad._doc });
    }

    res.json({
      name: user.name,
      email: user.email,
      state: state.name,
      ads: adList,
    });
  },
  editAction: async (req, res) => {
    const { name, password, state, token, email } = req.body;

    let updates = {};

    if (name) {
      updates.name = name;
    }
    if (email) {
      const checkEmail = await User.findOne({ email });
      if (checkEmail && checkEmail.token !== token) {
        res.json({ error: "E-mail já em uso!" });
        return;
      }
      updates.email = email;
    }
   if(state) {
    const stateCheck = await State.findOne({ name: state });
      if(!stateCheck) {
        res.json({ error: "Estado não existe" })
        return
      }
    updates.state = stateCheck._id;
   }

    if(password) {
      updates.passwordHash = bcrpyt.hash(password, 10)
    }

    await User.findOneAndUpdate({ token: token}, {$set: updates})

    res.json({ message: "Alteracao feita com sucesso! "})
  },
};
