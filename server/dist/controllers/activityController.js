import { ActivityLog } from "../models/ActivityLog.js";
//Get all activity
//GET /api/activity
export const getActivity = async (req, res) => {
    try {
        const activity = await ActivityLog.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(10).populate("relatedPost", "content");
        res.json(activity);
    }
    catch (err) {
        res.status(500).json({ message: err?.messsage || "Server error" });
    }
};
