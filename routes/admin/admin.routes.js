const express = require('express');
const { adminLogin, adminRegister } = require('../../controllers/admin/admin.controller');
const router = express.Router();

router.post('/login',adminLogin);
router.post('/signup',adminRegister);

module.exports = router;