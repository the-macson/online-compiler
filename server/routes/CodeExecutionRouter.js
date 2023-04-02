const express = require('express');
const router = express.Router();
const runCppCode = require("../controller/runCppCodeController");

// cpp  code execution route
router.post(`/submission/cpp`, runCppCode.runCppCode);

module.exports = router;