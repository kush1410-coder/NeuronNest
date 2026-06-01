const express = require("express");

const router = express.Router();

const auth =
require("../middleware/auth");

const {
    getAnalytics
} = require(
    "../controllers/analyticsController"
);

router.get(
    "/:childId",
    auth,
    getAnalytics
);

module.exports = router;