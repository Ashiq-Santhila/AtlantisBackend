
const sequelize = require('sequelize');
const { Op } = sequelize; // Import the `Op` object from Sequelize
const LmsCohorts = require("../../models/cohorts");
const learner = require("../../models/learner");



const addcohorts = async (req, res) => {
  try {
    const data = req.body;
    console.log(data);
    if (!data) {
      res.status(400).json({ status: "Failure", message: "Bad request" });
    } else {
      req.body.chCreatedDate = Date.now();
      req.body.chCreatedUserId = req.user.user.id;
      req.body.chDeleteStatus = "NO";
      req.body.chIpAddress = req.connection.remoteAddress;
      req.body.chUserAgent = req.headers["user-agent"];
      req.body.chDeviceType = req.device.type;
      req.body.chStatus = 'Active';
      req.body.chTimeStamp = Date.now();




      const result = await LmsCohorts.create(data);
      res.status(200).json({
        status: "Success",
        message: "Data stored in the database",
        data: result,
      });
    }

  } catch (err) {
    console.error("Error in addlearner:", err.message); // Log the error for debugging

    res.status(500).json({
      status: "Failure",
      message: "Oops! Something went wrong",
      error: err || "Internal Server Error",
    });
  }
};
const getcohorts = async (req, res) => {
  try {
    const { count, rows: allData } = await LmsCohorts.findAndCountAll({
      attributes: ['chId', 'chCohortsName'], // Remove the extra space in 'chId'
      where: {
        [Op.and]: [
          {
            chDeleteStatus: {
              [Op.or]: {
                [Op.not]: "Yes",
                [Op.is]: null,
              },
            },
          },
        ],
        chCreatedUserId :req.user.user.id,
      },
    });
    
    if (count === 0) {
      return res.status(404).json({ status: 'Failure', message: "No records found" });
    }
    else {
      return res.status(200).json({
        status: 'Success',
        message: "All Data Retrieved Successfully",
        data: allData,
        count: count,
      });
    }

  } catch (error) {
    res.status(500).json({ status: 'Failure', message: "Internal Server Error", err: error });
  }
};
const updatecohorts = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    const record = await LmsCohorts.findByPk(id);
    if (!record) {
      return res.status(404).json({ status: 'Failure', message: "Record not found" });
    }
    req.body.chEditedDate = Date.now();
    req.body.chEditedUserId = req.user.user.id;
    const updatedRecord = await record.update(data);

    res
      .status(200)
      .json({ status: "Success", message: "Data Updated Successfully", data: updatedRecord });
  } catch (error) {
    res.status(500).json({ status: 'Failure', message: "Internal Server Error", err: error });
  }

}
const checkCohorts = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ status: 'Failure', message: 'Bad Request' });
    }

    // Fetch data for the specific item based on the provided ID
    const specificData = await LmsCohorts.findByPk(id);

    if (!specificData) {
      return res.status(404).json({ error: "Record not found" });
    }

    const checkCohorts = await learner.count({
      where: {
        lenCohorts: {
          [Op.like]: `%${id}%`, // Use the `Op` object with the `like` operator
        },
      },
    });

    if (checkCohorts === 0) {
      const data = await LmsCohorts.findOne({ where: { chId: id } });

      if (!data) {
        res.status(404).json({ status: 'Failure', message: 'Company Not Found' });
      } else {
        data.set({ chDeleteStatus: 'YES' });
        await data.save();

        res.status(200).json({ status: 'Success', message: 'Data deleted from the Database' });
      }
    } else {
      res
        .status(200)
        .json({ status: 'Waring', message: "Data Retrieved Successfully", data: checkCohorts });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", err: error.message });
  }
};

const reomvecohorts = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      res.status(404).json({ status: 'Failure', message: 'Bad Request' })
    }
    else {
      const data = await LmsCohorts.findOne({ where: { chId: id } });
      if (!data) {
        res.status(404).json({ status: 'Failure', message: 'Company Not Found' })
      }
      else {
        data.set({
          chDeleteStatus: "YES"
        });
        await data.save();
       


       const whereClause = {
  [Op.or]: [
    { lenCohorts: { [Op.like]: `%,${id},%` } },
    { lenCohorts: { [Op.like]: `${id},%` } },
    { lenCohorts: { [Op.like]: `%,${id}` } },
    { lenCohorts: `${id}` },
  ],
};

const result = await learner.update(
  {
    lenCohorts: sequelize.fn('TRIM', sequelize.literal(`BOTH ',' FROM REPLACE(CONCAT(',', lenCohorts, ','), ',${id},', ',')`)),
  },
  {
    where: whereClause,
  }
);

        if (result) {
          res.status(200).json({ status: 'Success', message: 'Data deleted from the Database',results:result});
        } else {
          res.status(404).json({ status: 'Failure', message: 'something went wrong' })
        }



      }
    }
  }
  catch (err) {
    res.status(500).json({ status: "Failure", message: "oops! something went wrong", err: err.message });
  }
}
const getAllCohorts = async (req, res) => {
  try {
    const LoginUserRole =req.user.user.role;
      const LoginUserId =req.user.user.id;
    const { count, rows: data } = await LmsCohorts.findAndCountAll({
      attributes: [['chId','value'], ['chCohortsName','label']], 
      where: {
        [Op.and]: [
          {
            chDeleteStatus: {
              [Op.or]: {
                [Op.not]: "Yes",
                [Op.is]: null,
              },
            },
            ...(LoginUserRole === 'Creator' ? {
              [Op.or]: [
                { chCreatedUserId: LoginUserId },
              ],
            } : {}),
            
          },
        ],
      },
    });

    if (count === 0) {
      return res.status(404).json({ status: 'Failure', message: "No records found" });
    }

    res.status(200).json({
      status: 'Success',
      message: "All Data Retrieved Successfully",
      data: data,
      count: count,
    });
  } catch (error) {
    res.status(500).json({ status: 'Failure', message: "Internal Server Error", err: error });
  }
};
module.exports = { addcohorts, getcohorts, updatecohorts, reomvecohorts, checkCohorts ,getAllCohorts};
