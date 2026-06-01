const express = require("express");

const router = express.Router();

const auth =
require("../middleware/auth");

const {
    getRecommendation
} = require(
    "../controllers/recommendationController"
);

router.get(
    "/:childId",
    auth,
    getRecommendation
);

module.exports = router;