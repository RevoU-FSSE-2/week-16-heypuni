const { Router } = require("express");
const productRoute = require("./product");
const authRoute = require("./authroute");
const homeRoute = require("./home");
const attackRoute = require("./attack")

const router = Router();

router.use("/", homeRoute);
router.use("/api/v1/auth", authRoute);
router.use("/api/v1/attack", attackRoute);
router.use("/api/v1/products", productRoute);

module.exports = router;