const Company = require("../../models/companies");
const Creator = require("../../models/Creator");
const Learner =require("../../models/learner");
// const Games =require("../../models/game");

const { Op } = require('sequelize');
const moment = require('moment');



const noOfCompanys = async (req, res) => {
  try {
    const startDate = moment().startOf('month').format('YYYY-MM-DD HH:mm:ss.SSSSSS');
    const endDate = moment().endOf('month').format('YYYY-MM-DD HH:mm:ss.SSSSSS');

    /**************Company details*************** */
    const companyCount = await Company.count({
      where: {
        cpStatus: 'Active',
        cpDeleteStatus: 'NO',
      }
    });

    const newCompany = await Company.count({
      where: {
        cpStatus: 'Active',
        cpDeleteStatus: 'NO',
        cpCreatedDate: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    /*******Creator Details*************** */
    const CreatorCount = await Creator.count({
      where: {
        ctStatus: 'Active'
      }
    });

    const newCreator = await Creator.count({
      where: {
        ctStatus: 'Active',
        ctCreatedDate: {
          [Op.between]: [startDate, endDate],
        },
      },
    });
    /*************Learner**************** */
    const LearnerCount = await Learner.count({
      where: {
        lenStatus: 'Active'
      }
    });

    const newLearner = await Learner.count({
      where: {
        lenStatus: 'Active',
       lenCreatedDate: {
          [Op.between]: [startDate, endDate],
        },
      },
    });
    /************Games**************** */
    // const GamesCount = await Games.count({
    //   where: {
    //     gameStatus: 'Active'
    //   }
    // });

    // const newGames = await Games.count({
    //   where: {
    //     gameStatus: 'Active',
    //    gameCreatedDate: {
    //       [Op.between]: [startDate, endDate],
    //     },
    //   },
    // });
    
    if (!companyCount) {
      res.status(404).json({ status: 'Failure', message: 'Bad request', err: 'Company count not available' });
    } else {
      let data ={
        companyCount:companyCount,
        newCompany:newCompany,
        CreatorCount:CreatorCount,
        newCreator:newCreator,
        LearnerCount:LearnerCount,
        newLearner:newLearner,
        GamesCount:9,
        newGames:5,

      }
      res.status(200).json({ status: 'Success', message: 'Data getted Successfully!', data:data });
    }
  } catch (err) {
    res.status(500).json({ status: 'Failure', message: 'Oops! something went wrong', err: err.message });
  }
};

const noOfCreators = async (req, res) => {
  try {
    const { currentYear, currentMonth } = getCurrentDate();

    const count = await Creator.count({
      where: {
        ctStatus: 'Active'
      }
    });

    const thisMonthCount = await Creator.count({
      where: {
        ctStatus: 'Active',
        ctCreatedDate: {
          [Op.like]: '%' + currentYear + '-' + currentMonth + '%',
        },
      },
    });

    if (!count) {
      res.status(404).json({ status: 'Failure', message: 'Bad request', err: err });
    } else {
      res.status(200).json({ status: 'Success', message: 'Data getted Successfully!', count: count, monthwise: thisMonthCount });
    }
  } catch (err) {
    res.status(500).json({ status: 'Failure', message: 'Oops! something went wrong', err: err });
  }
};

const noOfLeaners = async (req, res) => {
  try {
    const count = await Creator.count({
      where: {
        ctStatus: 'Active'
      }
    });

    if (!count) {
      res.status(404).json({ status: 'Failure', message: 'Bad request', err: err });
    } else {
      res.status(200).json({ status: 'Success', message: 'Data getted Successfully!', count: count });
    }
  } catch (err) {
    res.status(500).json({ status: 'Failure', message: 'Oops! something went wrong', err: err });
  }
};

module.exports = { noOfCompanys, noOfCreators, noOfLeaners };
