const Fullfilment = require('../models/fullfilmentModel');

// Create a new fullfilment
exports.createFullfilment = async (req, res) => {
  try {
    const fullfilment = new Fullfilment(req.body);
    await fullfilment.save();
    res.status(200).json({
        message:"Successfully created"
    })
  } catch (error) {
    res.status(400).json({message:error.message});
  }
};

// Get all fullfilments
exports.getAllFullfilments = async (req, res) => {
  try {
    const fullfilments = await Fullfilment.find({});
    res.status(200).json({
        fullfilments
    })
  } catch (error) {
    res.status(500).json({message:error.message});
  }
};

// Update a fullfilment by id
exports.updateFullfilment = async (req, res) => {
  try {
    await Fullfilment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({
        message:"Successfully updated"
    })
  } catch (error) {
    res.status(400).json({message:error.message});
  }
};

// Delete a fullfilment by id
exports.deleteFullfilment = async (req, res) => {
  try {
    await Fullfilment.findByIdAndDelete(req.params.id);
    res.status(200).json({
        message:"Successfully deleted"
    })
  } catch (error) {
    res.status(500).json({message:error.message});
  }
};
