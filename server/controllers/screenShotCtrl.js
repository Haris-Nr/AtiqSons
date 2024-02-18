const ScreenShot = require('../models/screenShotModel');
const fs = require('fs');

const createScreenShot = async (req, res) => {
    try {
        const { user } = req.body;


        if (!req.file) {
            return res.status(400).json({
                message: 'No file uploaded'
            });
        }
        if (!user) {
            return res.status(400).json({
                message: 'No user selected'
            });
        }


        let screenShot = "/" + req.file.path
            .replace(/\\/g, "/")
            .split("/")
            .filter((e) => e && e !== "public")
            .join("/");


        const newScreenShot = new ScreenShot({
            screenShot,
            user,
            createdBy: req.user._id
        });
        const savedScreenShot = await newScreenShot.save();
        res.status(201).json(savedScreenShot);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}



const getAllScreenShots = async (req, res) => {
    try {
        const findFilter = {};
        let { page, limit, search, } = req.query;

        if (search) {
            findFilter.$or = [{
                'user.fullname': {
                    $regex: search,
                    $options: "i"
                },
            },
            {
                'createdBy.fullname': {
                    $regex: search,
                    $options: "i"
                }
            }
            ]
        }





        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        let skip = (page - 1) * limit;

        const pipeline = [
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'createdBy',
                    foreignField: '_id',
                    as: 'createdBy'
                }
            },
            {
                $match: findFilter
            },
            {
                $unwind: "$user"
            },
            {
                $unwind: "$createdBy"
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $skip: skip
            },
            {
                $limit: limit
            }
        ];

        const countPipeline = [
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'createdBy',
                    foreignField: '_id',
                    as: 'createdBy'
                }
            },
            {
                $match: findFilter
            },
            {
                $unwind: "$user"
            },
            {
                $unwind: "$createdBy"
            },
            {
                $count: "totalScreenShots"
            }
        ];

        const screenShots = await ScreenShot.aggregate(pipeline);
        const countResult = await ScreenShot.aggregate(countPipeline);
        const totalScreenShots = countResult.length > 0 ? countResult[0].totalScreenShots : 0;

        res.json({
            screenShots,
            page,
            limit,
            totalScreenShots
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
}


const deleteScreenShot = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedScreenShot = await ScreenShot.findByIdAndDelete(id);
        if (deletedScreenShot) {
            fs.unlinkSync('./public' + deletedScreenShot.screenShot);
            return res.status(200).json({ message: 'ScreenShot deleted' });
        }
        res.status(404).json({ message: 'ScreenShot not found' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}



module.exports = {
    createScreenShot,
    getAllScreenShots,
    deleteScreenShot
}