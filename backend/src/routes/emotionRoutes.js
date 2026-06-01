const express = require("express");

const router = express.Router();

const auth =
require("../middleware/auth");

const {
    createEmotion,
    getEmotions
} = require(
    "../controllers/emotionController"
);

router.post(
    "/",
    auth,
    createEmotion
);

router.get(
    "/:childId",
    auth,
    getEmotions
);

module.exports = router;