const express = require('express');
const {addlearner,updatelearner,deletelearner,getlearner,getlearnerById,updateStatus,passwordSetMail} = require('../../controllers/learner/learner.controller');
const router = express.Router();

router.post('/addlearner',addlearner);
router.post('/getlearner',getlearner);
router.get('/getlearnerById/:id',getlearnerById);
router.put('/updatelearner/:id',updatelearner);
router.put('/learnerstatus/:id',updateStatus);
router.get('/deletelearner/:id',deletelearner);
router.post('/sendpasswordsetmail',passwordSetMail);
module.exports = router;