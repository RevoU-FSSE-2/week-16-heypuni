const { Router } = require("express");
const { getDataXss, getClickJacking, createClickJacking } = require ("../controller/preventAttackController");

const router = Router();

router.get("/xss", getDataXss);
router.get("click-jacking", getClickJacking);
router.get("/click-jacking", createClickJacking);

module.exports = router;