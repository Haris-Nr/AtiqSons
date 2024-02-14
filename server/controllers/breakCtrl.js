const Break = require('../models/breakModel');
const decodeToken = require('../util/tokenDecoder');
const {createRoomNotification} = require('../util/notification');

const createBreak = async (req, res) => {
    try {
        const {
            startTime,
            endTime,
            isLeave,
        } = req.body;

        


        if (!startTime) {
            res.status(400).json({
                success: false,
                message: "Start time is required."
            })
        }

        if (!endTime) {
            res.status(400).json({
                success: false,
                message: "End time in required."
            })
        }
        const _break = new Break({
            startTime,
            endTime,
            isLeave,
            user: req.user._id
        })

        _break.save();


        createRoomNotification({
            io: req.app.get('io'),
            room: "all-admins",
            actionUser: req.user._id,
            title: `New ${isLeave ? 'Leave' : 'Break'} Request`,
            message: `${req.user.fullname} has requested for a ${isLeave ? 'leave': 'break'}.`,
            onClick: '/admin/break-leave',
        });
        

        res.json({
            success: true,
            data: _break
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong."
        })
    }

}


const getAllBreaks = async (req, res) => {
    try {
        const findFilter = {};
        let { page, limit, search, filter } = req.query;
        filter = filter?.split?.(',') || [];

        if (search) {
            findFilter['user.fullname'] = {
                $regex: search,
                $options: "i"
            };
        }

        if (filter.includes('leave')) {
            findFilter.isLeave = true;
        }

        if (filter.includes('break')) {
            findFilter.isLeave = false;
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
                $match: findFilter
            },
            {
                $unwind: "$user"
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
                $match: findFilter
            },
            {
                $unwind: "$user"
            },
            {
                $count: "totalBreaks"
            }
        ];

        
        const breaks = await Break.aggregate(pipeline);

        const countResult = await Break.aggregate(countPipeline);
        const totalBreaks = countResult.length > 0 ? countResult[0].totalBreaks : 0;

        res.json({
            success: true,
            data: {
                breaks,
                page,
                limit,
                totalBreaks
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong."
        });
    }
};



const approveBreak = async (req, res) => {
    try {
        const { id } = req.params;
        const _break = await Break.findById(id);
        _break.status = "APPROVED";
        _break.save();
        res.json({
            success: true,
            data: _break
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong."
        });
    }
}


const rejectBreak = async (req, res) => {
    try {
        const { id } = req.params;
        const _break = await Break.findById(id);
        _break.status = "REJECTED";
        _break.save();
        res.json({
            success: true,
            data: _break
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong."
        });
    }
}



module.exports = {
    createBreak,
    getAllBreaks,
    approveBreak,
    rejectBreak
}