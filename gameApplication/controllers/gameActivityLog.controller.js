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

const bcrypt = require('bcrypt');

const sequelize = require("../../lib/config/database");

const Activity =require("../../models/gameActivityLog")

const createActivity = async (req, res) => {
  try {
    let data = req?.body
    const LoginUserId =req.user.user.id;
    const createActivity = await Activity.create({ 
      galGameId:data.gameId,
      galQuestNo:data.questNo,
      galLearnerId:LoginUserId,
      galQuestionState:'start',
      galBlockId:null,
      galTimeSpent:0,
      galCreatedDate:Date.now(),
      galUserAgent:req.headers["user-agent"],
      galIpAddress:req.connection.remoteAddress,
      galDeviceType:req.device.type,
      galStartDateTime:Date.now(),
    });
    if(createActivity){
      return res.status(200).json({ status: 'Success', message: "Activity Created" ,data:createActivity.galId });
    }
    else{
      return res.status(500).json({ status: 'Failure', message: "Internal Server Error"});
    }
  } catch (error) {
    res.status(500).json({ status: 'Failure', message: "Internal Server Error", err: error.message });
  }

}

const ReacordActivity = async (req, res) => {
  try {
    const LoginUserId =req.user.user.id;
    const { id } = req.params;
    let data = req?.body
    let totoalscore
    let gameflow = [];
    const  getlastScore= await Activity.findOne({
      where: { 
        galId : LoginUserId
      },
      });
   if(data.blcokname==='interaction'){

 totoalscore=getlastScore.galAverageScore+data.galAverageScore

   }

  
  //  if (getlastScore && getlastScore.galgameflow) {

  //   const existingGameflow = getlastScore.galgameflow.split(',');
  
  //   const check = existingGameflow.includes(data.galBlockId);
  
  //   if (!check) {
  //     existingGameflow.push(data.galBlockId);
  //   }
  
  //   // Join the array back into a string
  //   getlastScore.galgameflow = existingGameflow.join(',');
  
  //   // If needed, you can assign gameflow to the existingGameflow array
  //   gameflow = existingGameflow;
  //   return res.status(400).json({ status: 'Failure', message:existingGameflow });
  // } else {
  //   gameflow = [data.galBlockId];
  
  //   // If it's a new array, join it into a string before saving it to the database
  //   getlastScore.galgameflow = gameflow.join(',');

    
  // }
   const [rowCount, updatedRows] = await Activity.update({
    galTimeSpent: data.lenUserName,
    ...(data.blockname === 'interaction' ? { galAverageScore: totoalscore } : {}),
   
    ...(data.navigateId === 'Complete' ? { galEndDateTime: Date.now()} : {}),
    galBlockId: parseInt(data.galBlockId, 10),
    ...(data.navigateId === 'Complete' ? { galQuestionState:'complete'} : {}),
    galTimeSpent:data.galTimeSpent,
    galCreatedDate: Date.now(),
    galUserAgent: req.headers["user-agent"],
    galIpAddress: req.connection.remoteAddress,
    galDeviceType: req.device.type,
    galAverageScore: data?.galAverageScore,
    // galgameflow:getlastScore.galgameflow,
  }, {
    where: {
      galId: id,
    },
  });
  
    
    if (rowCount > 0) {
      console.log(`Update successful. ${rowCount} row(s) updated.`);
      console.log(updatedRows); // This will show the actual updated rows
      return res.status(200).json({ status: 'Success', message: `Update successful. ${rowCount} row(s) updated.`, datas: data });
    } else {
      console.log(`No rows were updated.`);
      return res.status(400).json({ status: 'Failure', message: `No rows were updated.` });
   
    }


  } catch (error) {
    res.status(500).json({ status: 'Failure', message: "Internal Server Error", err: error.message });
  }

}



module.exports = { createActivity, ReacordActivity }