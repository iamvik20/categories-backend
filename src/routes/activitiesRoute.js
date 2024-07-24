const express = require("express");
const {activityController} = require("../controllers/activityController");
const adminMiddleware = require("../middlewares/adminMiddleware");

const router = express.Router();


router.use(adminMiddleware);

router.get('', activityController.getActivities);


module.exports = router;