const Category = require("../../models/category");

const createCategory = async (req, res) => {
  try {
    if (!req.body) {
      res.status(400).json({ status: "Failure", message: "Bad request" });
    } else {
      req.body.catCreatedDate = Date.now();
      // req.body.plEidtedDate = Date.now();
      req.body.ctCreatedUserId = 1;
      req.body.catIpAddress = req.connection.remoteAddress;
      req.body.catUserAgent = req.headers["user-agent"];
      req.body.catDeviceType = req.device.type;
      req.body.catDeleteStatus= "NO";
      req.body.catStatus="Active";
      const data = await Category.create(req.body);
      res.status(200).json({
        status: "Success",
        message: "Data Stored into the DataBase",
        data: data,
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "Failure",
      message: "oops! something went wrong",
      err: err.message,
    });
  }
};
const getCategory = async (req, res) => {
  try {
    const data = await Category.findAll({
      where: {
        catDeleteStatus: "NO",
      },
    });
    if (data.length === 0) {
      res.status(404).json({ status: "Failure", message: "Bad request" });
    } else {
      res.status(200).json({
        status: "Success",
        message: "Data getted from the DataBase",
        data: data,
      });
    }
  } catch (err) {
    console.error('Error in getCategory:', err);
    res.status(500).json({
      status: "Failure",
      message: "Oops! Something went wrong",
      err: err.message, // or err.stack for the full stack trace
    });
  }
};
const getOneCategory = async (req, res) => {
  try {
    let id = req.params.id;
    if (!id) {
      res.status(404).json({ status: "Failure", message: "Bad request" });
    } else {
      const data = await Category.findByPk(id);
      if (data.length === 0) {
        res.status(404).json({ status: "Failure", message: "User Not Found" });
      } else {
        res.status(200).json({
          status: "Success",
          message: "Data getted from the DataBase",
          data: data,
        });
      }
    }
  } catch (err) {
    res.status(500).json({
      status: "Failure",
      message: "oops! something went wrong",
      err: err,
    });
  }
};
const updateCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    const record = await Category.findByPk(id);
    if (!record) {
      return res
        .status(404)
        .json({ status: "Failure", message: "Record not found" });
    }

    const updatedRecord = await record.update(data);

    res.status(200).json({
      status: "Success",
      message: "Data Updated Successfully",
      data: updatedRecord,
    });
  } catch (error) {
    res.status(500).json({
      status: "Failure",
      message: "Internal Server Error",
      err: error,
    });
  }
};

const reomveCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const data = { catDeleteStatus: "YES" }; // Define the data to update plDeleteStatus
    const record = await Category.findByPk(id);
    if (!record) {
      return res
        .status(404)
        .json({ status: "Failure", message: "Record not found" });
    }
    const updatedRecord = await record.update(data);
    res.status(200).json({
      status: "Success",
      message: "Record Successfully Marked as Deleted",
      data: updatedRecord,
    });
  } catch (error) {
    res.status(500).json({
      status: "Failure",
      message: "Internal Server Error",
      err: error,
    });
  }
};
const getCategoryList = async (req, res) => {
  try {
    let data = await Category.findAll({
      attributes: [
        ["catId", "value"],
        ["catName", "label"],
      ],
      where: { catDeleteStatus: "NO" },
    });
    if (data.length === 0) {
      res.status(404).json({ status: "Failure", message: "Bad request" });
    } else {
      res.status(200).json({
        status: "Success",
        message: "Data getted from the DataBase",
        data: data,
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "Failure",
      message: "Oops! Something went wrong",
      err: err,
    });
  }
};

module.exports = {
  createCategory,
  getCategory,
  updateCategory,
  reomveCategory,
  getOneCategory,
  getCategoryList
};
