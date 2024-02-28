const express = require('express');
const {addgameActivityLog, getLastInsertedData,learnerScoreView} = require("../../controllers/playgame/playgame.controller");
const router = express.Router();
router.post('/addgame',addgameActivityLog);
router.get('/lastgame/:gid/:id',getLastInsertedData);
router.get('/learnerScoreView',learnerScoreView);

module.exports = router;