const express = require('express');
const {createActivity, ReacordActivity} = require('../../gameApplication/controllers/gameActivityLog.controller');
const router = express.Router();

router.post('/create',createActivity);
router.put('/update/:id',ReacordActivity);



module.exports = router;