import "./App.css";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";


// layout
import Loginlayout from "./components/Layout/Loginlayout";
import DashboardLayout from "./components/Layout/DashboardLayout";


// Common pages
import Dashboard from "./components/common/Dashboard";
import NotifyTable from "./components/common/NotifyTable";
import TaskTable from "./components/common/TaskTable";
import SingleProductPage from "./components/common/SingleProductPage";


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

// lahore pages
import LahoreProductTable from "./components/Lahore/LahoreProductTable";
import TrackProduct from "./components/Lahore/TrackProduct";
import IntrackingproductTable from "./components/Lahore/IntrackingproductTable";

// Dubai pages
import DubaiProductTable from "./components/Dubai/DubaiProductTable";


import AdminTable from "./components/Admin/AdminTable";


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

       


        {/* Lahore Routes */}
        <Route path="lahoreproducttable" element={<LahoreProductTable />} />
        <Route path="lahoreproducttable/:id" element={<SingleProductPage />} />
        <Route path="trackproduct" element={<TrackProduct />} />
        <Route path="intrackingtable" element={<IntrackingproductTable />} />
        <Route path="intrackingtable/:id" element={<SingleProductPage />} />

        {/* Dubai Routes */}
        <Route path="dubaiproducttable" element={<DubaiProductTable />} />
        <Route path="dubaiproducttable/:id" element={<SingleProductPage />} />

        {/* Admin Routes */}
        <Route path="employees" element={<EmpolyeeTable />} />
        <Route path="employees/:id" element={<UserInfo />} />
        <Route path="logs" element={<LogTable />} />
        <Route path="productTable" element={<AdminProductTable />} />
        <Route path="productTable/:id" element={<SingleProductPage />} />
        <Route path="adminTask" element={<AdminTaskTable />} />
        <Route path="adminTable" element={<AdminTable/>}/>
        <Route path="adminTable/:id" element={<UserInfo/>}/>

      </Route>
    </Route>
  )
);

function App() {
 
  return (
    <>

      <RouterProvider router={router} />
    </>
  );
}

export default App;
