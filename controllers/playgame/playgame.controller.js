const lmsGameActivityLog = require("../../models/gameActivityLog");

const addgameActivityLog = async (req, res) => {
    console.log("gameactivitylog",req.body);
  if (!req.body) {
    return res.status(400).json({ status: "Failure", message: "Bad request" });
  } else {
    req.body.galCreatedDate = Date.now();
    req.body.galIpAddress = req.connection.remoteAddress;
    req.body.galUserAgent = req.headers["user-agent"];
    req.body.galDeviceType = req.device.type;
    req.body.galQuestionState = "start";
    // req.body.plCreatedUserId = req.user.user.id;
    // req.body.plCreatedUserId=2;

    // req.body.plTimeStamp = Date.now();
    const data = await lmsGameActivityLog.create(req.body);
    res.status(200).json({
      status: "Success",
      message: "Data Stored into the DataBase",
      data: data,
    });
  }
};

const getLastInsertedData = async (req, res) => {
    try {

        const gid = req?.params?.gid;
        const id = req?.params?.id;
        if (!gid || !id) return res.status(404).json({ status: 'Failure', message: "Id Need" });
        const lastInsertedData = await lmsGameActivityLog.findOne({
          where: {
            galLearnerId: id,
            galGameId: gid,
          },
          order: [['galId', 'DESC']],
        });
    
        if (!lastInsertedData) {
            // If lastInsertedData is empty, send a 404 Bad Request response
            return res.status(404).send('Bad Request');
          }

          res.status(200).json({
            status: 'Success',
            message: "All Data Retrieved Successfully",
            data: lastInsertedData,
          });
      } catch (error) {
        console.error('Error:', error);
      }
    
};


const learnerScoreView = async (req, res) => {
if(!req?.body){
  return res.status(400).json({ status: "Failure", message: "Bad request" });
} else {

  try {

    const data = await lmsGameActivityLog.findAll({
      where:{
        galLearnerId:req?.body?.galLearnerId,
        galGameId:req?.body?.galGameId
      },
      order: [['galId','DESC']],
      limit:1
    });
    
    res.status(200).json({message:"Success", data:data});
    
  } catch (error) {

    res.status(500).json({ error: "Internal Server Error", err: error });
    
  }
 
}


// The original scores - first play
// The Final scores - after all replays
// The Skill wise Scores - Calculating Skill wise Scores through 'blocks' table,

  

};

module.exports = { addgameActivityLog,getLastInsertedData,learnerScoreView };
