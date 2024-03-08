const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app);
const socketIO = require("./config/socket");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
require("dotenv").config();
const dbConnect = require("./config/dbConnect");
dbConnect();

const io = socketIO(server);
app.set("io", io);

app.use(morgan("tiny"));

app.use(
  cors({
    origin: [[process.env.CLIENT_URL]],
    methods: "*",
  })
);

app.use(express.json());

app.use(express.static(path.join(__dirname, "dist")));
app.use(express.static(path.join(__dirname, "public")));

// Routes import
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const notificationsRoute = require("./routes/notificationsRoute");
const taskRoute = require("./routes/taskRoutes");
const logRoute = require("./routes/logRoute");
const dubaiRoutes = require("./routes/dubaiRoutes");
const orderRoutes = require("./routes/orderRoutes");
const exchangeRateRoutes = require("./routes/exchangeRateRoutes");
const breakRoutes = require("./routes/breakRoutes");
const screenShotRoutes = require("./routes/screenShotRoutes");
const stockRoutes = require("./routes/stockRoutes");
const activityLogRoutes = require("./routes/activityLogRoutes");
const flexRoutes = require('./routes/flexRoutes');
const fianceRoutes = require('./routes/fianceRoutes');
const fullfilmentRoutes = require('./routes/fullfilmentRoutes');

// Define your routes
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/notification", notificationsRoute);
app.use("/api/task", taskRoute);
app.use("/api/log", logRoute);
app.use("/api/dubai", dubaiRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/exchange-rate", exchangeRateRoutes);
app.use("/api/break", breakRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/screenshot", screenShotRoutes);
app.use("/api/activity-log", activityLogRoutes);
app.use('/api/sellerflex', flexRoutes);
app.use('/api/fiance', fianceRoutes);
app.use('/api/fullfilment', fullfilmentRoutes);



app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist/index.html"));
});

const PORT = process.env.PORT;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
