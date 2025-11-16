const express = require("express");
const router = express.Router();
const Policy = require("../models/policy");

router.get("/", async (req, res) => {
  const policies = await Policy.find().sort({ date: -1 });
  res.json(policies);
});

router.get("/:id", async (req, res) => {
  const policy = await Policy.findById(req.params.id);
  res.json(policy);
});

module.exports = router;
