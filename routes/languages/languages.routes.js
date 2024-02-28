const express = require('express');
const {getLanguages,updatelanguages,getCreatedLanguages,updateLanguageContent} = require('../../controllers/languages/languages.controller');
const router = express.Router();


router.get('/getlanguages',getLanguages);
router.post('/getcreatedlanguages',getCreatedLanguages);
router.post('/updatelanguages',updatelanguages);
// vignesh 10-01-24
router.post('/updatecontent',updateLanguageContent);


module.exports = router;