const express = require('express');
const {getAssignedGames,getGamePlay,learnerUpdation,getleaderBoard,learnerDasboard} = require('../../gameApplication/controllers/gamePlay.controller');
const router = express.Router();

router.get('/getAssignedGames/:id',getAssignedGames);
router.get('/getgameplay/:id',getGamePlay);
router.get('/getleaderboard/:id',getleaderBoard);
router.get('/learnerdashboard',learnerDasboard);

router.post('/updateprofile',learnerUpdation);


module.exports = router;