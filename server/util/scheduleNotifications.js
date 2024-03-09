const nodeSchedule = require('node-schedule');
const Product = require('../models/productModels'); // Adjust the path as necessary
const {createNotification} = require('./notification'); // Adjust the path as necessary
const { getIO }  = require('../config/socket')


const scheduleProductReminders = async () => {
  try {

    const products = await Product.find({ selectItem: 'seasonal' });

    products.forEach((product) => {
      if (product.reminder) {
        nodeSchedule.scheduleJob(product.reminder, async () => {
            console.log("Schedule Notification")
        const io = getIO();
          const message = `Reminder for seasonal product: ${product.productName}`;
          const title = 'Seasonal Product Reminder';
          const userId = product.createdBy; 
          const actionUser = product.employeeName;

        await createNotification(
            io,
            null,
            userId,
            message,
            title,
            actionUser,
            product.image, // Assuming the product image is relevant
            product._id // Your onClick action URL or function
          );
          await createNotification(
            io,
            "superadmin",
            null,
            message,
            title,
            actionUser,
            product.image, // Assuming the product image is relevant
            product._id // Your onClick action URL or function
          );
          await createNotification(
            io,
            "admin",
            null,
            message,
            title,
            actionUser,
            product.image, // Assuming the product image is relevant
            product._id // Your onClick action URL or function
          );
        });
      }
    });
  } catch (error) {
    console.error('Error scheduling product reminders:', error);
  }
};

module.exports = scheduleProductReminders;
