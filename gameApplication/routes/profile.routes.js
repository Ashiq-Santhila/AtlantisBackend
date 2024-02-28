const express = require('express');
const { Login, adminRegister,changePassword } = require('../../gameApplication/controllers/siteuser.controller');
const router = express.Router();

router.post('/login',Login);
router.put('/changepassword/:id',changePassword);
module.exports = router;