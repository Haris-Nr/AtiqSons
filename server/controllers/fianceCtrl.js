const Fiance = require("../models/fianceModel");
const fs = require('fs');
const path = require("path");


exports.uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({message:"Please upload an image"});
        }

        let image;
        if (req.file) {
            image = req.file.path;
            image =
              "/" +
              image
                .replace(/\\/g, "/")
                .split("/")
                .filter((e) => e && e !== "public")
                .join("/");
          }

        const newImage = new Fiance({
            image,
        });

        await newImage.save();

    } catch (error) {
        console.error(error);
        res.status(500).json({message:error.message});
    }
};

exports.getAllImage = async (req,res) => {
    try {
        const images = await Fiance.find().sort({ createdAt: -1 });
        res.status(200).json({images});
    } catch (error) {
        res.status(500).json({message:error.message});
    }
};


exports.deleteImage = async (req, res) => {
    try {
        const imageId = req.params.id;

        const image = await Fiance.findById(imageId);
        if (!image) {
            return res.status(404).send("Image not found");
        }

        const filePath = path.join(__dirname, "../public", image.image);
        await fs.unlink(filePath, (err) => {
            if (err) throw err;
        });
        

        await Fiance.findByIdAndDelete(imageId);

    } catch (error) {
        console.error(error);
        res.status(500).json({message:error.message});
    }
};
