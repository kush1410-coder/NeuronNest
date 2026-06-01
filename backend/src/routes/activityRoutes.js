const express = require("express");

const router = express.Router();

const auth =
require("../middleware/auth");

const {
    createActivity,
    getActivities
} = require(
    "../controllers/activityController"
);

router.post(
    "/",
    auth,
    createActivity
);

router.get(
    "/:childId",
    auth,
    getActivities
);

module.exports = router;