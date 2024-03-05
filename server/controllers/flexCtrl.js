const Flex = require('../models/flexModel')

const addFlex = async (req, res) => {
    try {
      const newFlex = new Flex(req.body);
      await newFlex.save();
      res.status(201).json({
        message: "Flex saved successfully",
    });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
  };
  
  const getAllFlex = async (req, res) => {
    try {
      let { page, limit } = req.query;
      page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 10;
    const skip = (page - 1) * limit;
      const flexes = await Flex.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit);
      const totalCount = await Flex.countDocuments({});
      res.status(200).json({
        flexes,
        totalCount
      });
    } catch (error) {
      res.status(500).json({
        message:error.message,
      });
    }
  };
  

  const deleteFlex = async (req, res) => {
    try {
      const flex = await Flex.findByIdAndDelete(req.params.id);
      if (!flex) {
        return res.status(404).json({
            message: "Flex not found",
        });
      }
      res.status(200).json({
        message:"Delete Flex"
      });
    } catch (error) {
      res.status(500).json({
        message:error.message
      });
    }
  };
  

  const updateFlex = async (req, res) => {
    try {
      const flex = await Flex.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!flex) {
        return res.status(404).json({
            message:"flex is not available"
        });
      }
      res.status(200).json({
        message:"Updated"
      });
    } catch (error) {
      res.status(400).json({
        message:error.message
      });
    }
  };
  

  module.exports = { addFlex, getAllFlex, deleteFlex, updateFlex };
