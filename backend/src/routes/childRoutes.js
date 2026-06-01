const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const {
    createChild,
    getChildren,
    getChildById,
    updateChild,
    deleteChild
} = require("../controllers/childController");

router.post("/", auth, createChild);

router.get("/", auth, getChildren);

router.get("/:id", auth, getChildById);

router.put("/:id", auth, updateChild);

router.delete("/:id", auth, deleteChild);

module.exports = router;