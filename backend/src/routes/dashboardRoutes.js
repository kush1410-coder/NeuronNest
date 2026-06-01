const express = require("express");

const router = express.Router();

const auth =
require("../middleware/auth");

const {
    getDashboard
} = require(
    "../controllers/dashboardController"
);

router.get(
    "/:childId",
    auth,
    getDashboard
);

module.exports = router;