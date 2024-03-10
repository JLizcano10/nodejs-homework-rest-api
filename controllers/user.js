const jwt = require("jsonwebtoken");
const User = require("../schemas/user");
const HttpError = require("../helpers/httpError");
require("dotenv").config();
const { SECRET } = process.env;
const fs = require("fs").promises;
const path = require("path");
const Jimp = require("jimp");
const gravatar = require("gravatar");

const storeAvatar = path.join(process.cwd(), "public/avatars");

const signupUser = async (req, res, next) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(409).json({
      status: "error",
      code: 409,
      message: "Email is already in use",
      data: "Conflict",
    });
  }

  try {
    const avatarURL = gravatar.url(email);
    const newUser = new User({ email, password, avatarURL });
    newUser.setPassword(password);
    await newUser.save();
    res.status(201).json({
      status: "created",
      code: 201,
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  const { password, email } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser || !existingUser.validPassword(password)) {
      return res.status(401).json({
        status: "unauthorized",
        code: 400,
        message: "Email or password is wrong",
      });
    }

    const payload = {
      id: existingUser.id,
    };

    const token = jwt.sign(payload, SECRET, { expiresIn: "1h" });

    existingUser.token = token;
    await existingUser.save();

    res.status(200).json({
      status: "success",
      code: 200,
      data: {
        token,
        user: {
          email: existingUser.email,
          subscription: existingUser.subscription,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const currentUser = async (req, res) => {
  try {
    res.status(200).json({
      email: req.user.email,
      subscription: req.user.subscription,
    });
  } catch (error) {
    next(error);
  }
};

const logoutUser = async (req, res, next) => {
  const { _id } = req.user;
  try {
    const result = await User.findByIdAndUpdate(_id, { token: null });
    res.status(204).json({
      status: "success",
      code: 204,
      message: "No Content",
    });
  } catch (error) {
    next(error);
  }
};

const updateSubscription = async (req, res, next) => {
  const { _id } = req.user;
  const { subscription } = req.body;
  console.log(subscription);

  if (
    subscription !== "starter" &&
    subscription !== "pro" &&
    subscription !== "business"
  ) {
    return res.status(400).json({
      message:
        "Please enter a suitable subscription value between starter, pro & business",
    });
  }

  try {
    const result = await User.findByIdAndUpdate(
      _id,
      { subscription },
      {
        new: true,
      }
    );

    return res.status(200).json({
      status: "success",
      code: 200,
      show: {
        email: result.email,
        subscription: result.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateAvatar = async (req, res, next) => {
  const { _id } = req.user;
  const { path: temporaryName, originalname } = req.file;
  const avatarName = `${_id}_${originalname}`;
  const fileName = path.join(storeAvatar, avatarName);
  try {
    // Cambio de nombre y redimensionamiento
    const image = await Jimp.read(temporaryName);
    await image.resize(250, 250).writeAsync(fileName);

    // Eliminar archivo temporal
    await fs.unlink(temporaryName);

    const avatarURL = path.join("avatars", avatarName);
    await User.findByIdAndUpdate(_id, { avatarURL });

    res.status(200).json({ avatarURL });
  } catch (error) {
    console.error("Error al procesar el avatar:", error);
    res.status(500).json({ error: "Error al procesar el avatar" });
  }
};

module.exports = {
  signupUser,
  loginUser,
  currentUser,
  logoutUser,
  updateSubscription,
  updateAvatar,
};
