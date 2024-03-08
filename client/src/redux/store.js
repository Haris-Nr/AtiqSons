import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Features/auth/authSlice";
import fetchReducer from "./Features/auth/fetchSlice";
import employeeReducer from "./Features/Employees/employeeSlice";
import productReducer from "./Features/Product/productSlice";
import logReducer from "./Features/auth/logSlice";
import notifyReducer from "./Features/Notification/notificationSlice";
import taskReducer from "./Features/Task/taskSlice";
import dubaiReducer from "./Features/Dubai/dubaiSlice";
import orderReducer from "./Features/Order/orderSlice";
import exchangeRateReducer from "./Features/ExchangeRate/exchangeRateSlice";
import breakReducer from "./Features/Break/breakSlice";
import stockReducer from "./Features/stock/stockSlice";
import screenShotReducer from "./Features/ScreenShot/screenShotSlice";
import flexReducer from "./Features/flex/flexSlice";
import fianceReducer from "./Features/fiance/fianceSlice";
import fullfilmentsReducer from './Features/fulfilment/fullfilmentSlice';
import activityLogReducer from './Features/ActivityLog/activityLogSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    fetch: fetchReducer,
    log: logReducer,
    employee: employeeReducer,
    product: productReducer,
    notifications: notifyReducer,
    task: taskReducer,
    dubai: dubaiReducer,
    order: orderReducer,
    exchangeRate: exchangeRateReducer,
    break: breakReducer,
    screenShot: screenShotReducer,
    stock: stockReducer,
    flex: flexReducer,
    fiance:fianceReducer,
    fullfilments: fullfilmentsReducer,
    activityLog: activityLogReducer
  },
});
