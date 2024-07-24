const Activity = require("../models/Activity");


async function feedActivity(userId, name, activityType) {

    try {
        const newActivity = new Activity({
            userId: userId,
            name: name,
            activity: activityType,
        })

        newActivity.save();
    } catch (error) {
        return res.json({message: error.message});
    }
   
}

const activityController = {
    async getActivities (req, res) {
        try {
            const activites = await Activity.find({userId: req.userId}).lean();
            const userCollection = feedActivity(req.userId);
            return res.json({activites, userCollection});
        } catch (error) {
            return res.status(403).json({message: "Error fetching activites!"})
        }
    }
};

module.exports = {
    feedActivity,
    activityController
};