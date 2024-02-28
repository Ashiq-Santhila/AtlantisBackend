const express = require('express');
const { noOfCompanys, noOfCreators,noOfLeaners } = require('../../controllers/dashboard/dashboard.controller');
const router = express.Router();

router.get('/noofcompany',noOfCompanys);
router.get('/noofcreators',noOfCreators);
router.get('/noofleaners',noOfLeaners);

module.exports = router;