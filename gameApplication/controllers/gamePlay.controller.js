const { generateToken } = require("../../lib/authentication/auth");
const { Sequelize, Op, where } = require('sequelize');
const transporter = require("../../lib/mails/mailService");
const { adminRegisterSchema, adminLoginSchema } = require("../../lib/validation/admin.validation");
const Learnerprofile = require("../../models/learner")
const GameTable = require("../../models/game");
const BlockTable = require("../../models/blocks");
const QuestionTable = require("../../models/questionOptions");
const AssetTable = require("../../models/gameAsset");
const SkillTable = require('../../models/skills');
const ReflectionTable = require('../../models/reflectionQuestions');
const cmpanyDetails = require('../../models/companies');
const AssignedGames = require('../../models/gameassinged');
const LearnerList = require('../../models/learner');
const GameActivityLog = require('../../models/gameActivityLog');
const Animation = require('../../models/animation')
const gameassest = require("../../models/gameAsset")
const bcrypt = require('bcrypt');

const sequelize = require("../../lib/config/database");
const { gameAssign } = require("../../controllers/game/game.controller");




const getAssignedGames = async (req, res) => {
  try {
    const id = req?.params?.id;
    if (!id) return res.status(404).json({ status: 'Failure', message: "Id Need" });


    // const getgamelist await AssignedGames
    // if (count === 0) {
    //   return res.status(404).json({ status:'Failure', message: "No records found" });
    // }
    const LoginUserId = req.user.user.id;

    const getgamelist = await AssignedGames.findAll({
      attributes: ['gaGameId'],
      where: {
        gaLearnerId: LoginUserId,
        gaDeleteStatus: 'No'
      },
      order: [['gaGameId', 'ASC']]
    });
    leangames = getgamelist.map((al) => al.gaGameId);

    const gameData = await GameTable.findAll({
      include: [
        {
          model: gameassest,
          as: 'image',
          attributes: [
            [Sequelize.literal(`CONCAT('${req.protocol}://${req.get('host')}/', gasAssetImage)`), 'gasAssetImage']
          ],
          required: false,
        }
      ],
      where: {
        gameId: {
          [Op.in]: leangames,
        },
      },
    });





    if (gameData) {

      return res.status(200).json({
        status: 'Success',
        message: "All Data Retrieved Successfully",
        data: gameData,
      });
    }
    else {
      return res.status(400).json({
        status: 'Failure',
        message: "No Games Assinged",


      });

    }




  } catch (error) {
    res.status(500).json({ status: 'Failure', message: "Internal Server Error", err: error.message });
  }

}
const getGamePlay = async (req, res) => {
  // return res.status(200).json({ data: req})
  try {
    const id = req?.params?.id;
    /*************************QuestList****************************************************** */
    const getQuestList = await GameTable.findAll({
      attributes: ['gameQuestNo', 'gameTotalScore', 'gameTitle'],
      where: {
        gameExtensionId: id,
        gameDeleteStatus: 'No'
      },
      order: [['gameId', 'ASC']]
    });
    const questNumbersArray = getQuestList.map((game) => game.gameQuestNo);

    /****************************Activity Log*********************************************************************/
    const getplayStatus = await GameActivityLog.findAll({
      attributes: [
        'galGameId',
        'galQuestNo',
        'galAverageScore',
        'galQuestionState',
        [Sequelize.fn('MAX', Sequelize.col('galId')), 'lastValue'],
      ],
      where: {
        galGameId: id,
      },
      group: ['galQuestNo'],
    });



    /*****************************StartScreen*********************************************************** */
    const getGameDetails = await GameTable.findOne({

      where: {
        gameExtensionId: id,
        gameDeleteStatus: 'No'
      },
      order: [['gameId', 'ASC']]
    });

    const startScreenObject = {
      gameTitle: getGameDetails?.gameTitle ? getGameDetails?.gameTitle : null
    };
    /*********************************Background vOICE************************************************************* */


    getImage = await AssetTable.findOne({
      attributes: [
        [Sequelize.literal(`CONCAT('${req.protocol}://${req.get('host')}/', gasAssetImage)`), 'gasAssetImage']
      ],
      where: {
        gasId: getGameDetails.gameBackgroundId,
      },
    });


    ///Afrith-modified-starts-29/Feb/24///
    getBadgeImage = await AssetTable.findOne({
      attributes: [
        [Sequelize.literal(`CONCAT('${req.protocol}://${req.get('host')}/', gasAssetImage)`), 'gasAssetImage']
      ],
      where: {
        gasId: getGameDetails.gameBadge ? getGameDetails.gameBadge : 1,
      },
    });

    let badgeImageUrl;
    if (getBadgeImage) {
        badgeImageUrl = getBadgeImage.gasAssetImage;
    } else {
        // Handle the case when getBadgeImage is null
        console.error("No badge image found for the specified gameBadge:", getGameDetails.gameBadge);
    }
    ///Afrith-modified-ends-29/Feb/24///


    getNpcImage = await gameassest.findOne({
      attributes: [
        [Sequelize.literal(`CONCAT('${req.protocol}://${req.get('host')}/', gasAssetImage)`), 'gasAssetImage']
      ],
      where: {
        gasId: getGameDetails.gameNonPlayingCharacterId,
      },
    });
    getMusic = await gameassest.findOne({
      attributes: [
        [Sequelize.literal(`CONCAT('${req.protocol}://${req.get('host')}/', gasAssetImage)`), 'gasAssetImage']
      ],
      where: {
        gasId: getGameDetails.gameIntroMusic,
      },
    });

    const BackgroundVoiceObject = {
      BadgeImage : badgeImageUrl ? badgeImageUrl :null,
      BackgroundImage: getImage.gasAssetImage ? getImage.gasAssetImage : null,
      NPCvoice: getGameDetails.gameNonPlayerVoice ? getGameDetails.gameNonPlayerVoice : null,
      ///Afrith-modified-starts-26/Feb/24///
      NPCname: getGameDetails.gameNonPlayerName ? getGameDetails.gameNonPlayerName : null,
      ///Afrith-modified-ends-26/Feb/24////

      // NPCname: getGameDetails.gameNonPlayerName ? getGameDetails.gameNonPlayerVoice : null,
      PCMaleVoice: getGameDetails.gamePlayerMaleVoice ? getGameDetails.gamePlayerMaleVoice : null,
      PCFelmaeVoice: getGameDetails.gamePlayerFemaleVoice ? getGameDetails.gamePlayerFemaleVoice : null,
      Narrator: getGameDetails.gameNarratorVoice ? getGameDetails.gameNarratorVoice : null,
      NPC: getGameDetails.gameNonPlayingCharacterId ? getGameDetails.gameNonPlayingCharacterId : null,
      NPCImage: getNpcImage.gasAssetImage ? getNpcImage.gasAssetImage : null,
      storyline: getGameDetails.gameStoryLine ?? null,
      test: getGameDetails.gameNonPlayingCharacterId,
      IntroMusic: getMusic.gasAssetImage ?? null,
    };



    /************************************Welcome Screen ********************************************************************* */
    const SkillId = getGameDetails.gameSkills.split(',').map(Number);

    SkillNames = await SkillTable.findAll({
      attributes: ['crSkillName'],
      where: {
        crSkillId: {
          [Op.in]: SkillId,
        },
      },
    });
    const SkillArray = SkillNames.map((skill) => skill.crSkillName);
    const welcomeScreenObject = {
      gameSkills: SkillArray ?? null,
      gameStoryLine: getGameDetails.gameStoryLine ?? null,
      gameLearningOutcome: getGameDetails.gameLearningOutcome ?? null,
      gameDuration: getGameDetails.gameDuration ?? null,
      gameAuthorName: getGameDetails.gameAuthorName ?? null,
      gameIsShowAdditionalWelcomeNote: getGameDetails.gameIsShowAdditionalWelcomeNote ?? null,
      gameAdditionalWelcomeNote: getGameDetails.gameAdditionalWelcomeNote ?? null,
    };
    /****************************************Screens****************************************************************** */

    /********Leaderboard***************** */
    const LeaderBoardObject = {

      gameIsShowLeaderboard: getGameDetails.gameIsShowLeaderboard ?? null,

    };
    /*************Reflection******************** */

    ReflectionQuestion = await ReflectionTable.findAll({
      attributes: ['refQuestion'],
      where: {
        refGameId: id,
        refDeleteStatus: 'NO'
      },
    });
    let ReflectionQuestionArray
    if (ReflectionQuestion) {
      ReflectionQuestionArray = ReflectionQuestion.map((ref) => ref.refQuestion);


    }
    const ReflectionObjet = {
      gameIsShowReflectionScreen: getGameDetails.gameIsShowReflectionScreen ?? null,
      gameReflectionQuestion: getGameDetails.gameReflectionQuestion ?? null,
      refQuestion: ReflectionQuestionArray ?? null,

    }
    /*************TakeWay******************** */
    const TakeawaysObject = {
      // gameIsShowTakeaway: getGameDetails.gameTakeawayScreenId ?? null,
      ///Afrith-modified-starts-01/Mar/24//
        gameIsShowTakeaway: getGameDetails.gameIsShowTakeaway ?? null,
        gameTakeawayScreenId: getGameDetails.gameTakeawayScreenId ?? null,
      ///Afrith-modified-ends-01/Mar/24//
      gameTakeawayContent: getGameDetails.gameTakeawayContent ?? null,
    }
    /*************ThankYou******************** */
    const ThankYouObject = {
      ///Afrith-modified-starts-01/Mar/23//
      gameThankYouScreenId: getGameDetails.gameThankYouScreenId ?? null,
      ///Afrith-modified-ends-01/Mar/23//
      gameThankYouMessage: getGameDetails.gameThankYouMessage ?? null,
      gameIsCollectLearnerFeedback: getGameDetails.gameIsCollectLearnerFeedback ?? null,
      gameContent: getGameDetails.gameContent ?? null,
      gameRelevance: getGameDetails.gameRelevance ?? null,
      gameRecommendation: getGameDetails.gameRecommendation ?? null,
      gameBehaviour: getGameDetails.gameBehaviour ?? null,
      gameOthers: getGameDetails.gameOthers ?? null,
      gameRecommendation: getGameDetails.gameRecommendation ?? null,
      gameFeedBack: getGameDetails.gameFeedBack ?? null,
      gameFeedBackLink: getGameDetails.gameFeedBackLink ?? null,

    }
    /*************Total Screen******************** */
    const ScreenObject = {}
    ScreenObject["1"] = LeaderBoardObject;
    ScreenObject["2"] = ReflectionObjet;
    ScreenObject["3"] = TakeawaysObject;
    ScreenObject["4"] = ThankYouObject;

    /*****************************************Game play******************** **********************/



    let stroy = await BlockTable.findAndCountAll({
      where: {
        blockGameId: id,
        blockDeleteStatus: 'NO',
      },
      order: [['blockPrimarySequence', 'ASC'], ['blockQuestNo', 'ASC']]
    });

    let resultObject = {};
    let itemObject = {};
    let alpabetObject = {};
    let interactionBlockObject = {};
    let maxInput = -Infinity;
    const alpabetObjectsArray = [];
    const pushoption = [];
    let lastItem;

    const alpacount = await QuestionTable.findOne({
      attributes: ['qpSecondaryId'],
      where: { qpGameId: id },
      order: [['qpOptionId', 'DESC']],
      limit: 1,
    });

    let j = 0;
    let idCounter = 1;
    let upNextCounter = 2;
    for (let [index, result] of stroy.rows.entries()) {
      let optionsObject = {};
      let ansObject = {};
      let feedbackObject = {};
      let responseObject = {};
      let optionTitleObject = {};
      let optionsemotionObject = {};
      let optionsvoiceObject = {};
      let responseemotionObject = {};
      let scoreObject = {};
      let navigateObjects = {};
      let navigateshowObjects = {};

      // Assuming blockSecondaryId is the property you want to use as the key
      let key = result.blockChoosen + result.blockSecondaryId;
      let currentVersion = result.blockPrimarySequence;
      let major = currentVersion.split('.');
      // Construct the value object with the desired properties
      if (result.blockChoosen === 'Note') {
        let value = {
          id: result.blockDragSequence,
          // Add other properties as needed
          note: result.blockText,
          status: 'yes',
          Notenavigate: result.blockLeadTo,
          NoteleadShow: result.blockShowNavigate,
          // Add other properties as needed
        };
        resultObject[key] = value;
      }
      if (result.blockChoosen === 'Dialog') {
        let value = {
          id: result.blockDragSequence,
          dialog: result.blockText,
          character: result.blockRoll,
          animation: result.blockCharacterposesId,
          voice: result.blockVoiceEmotions,
          DialogleadShow: result.blockShowNavigate,
          Dialognavigate: result.blockLeadTo,
        };




        resultObject[key] = value;
      }


      if (result.blockChoosen === 'Interaction') {

        try {


          const Question = await QuestionTable.findAll({
            where: {
              qpQuestionId: result.blockId,
              qpDeleteStatus: 'NO'
            },
            order: [['qpSecondaryId', 'ASC']],

          });

          console.log('Question', Question);
          // return res.status(500).json({ status: 'Failure' ,error:result.blockId });
          for (let [i, rows] of Question.entries()) {
            // Use for...of loop or Promise.all to handle async/await correctly
            let value = {
              seqs: major[0] + '.' + idCounter,
              option: rows.qpOptions,
              secondaryId: rows.qpSecondaryId,
            };
            /*******************
             * optionsObject :{ a: test1 ,b: ,c: }
             * optionsObject :{ a: test2 ,b: ,c: }
             * 
             * 
             * 
             */

            console.log('rows', rows);
            optionsObject[rows.qpOptions] = rows.qpOptionText ? rows.qpOptionText : '';
            ansObject[rows.qpOptions] = rows.qpTag ? rows.qpTag : '';

            feedbackObject[rows.qpOptions] = rows.qpFeedback ? rows.qpFeedback : '';

            responseObject[rows.qpOptions] = rows.qpResponse ? rows.qpResponse : '';

            optionTitleObject[rows.qpOptions] = rows.qpTitleTag ? rows.qpTitleTag : '';

            optionsemotionObject[rows.qpOptions] = rows.qpEmotion ? rows.qpEmotion : '';
            optionsvoiceObject[rows.qpOptions] = rows.qpVoice ? rows.qpVoice : '';
            responseemotionObject[rows.qpOptions] = rows.qpResponseEmotion ? rows.qpResponseEmotion : '';
            scoreObject[rows.qpOptions] = rows.qpScore ? rows.qpScore : '';
            navigateObjects[rows.qpOptions] = rows.qpNextOption ? rows.qpNextOption : '';
            navigateshowObjects[rows.qpOptions] = rows.qpNavigateShow ? rows.qpNavigateShow : '';

            alpabetObjectsArray.push(value);
            console.log('After push:', alpabetObjectsArray);
            if (rows.qpResponse) {
              interactionBlockObject[`Resp${result.blockSecondaryId}`] = result.blockSecondaryId;
            }
            if (rows.qpFeedback) {
              interactionBlockObject[`Feedbk${result.blockSecondaryId}`] = result.blockSecondaryId;
            }
            if (rows.qpTitleTag || result.blockTitleTag) {
              interactionBlockObject[`Title${result.blockSecondaryId}`] = result.blockSecondaryId;
            }
            if (result.blockSkillTag) {
              interactionBlockObject[`Skills${result.blockSecondaryId}`] = result.blockSecondaryId;

            }
          }
          console.log('Final array:', optionsemotionObject);

          pushoption.push(optionsObject)
          // return res.status(500).json({ status: 'Failure' ,error:scoreObject });

          let value = {
            QuestionsEmotion: result.blockCharacterposesId,
            QuestionsVoice: result.blockVoiceEmotions,
            ansObject: ansObject,
            blockRoll: result.blockRoll,
            feedbackObject: feedbackObject,
            interaction: result.blockText,
            navigateObjects: navigateObjects,
            navigateshowObjects: navigateshowObjects,
            optionTitleObject: optionTitleObject,
            optionsObject: optionsObject,
            optionsemotionObject: optionsemotionObject,
            optionsvoiceObject: optionsvoiceObject,
            quesionTitle: result.blockTitleTag,
            responseObject: responseObject,
            responseemotionObject: responseemotionObject,
            scoreObject: scoreObject,
            responseRoll: result.blockResponseRoll,
            SkillTag: result.blockSkillTag,
            status: 'yes',
          };

          console.log('values', value)
          resultObject[key] = value;




        } catch (error) {
          return res.status(500).json({ status: 'Failure', error: error.message });
        }

      }


      let items = {
        id: major[0] + '.' + idCounter,
        type: result.blockChoosen,
        upNext: major[0] + '.' + upNextCounter,
        input: result.blockSecondaryId,
        questNo: result.blockQuestNo
      };
      idCounter += 1;
      upNextCounter += 1;



      itemObject[index++] = items;
      // Assign the value object to the key in the resultObject
      lastItem = items.upNext;
      maxInput = Math.max(maxInput, items.input);

    }


    // return res.status(400).json({ status: 'Success' ,error:pushoption });

    for (let i = 0; i < alpabetObjectsArray.length; i++) {
      // Get the current row from the array
      const rows = alpabetObjectsArray[i];

      // Create a new value object
      let value = {
        seqs: rows.seqs,
        option: rows.option,
        secondaryId: rows.secondaryId,
      };

      // Set the value in the alphabetObject using the current key
      alpabetObject[i] = value;

      // Update key for the next iteration if needed


      // You can also console.log the created object if needed
      // console.log(alphabetObject);
    }


    const versionCompare = (a, b) => {
      const versionA = a.split('.').map(Number);
      const versionB = b.split('.').map(Number);

      if (versionA[0] !== versionB[0]) {
        return versionA[0] - versionB[0];
      } else {
        return versionA[1] - versionB[1];
      }
    };

    // Sorting the object keys based on the version of "id"
    const sortedKeys = Object.keys(itemObject).sort((a, b) => versionCompare(itemObject[a].id, itemObject[b].id));

    // Creating a new object with sorted keys
    const sortedItems = {};
    sortedKeys.forEach(key => {
      sortedItems[key] = itemObject[key];
    });


    /*****************************************Blocks Details******************** **********************/

    const getBlocksDetails = await BlockTable.findOne({
      where: {
        blockId: id
      },
      order: [['blockId', 'ASC']]
    });

    console.log('@@@555', getBlocksDetails)

    const blocksObjects = {
      blocksDetails: getBlocksDetails ? getBlocksDetails : 'sorry no data'
    }



    // return res.status(500).json({ status: 'Failure' ,error:itemObject });





    // status: 'Success',
    // items: itemObject,
    // input: resultObject,
    // alp:alpabetObject,
    // intra:interactionBlockObject,



    const gameplayObject = {
      items: itemObject,
      input: resultObject,
      alp: alpabetObject,
      intra: interactionBlockObject,
    };
    /***************************Completion screen *********************************** */
    const completionScreen = {
      gameTotalScore: getGameDetails.gameTotalScore ?? null,

      gameIsSetMinimumScore: getGameDetails.gameIsSetMinimumScore ?? null,

      gameMinScore: getGameDetails.gameMinScore ?? null,
    
      gameDistinctionScore:getGameDetails.gameDistinctionScore??null,

      gameIsSetBadge:getGameDetails.gameIsSetBadge??null,

      gameaboveMinimumScoreCongratsMessage: getGameDetails.gameaboveMinimumScoreCongratsMessage ?? null,

      gameMaxScore: getGameDetails.gameMaxScore ?? null,

      gameBadge: getGameDetails.gameBadge ?? null,

      gameBadgeName: getGameDetails.gameBadgeName ?? null,

      gameIsSetCriteriaForBadge: getGameDetails.gameIsSetCriteriaForBadge ?? null,

      gameAwardBadgeScore: getGameDetails.gameAwardBadgeScore ?? null,

      gameScreenTitle: getGameDetails.gameScreenTitle ?? null,
      gameIsSetCongratsSingleMessage: getGameDetails.gameIsSetCongratsSingleMessage ?? null,

      gameIsSetCongratsScoreWiseMessage: getGameDetails.gameIsSetCongratsScoreWiseMessage ?? null,

      gameCompletedCongratsMessage: getGameDetails.gameCompletedCongratsMessage ?? null,

      gameMinimumScoreCongratsMessage: getGameDetails.gameMinimumScoreCongratsMessage ?? null,

      gameLessthanDistinctionScoreCongratsMessage: getGameDetails.gameLessthanDistinctionScoreCongratsMessage ?? null,

      gameAboveDistinctionScoreCongratsMessage: getGameDetails.gameAboveDistinctionScoreCongratsMessage ?? null,

    };


    /***********Leaner Profile************************ */
    const LoginUserId = req.user.user.id;
    const getlen = await Learnerprofile.findOne({
      where: {
        lenId: LoginUserId
      },


    });

    const getOrgansation = await cmpanyDetails.findOne({

      where: {
        cpId: getlen.lenCompanyId,

      },
    });

    const learnerProfiles = {
      lenUserName: getlen.lenUserName ?? null,
      lenRegion: getlen.lenRegion ?? null,
      lenEducation: getlen.lenEducation ?? null,
      lenNickName: getlen.lenNickName ?? null,
      lenMail: getlen.lenMail ?? null,
      lenDepartment: getlen.lenDepartment ?? null,
      lenAge: getlen.lenAge ?? null,
      lenGender: getlen.lenGender ?? null,
      lenCountryId: getlen.lenCountryId ?? null,
      lenCompanyId: getOrgansation.cpCompanyName ?? null,
    };


    /*********************************************************************************************** */
    return res.status(200).json({
      status: 'Success',
      QuestList: questNumbersArray,
      BackgroundVoice: BackgroundVoiceObject,
      StartScreen: startScreenObject,
      WelcomeScreen: welcomeScreenObject,
      gameplay: gameplayObject,
      screens: ScreenObject,
      blocks: blocksObjects,
      completionScreen: completionScreen,
      learnerProfile: learnerProfiles,
      Playstatus: getplayStatus,
      questScore: getQuestList,      
    });


  }
  catch (error) {
    res.status(500).json({ status: 'Failure', message: "Internal Server Error", err: error.message });
  }
}

const learnerUpdation = async (req, res) => {
  try {

    let data = req?.body
    if (!data) {
      return res.status(400).json({ status: 'Failure', message: "Data Not Recived", err: error.message });
    }
    const LoginUserId = req.user.user.id;

    const [rowCount, updatedRows] = await Learnerprofile.update({
      lenUserName: data.lenUserName,
      lenRegion: data.lenRegion,
      lenEducation: data.lenEducation,
      lenNickName: data.lenNickName,
      lenDepartment: data.lenDepartment,
      lenAge: data.lenAge,
      ///Afrith-modified-satrts-26/Feb/24///
      lenGender: data.lenGender,
      lenCountryId: data.lenCountryId
      ///Afrith-modified-ends-26/Feb/24////

      // lenGender: getlen.lenGender, // Uncomment if needed
      // lenCountryId: getlen.lenCountryId, // Uncomment if needed
    }, {
      where: {
        lenId: LoginUserId,
      },
    });

    if (rowCount > 0) {
      console.log(`Update successful. ${rowCount} row(s) updated.`);
      console.log(updatedRows); // This will show the actual updated rows
      return res.status(200).json({ status: 'Success', message: `Update successful. ${rowCount} row(s) updated.` });
    } else {
      console.log(`No rows were updated.`);
      return res.status(400).json({ status: 'Failure', message: `No rows were updated.` });

    }

    // return res.status(400).json({ status: 'Failure', message: updateprofile });
  }

  catch (error) {
    res.status(500).json({ status: 'Failure', message: "Internal Server Error", err: error.message });
  }

}
const getleaderBoard = async (req, res) => {
  try {
    const { id } = req.params;

    leanList = await AssignedGames.findAll({
      attributes: ['gaLearnerId'],
      where: {
        gaGameId: id,
        gaDeleteStatus: 'No'
      },
      order: [['gaLearnerId', 'ASC']]
    });

    leanIn = leanList.map((al) => al.gaLearnerId);

    const result = await GameActivityLog.findAll({
      attributes: [
        'galLearnerId',
        [sequelize.fn('SUM', sequelize.col('galAverageScore')), 'totalAverageScore'],
      ],
      where: {
        galGameId: id,
        galLearnerId: {
          [Op.in]: leanIn,
        },

      },
      group: ['galLearnerId'],
      order: [[sequelize.fn('SUM', sequelize.col('galAverageScore')), 'DESC']], // or 'ASC' for ascending order
    });

    const learnerScores = await Promise.all(result.map(async (item) => {
      const leanList = await LearnerList.findOne({
        attributes: ['lenUserName'],
        where: {
          lenId: item.galLearnerId,
        },
      });

      return {
        learnerId: leanList ? leanList.lenUserName : null,
        totalAverageScore: item.dataValues.totalAverageScore,
      };
    }));

    console.log(learnerScores);
    if (learnerScores) {
      return res.status(200).json({ status: 'Success', data: learnerScores });
    }
    else {
      return res.status(200).json({ status: 'Failure', Message: 'LeaderBoard is Empty' });
    }

  }

  catch (error) {
    res.status(500).json({ status: 'Failure', message: "Internal Server Error", err: error.message });
  }

}
const learnerDasboard = async (req, res) => {
  try {
    const LoginUserId = req.user.user.id;


    
    // GAME COUNTS ****************************************** //
    const getGameCount = await AssignedGames.findAll({
      attributes: ['gaGameId'],
      where: {
        gaLearnerId: LoginUserId,
        gaDeleteStatus: 'NO'
      },
      // order: [['gameId', 'ASC']],
    })
    gameCount = getGameCount.map((item)=> item.gaGameId).length;


    // Assigned Game Id's
    const assignedGameId = getGameCount.map((item)=> item.gaGameId);


    // GAME TITLE ****************************************** //
    const GameTitle = await GameTable.findAll({
      attributes: ['gameTitle'],
      where: {
        gameId: assignedGameId
      },
      order: [['gameId', 'ASC']]
    })
    gameName = GameTitle.map((item)=> item.gameTitle);
    


    // TOTAL NO OF QUEST ****************************************** //
    const getNoOfQuest = await GameActivityLog.findAll({
      attributes: ['galQuestNo'],
      where: {
        galGameId: assignedGameId,
        galLearnerId: LoginUserId,
      },
    });
    questNo = getNoOfQuest.map((item)=> item.galQuestNo)    
    const uniqueQuestNo = [...new Set(questNo)];    
    const totalQuest = uniqueQuestNo.reduce((accumulator, value) => accumulator + value)



    // GAME COMPLETION STATUS ****************************************** //
    const getCompleStatus = await GameActivityLog.findAll({
      attributes: ['galGameId', 'galQuestNo', 'galQuestionState'],            
      where: {        
        galGameId: assignedGameId,
        galLearnerId: LoginUserId,  
        // galQuestionState: {[Op.like] :'complete' , [Op.or] : {[Op.like] :'start'}}
      },
      group: ['galGameId', 'galQuestNo', 'galQuestionState'], 
      order: [['galQuestionState','ASC']],
      logging: true        
    });        
    completedGame = getCompleStatus.filter((item)=> item.galQuestionState == 'complete').length           
    totalGameCompleStatus = getCompleStatus.length       
    const getCompletedGame = completedGame
    const getInCompletedGame = Math.abs(completedGame - totalQuest);



    // GAME SCORES ****************************************** //
    const getGameScore = await GameActivityLog.findAll({
      attributes: ['galGameId', 'galQuestNo', 'galQuestionState', 'galAverageScore'],
      where: {
        galGameId: assignedGameId,
        galLearnerId: LoginUserId,
        galQuestionState: 'complete',        
        galAverageScore: {
          [Op.not]: null // Exclude null values for galAverageScore
        }
      },
      group: ['galQuestNo', 'galGameId', 'galQuestionState', 'galAverageScore'],
      order: [['galGameId','ASC'], ['galQuestNo', 'ASC'], ['galId', 'DESC']],
      having: Sequelize.literal('MAX(galId)') // Filter to get the maximum galId for each group
    });


    // NO OF GAME PLAY ****************************************** //
    const getTotalPlay = await GameActivityLog.findAll({
      attributes: ['galQuestionState'],
      where: {
        galGameId: assignedGameId,
        galLearnerId: LoginUserId,
      },      
    })
    const gamePlayingCount = {
      completed: getTotalPlay.filter((item)=> item?.galQuestionState == 'complete').length,
      replayed: getTotalPlay.filter((item)=> item?.galQuestionState == 'replayed').length,
      started: getTotalPlay.filter((item)=> item?.galQuestionState == 'start').length
    }
    
        


    let datas = {
      gameCounts: gameCount,
      gameTitle: gameName,
      userDetails: req.user.user,   
      totalQuest: totalQuest,
      completedGame : getCompletedGame,
      inCompletedGame : getInCompletedGame,
      totalGamePlayed : gamePlayingCount,
    }

    if (datas) {      
      return res.status(200).json({ status: 'Success', data: datas, activity: getGameScore,});
    }
    else {
      return res.status(200).json({ status: 'Failure', Message: 'LeaderBoard is Empty' });
    }

  }
  catch (error) {
    res.status(500).json({ status: 'Failure', message: "Internal Server Error", err: error.message });
  }

}



module.exports = { getAssignedGames, getGamePlay, learnerUpdation, getleaderBoard, learnerDasboard }