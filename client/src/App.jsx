import "./App.css";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import { TimerProvider } from "./contexts/TimerContext";
import { OrdersProvider } from "./contexts/OrdersContext";

// layout
import Loginlayout from "./components/Layout/Loginlayout";
import DashboardLayout from "./components/Layout/DashboardLayout";

// Common pages
import Dashboard from "./components/common/Dashboard";
import NotifyTable from "./components/common/NotifyTable";
import TaskTable from "./components/common/TaskTable";
import SingleProductPage from "./components/common/SingleProductPage";
import Settings from "./pages/employees/Settings";
import BreakAndLeavePage from "./pages/BreakAndLeavePage";

// auth pages
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";

// admin pages
import EmpolyeeTable from "./components/Admin/EmpolyeeTable";
import LogTable from "./components/Admin/LogTable";
import UserInfo from "./components/Admin/UserInfo";
import AdminTaskTable from "./components/Admin/AdminTaskTable";
import AdminProductTable from "./components/Admin/AdminProductTable";
import ExchangeRatesTable from "./components/Admin/ExchangeRatesTable";
import CBMCalculator from "./components/Admin/CBMCalculator";
import ScreenShotsTable from "./components/Admin/ScreenShotsTable";
import ActivityLogsTable from "./components/Admin/ActivityLogsTable";

// lahore pages
import LahoreProductTable from "./components/Lahore/LahoreProductTable";
import TrackProduct from "./components/Lahore/TrackProduct";
import IntrackingproductTable from "./components/Lahore/IntrackingproductTable";

// Dubai pages
import DubaiProductTable from "./components/Dubai/DubaiProductTable";

// China pages
import OrdersTable from "./components/common/OrdersTable";

import AdminTable from "./components/Admin/AdminTable";
import AllTrackingproduct from "./components/Admin/AllTrackingproduct";
import AdminTrackData from "./components/Admin/AdminTrackData";
import StockTable from "./components/Admin/StockTable";
import Flex from "./components/Admin/Flex";
import Fiance from "./components/Admin/Fiance";
import Fullfilment from "./components/common/Fullfilment";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<Loginlayout />}>
        <Route index element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="resetpassword" element={<ResetPassword />} />
      </Route>

      <Route path="/:dashboard" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />

        {/* common */}
        <Route path="task" element={<TaskTable />} />
        <Route path="notification" element={<NotifyTable />} />
        <Route path="/:dashboard/:id" element={<SingleProductPage />} />
        <Route path="fullfilment" element={<Fullfilment />} />

        {/* Lahore Routes */}
        <Route
          path="lahoreproducttable/:company"
          element={<LahoreProductTable />}
        />
        <Route
          path="lahoreproducttable/selectItem/:selectItemValue"
          element={<LahoreProductTable />}
        />
        <Route
          path="lahoreproducttable/selectItem/:selectItemValue/:id"
          element={<SingleProductPage />}
        />
        <Route
          path="lahoreproducttable/:company/:id"
          element={<SingleProductPage />}
        />
        <Route path="intrackingtable" element={<IntrackingproductTable />} />
        <Route path="intrackingtable/:id" element={<TrackProduct />} />

        {/* Dubai Routes */}
        <Route path="dubaiproducttable" element={<DubaiProductTable />} />
        <Route path="dubaiproducttable/:id" element={<SingleProductPage />} />

        {/* Admin Routes */}
        <Route path="employees" element={<EmpolyeeTable />} />
        <Route path="employees/:id" element={<UserInfo />} />
        <Route path="logs" element={<LogTable />} />
        <Route path="productTable/:company" element={<AdminProductTable />} />
        <Route
          path="productTable/selectItem/:selectItemValue"
          element={<AdminProductTable />}
        />
        <Route
          path="productTable/selectItem/:selectItemValue/:id"
          element={<SingleProductPage />}
        />
        <Route
          path="productTable/:company/:id"
          element={<SingleProductPage />}
        />
        <Route path="adminTask" element={<AdminTaskTable />} />
        <Route path="adminTable" element={<AdminTable />} />
        <Route path="adminTable/:id" element={<UserInfo />} />
        <Route path="orders" element={<OrdersTable />} />
        <Route path="exchange-rates" element={<ExchangeRatesTable />} />
        <Route path="cbm-calculator" element={<CBMCalculator />} />
        <Route path="settings" element={<Settings />} />
        <Route path="break-leave" element={<BreakAndLeavePage />} />
        <Route path="screenshots" element={<ScreenShotsTable />} />
        <Route path="trackingProduct" element={<AllTrackingproduct />} />
        <Route path="trackingProduct/:id" element={<AdminTrackData />} />
        <Route path="activity-logs" element={<ActivityLogsTable />} />
        <Route path="WarehouseStock" element={<StockTable />} />
        <Route path="flex" element={<Flex />} />
        <Route path="fiance" element={<Fiance />} />
      </Route>
    </Route>
  )
);

function App() {
  return (
    <>
      <TimerProvider>
        <OrdersProvider>
          <RouterProvider router={router} />
        </OrdersProvider>
      </TimerProvider>
    </>
  );
}

export default App;
