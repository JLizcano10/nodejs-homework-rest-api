const jwt = require("jsonwebtoken");
const User = require("../schemas/user");
const HttpError = require("../helpers/httpError");
require("dotenv").config();
const { SECRET } = process.env;

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
    const newUser = new User({ email, password });
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

    res.json({
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
    res.json({
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

module.exports = {
  signupUser,
  loginUser,
  currentUser,
  logoutUser,
  updateSubscription,
};
