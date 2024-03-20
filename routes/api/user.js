const express = require("express");
const ctrl = require("../../controllers/user");
const auth = require("../../middlewares/auth");
const upload = require("../../middlewares/multerAvatar");

const router = express.Router();

router.post("/signup", ctrl.signupUser);

router.post("/login", ctrl.loginUser);

router.get("/current", auth, ctrl.currentUser);

router.get("/logout", auth, ctrl.logoutUser);

router.patch("/", auth, ctrl.updateSubscription);

router.post("/avatars", auth, upload.single("avatar"), ctrl.updateAvatar);

router.get("/verify/:verificationToken", ctrl.verify);

router.post("/verify", ctrl.resendVerifyEmail);

module.exports = router;
