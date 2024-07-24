const express = require("express");
const adminRoutes = require('./routes/adminRoutes');
const { mongoConnect } = require("./services/mongo");
const authRoutes = require('./routes/authRoutes');
const activityRoutes = require('./routes/activitiesRoute');

require('dotenv').config()


const app = express();

app.use(express.json());

// Auth Routes
app.use('/auth', authRoutes)

// Super Admin routes
app.use("/admin", adminRoutes);

// Super Admin routes
app.use("/activities", activityRoutes);
// // Admin routes
// app.use("/student", );



async function startServer() {
    await mongoConnect();

    app.listen(process.env.PORT || 3000, () => {
        console.log(`server is running on port: ${process.env.PORT}`);
    });

}

startServer();
