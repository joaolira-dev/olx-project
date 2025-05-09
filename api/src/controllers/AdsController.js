const jimp = require("jimp");
const fs = require("fs");
const { v4: uuid } = require("uuid");
const { v2: cloudinary } = require("cloudinary");
const path = require("path");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

//models
const Category = require("../models/Category");
const User = require("../models/User");
const Ad = require("../models/Ad");
const State = require("../models/State");

const addImage = async (buffer) => {
  const image = await jimp.read(buffer);
  image.cover(500, 500).quality(80);

  const processedBuffer = await image.getBufferAsync(jimp.MIME_JPEG);

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "ads", // ou qualquer pasta sua
        format: "jpg",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result.secure_url); // URL da imagem no Cloudinary
      }
    );

    stream.end(processedBuffer);
  });
}

module.exports = {
  getCategories: async (req, res) => {
    let cats = await Category.find();

    let categories = [];

    for (let i in cats) {
      categories.push({
        ...cats[i]._doc,
        img: `${process.env.BASE}/assets/images/${cats[i].slug}.png`, // Corrigido para interpolação de string
      });
    }

    res.json({ categories });
  },
  addAction: async (req, res) => {
    let { title, price, priceneg, desc, cat, token } = req.body;

    const user = await User.findOne({ token }).exec();

    if (!title || !cat) {
      return res.json({ error: "Título e/ou categoria não preenchidos" });
    }

    const category = await Category.findOne({ name: cat });

    if (!category) {
      return res.json({ error: "Categoria não existe " });
    }

    if (price) {
      price = price.replace(".", "").replace(",", ".").replace("R$ ", "");
      price = parseFloat(price);
    } else {
      price = 0;
    }

    const newAd = new Ad();
    newAd.status = true;
    newAd.idUser = user._id;
    newAd.state = user.state;
    newAd.dateCreated = new Date();
    newAd.title = title;
    newAd.category = category._id;
    newAd.price = price;
    newAd.priceNegotiable = priceneg === "true";
    newAd.description = desc;
    newAd.views = 0;
    newAd.images = [];

    // Suporte a múltiplas imagens (img ou img[])
    let files = req.files?.img || req.files?.["img[]"];
    if (files) {
      const imageArray = Array.isArray(files) ? files : [files];

      for (let file of imageArray) {
        if (["image/jpeg", "image/jpg", "image/png"].includes(file.mimetype)) {
          let url = await addImage(file.data);
          newAd.images.push({
            url,
            default: false,
          });
        } else {
          return res.json({
            error: "Tipo de imagem não suportado, apenas PNG, JPG ou JPEG",
          });
        }
      }
    }

    if (newAd.images.length > 0) {
      newAd.images[0].default = true;
    }

    const info = await newAd.save();
    res.json({ id: info._id });
  },
  getList: async (req, res) => {
    let {
      sort = "asc",
      skip = 0,
      limit = 8,
      offset = 0,
      q,
      cat,
      state,
    } = req.query;
    let filters = { status: true };
    let query = req.query;

    if (q) {
      filters.title = { $regex: q, $options: "i" };
    }

    if (cat) {
      const c = await Category.findOne({ slug: cat }).exec();
      if (c) {
        filters.category = c._id.toString();
      }
    }

    if (state) {
      const s = await State.findOne({ name: state.toUpperCase() }).exec();
      if (s) {
        filters.state = s._id;
      } else {
        filters.state = null;
      }
    }

    const total = await Ad.countDocuments(filters);

    const adsData = await Ad.find(filters)
      .sort({ dateCreated: sort === "desc" ? -1 : 1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .exec();
    let ads = [];
    for (let i in adsData) {
      let image;

      // pegando a imagem padrao
      let defaultImg = adsData[i].images.find((e) => e.default);
      if (defaultImg) {
        image = `${process.env.BASE}/media/${defaultImg.url}`; // Corrigido para interpolação de string
      } else {
        image = `${process.env.BASE}/media/default.jpg`; // Corrigido para interpolação de string
      }

      ads.push({
        id: adsData[i]._id,
        title: adsData[i].title,
        price: adsData[i].price,
        priceNegotiable: adsData[i].priceNegotiable,
        image,
      });
    }

    res.json({ ads, query, total });
  },
  getItem: async (req, res) => {
    let { id, other = null } = req.query;

    if (!id) {
      res.json({ error: "Id não enviado" });
      return;
    }

    const ad = await Ad.findById(id);
    if (!ad) {
      res.json({ error: "Produto não existe " });
      return;
    }

    ad.views++;
    await ad.save();

    let images = [];
    for (let i in ad.images) {
      images.push(`${process.env.BASE}/media/${ad.images[i].url}`); // Corrigido para interpolação de string
    }

    let category = await Category.findById(ad.category).exec();
    let userInfo = await User.findById(ad.idUser);
    let state = await State.findById(ad.state).exec();

    let others = [];
    if (other) {
      const otherData = await Ad.find({
        status: true,
        idUser: ad.idUser,
      }).exec();

      for (let i in otherData) {
        if (otherData[i]._id.toString() !== ad.id.toString()) {
          let image = `${process.env.BASE}/media/default.jpg`; // Corrigido para interpolação de string

          let defaultImg = otherData[i].images.find((e) => e.default);
          if (defaultImg) {
            image = `${process.env.BASE}/media/${defaultImg.url}`; // Corrigido para interpolação de string
          }

          others.push({
            id: otherData[i].id,
            title: otherData[i].title,
            price: otherData[i].price,
            priceNegotiable: otherData[i].priceNegotiable,
            image,
          });
        }
      }
    }

    res.json({
      id: ad._id,
      title: ad.title,
      price: ad.price,
      priceNegotiable: ad.priceNegotiable,
      description: ad.description,
      dateCreated: ad.dateCreated,
      views: ad.views,
      images,
      userInfo: {
        name: userInfo.name,
        email: userInfo.email,
      },
      category: {
        name: category.name,
        slug: category.slug,
      },
      stateName: state.name,
      others,
    });
  },
  editAction: async (req, res) => {
    let { id } = req.params;
    let { token, status, title, price, priceneg, desc, cat, images } = req.body;

    if (id.length < 12) {
      res.json({ error: "Id invalido " });
      return;
    }

    const ad = await Ad.findById(id).exec();
    if (!ad) {
      res.json({ error: "Anuncio inexistente " });
      return;
    }

    const user = await User.findOne({ token });
    if (user._id.toString() !== ad.idUser) {
      res.json({ error: "Este anuncio não é seu!" });
      return;
    }

    let updates = {};

    if (title) {
      updates.title = title;
    }
    if (price) {
      price = price.replace(".", "").replace(",", ".").replace("R$ ", "");
      price = parseFloat(price);
      updates.price = price;
    }
    if (desc) {
      updates.description = desc;
    }
    if (priceneg) {
      updates.priceNegotiable = priceneg;
    }
    if (status) {
      updates.status = status;
    }
    if (cat) {
      const category = await Category.findOne({ slug: cat }).exec();
      if (!category) {
        res.json({ error: "Categoria inexistente" });
        return;
      }
      updates.category = category._id.toString();
    }
    if (images) {
      updates.images = images;
    }

    const adUpdates = await Ad.findByIdAndUpdate(id, { $set: updates });

    if (req.files && req.files.img) {
      const adI = await Ad.findById(id);

      if (req.files.img.length == undefined) {
        if (
          ["image/jpeg", "image/jpg", "image/png"].includes(
            req.files.img.mimetype
          )
        ) {
          let url = await addImage(req.files.img.data);
          adI.images.push({
            url,
            default: false,
          });
        }
      } else {
        for (let i = 0; i < req.files.img.length; i++) {
          if (
            ["image/jpeg", "image/jpg", "image/png"].includes(
              req.files.img[i].mimetype
            )
          ) {
            let url = await addImage(req.files.img[i].data);
            adI.images.push({
              url,
              default: false,
            });
          }
        }
      }

      adI.images = [...adI.images];
      await adI.save();
    }

    res.json({
      message: "Atualizacao feita com sucesso",
    });
  },
};
