const Order = require("../models/orderModel");
const Notification = require("../models/notificationModel");
const { createRoomNotification } = require("../util/notification");
const fs = require("fs");

const getOrders = async (req, res) => {
    try {
        const filter = {};
        let { page, limit, search, status } = req.query;

        if (status) {
            filter.status = status;
        }

        if (search) {
            filter.productName = {
                $regex: search,
                $options: "i",
            };
        }

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        let skip = (page - 1) * limit;

        const orders = await Order.find(filter)
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip);

        const totalOrders = await Order.countDocuments(filter);

        res.json({
            orders,
            page,
            limit,
            totalOrders,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: "Order not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createOrder = async (req, res) => {
    try {
        if (!req.body.sku) {
            return res.status(400).json({ message: "SKU is required" });
        }

        if (!req.body.productName) {
            return res.status(400).json({ message: "Product Name is required" });
        }

        if (!req.body.quantity) {
            return res.status(400).json({ message: "Quantity is required" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Picture is required" });
        }

        let picture =
            "/" +
            req.file.path
                .replace(/\\/g, "/")
                .split("/")
                .filter((e) => e && e !== "public")
                .join("/");

        const order = new Order({
            ...req.body,
            picture,
        });
        const savedOrder = await order.save();

        createRoomNotification({
            io: req.app.get("io"),
            room: "china-employees",
            actionUser: req.user._id,
            title: "New Order",
            message: `New order for product "${req.body.productName}" has been placed`,
            image: picture,
            onClick: "/china/orders",
        });

        res.json(savedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        let newPicture = req.file;

        if (newPicture) {
            newPicture =
                "/" +
                newPicture.path
                    .replace(/\\/g, "/")
                    .split("/")
                    .filter((e) => e && e !== "public")
                    .join("/");

            const ordersWithOldPicture = await Order.find({
                picture: order.picture,
            });

            const notificationsWithOldPicture = await Notification.find({
                image: order.picture,
            });

            // incase of re-order, image could be used by another order
            if (
                order.picture &&
                ordersWithOldPicture.length === 1 &&
                notificationsWithOldPicture.length === 0
            ) {
                fs.unlinkSync(`./public${order.picture}`);
            }
            order.picture = newPicture;
        }

        if (order) {
            if (req.body.status !== order.status) {
                createRoomNotification({
                    io: req.app.get("io"),
                    room: "all-admins",
                    actionUser: req.user._id,
                    title: "Order Status Update",
                    message: `Order status for product "${order.productName}" has been updated to "${req.body.status}"`,
                    image: order.picture,
                    onClick: "/admin/orders",
                });
            }

            if (req.body.price !== order.price) {
                createRoomNotification({
                    io: req.app.get("io"),
                    room: "all-admins",
                    actionUser: req.user._id,
                    title: "Order Price Update",
                    message: `Order price for product "${order.productName}" has been updated to "${req.body.price}"`,
                    image: order.picture,
                    onClick: "/admin/orders",
                });
            }

            order.status = req.body.status || order.status;
            order.sku = req.body.sku || order.sku;
            order.productName = req.body.productName || order.productName;
            order.quantity = req.body.quantity || order.quantity;
            order.price = req.body.price || order.price;

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: "Order not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            const ordersWithOldPicture = await Order.find({
                picture: order.picture,
            });

            const notificationsWithOldPicture = await Notification.find({
                image: order.picture,
            });

            // incase of re-order, image could be used by another order
            if (
                order.picture &&
                ordersWithOldPicture.length === 1 &&
                notificationsWithOldPicture.length === 0
            ) {
                try {
                    fs.unlinkSync(`./public${order.picture}`);
                } catch (error) {
                    console.log(
                        error.message ||
                        "Error: Deleting picture failed during order deletion"
                    );
                }
            }

            await Order.findByIdAndDelete(req.params.id);

            res.json({ message: "Order removed" });
        } else {
            res.status(404).json({ message: "Order not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const reOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            const newOrder = new Order({
                sku: order.sku,
                productName: order.productName,
                quantity: order.quantity,
                price: order.price,
                picture: order.picture,
            });
            const savedOrder = await newOrder.save();
            res.status(200).json(savedOrder);
        } else {
            res.status(404).json({ message: "Order not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getOrders,
    createOrder,
    updateOrder,
    deleteOrder,
    getOrder,
    reOrder,
};
