const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const {
    createStory
} = require("../controllers/storyController");

router.post(
    "/generate",
    auth,
    createStory
);

module.exports = router;