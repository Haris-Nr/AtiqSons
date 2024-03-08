const ActivityLog = require('../models/activityLogModel');


const createActivityLog = async (req, res) => {
    try {
        const { user, startTime, endTime } = req.body;

        const newActivityLog = new ActivityLog({
            user,
            startTime,
            endTime
        });
        const savedActivityLog = await newActivityLog.save();
        res.status(201).json(savedActivityLog);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

const getAllActivityLogs = async (req, res) => {
    try {
        const findFilter = {};
        let { page, limit, search, } = req.query;

        if (search) {
            findFilter['user.fullname'] = {
                $regex: search,
                $options: "i"
            };
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
                $count: 'activityLogsCount'
            }
        ];

        const activityLogs = await ActivityLog.aggregate(pipeline);
        const countResult = await ActivityLog.aggregate(countPipeline);
        const totalActivityLogs = countResult.length > 0 ? countResult[0].activityLogsCount : 0;

        res.json({
            activityLogs,
            page,
            limit,
            totalActivityLogs
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getAggregatedActivityLogs = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    const activityLogs = await ActivityLog.find().populate('user');
    const aggregatedData = {};
    activityLogs
        .filter(log => log.user.fullname.includes(search))
        .forEach(log => {
            const date = log.startTime.toISOString().split('T')[0];
            const timeSpent = new Date(log.endTime) - new Date(log.startTime);
            if (!aggregatedData[date]) {
                aggregatedData[date] = {};
            }
            if (!aggregatedData[date][log.user._id]) {
                aggregatedData[date][log.user._id] = {};
            }
            aggregatedData[date][log.user._id] = {
                _id: date,
                date: date,
                user: log.user,
                totalTime: (aggregatedData[date][log.user._id].totalTime || 0) + timeSpent,
            };
        });

    

    const aggregatedDataArray = [];
    for (let date in aggregatedData) {
        for (let user in aggregatedData[date]) {
            aggregatedDataArray.push(aggregatedData[date][user]);
        }
    }


    const totalAggregatedLogs = aggregatedDataArray.length;
    const aggregatedLogs = aggregatedDataArray.slice(skip, skip + limit);

    res.json({
        aggregatedLogs,
        page,
        limit,
        totalAggregatedLogs,
    });
}


const deleteActivityLog = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedActivityLog = await ActivityLog.findByIdAndDelete(id);
        res.json(deletedActivityLog);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}




module.exports = {
    createActivityLog,
    getAllActivityLogs,
    deleteActivityLog,
    getAggregatedActivityLogs
}
