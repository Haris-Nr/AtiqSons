const Break = require('../models/breakModel');
const User = require('../models/userModel');
const {createRoomNotification, createNotification} = require('../util/notification');

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
            message: isLeave ? `${req.user.fullname} has requested for a leave.`: `${req.user.fullname} is taking a break.`,
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

        if(filter.includes('mine')) {   
            findFilter['user._id'] = req.user._id;
        }else {
            // in case of all. only admin and superadmin can view all breaks
            if(!(req.user.role === 'admin' || req.user.role === 'superadmin')) {
                res.status(403).json({
                    success: false,
                    message: "You are not authorized to view this resource."
                });    
            }
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

        const breakUser = await User.findById(_break.user);
        // send notification to user, informing him that his break has been approved
        createNotification(
            req.app.get('io'),
            null,    
            _break.user,
            `Your leave request has been approved.`,
            `Leave Approved`,
            req.user._id,
            null,
            '/'+breakUser.dashboard+'/break-leave'
        );


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

        const breakUser = await User.findById(_break.user);

        // send notification to user, informing him that his break has been rejected
        createNotification(
            req.app.get('io'),
            null,    
            _break.user,
            `Your leave request has been rejected.`,
            `Leave Rejected`,
            req.user._id,
            null,
            '/'+breakUser.dashboard+'/break-leave'
        );




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