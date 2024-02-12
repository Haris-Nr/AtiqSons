import axiosInstance from './axiosInstance';


const getEmployee = async () => {
    try {
        const { data } = await axiosInstance.get(`/api/user/getemployee`);
        return data;
    } catch (error) {
        throw error.response.data;
    }  
};


const deleteEmployee = async (id) => {
    try {
        const response = await axiosInstance.delete(`/api/user/delete/${id}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

const changeStatus = async (id, newStatus) => {
    try {
        const response = await axiosInstance.patch(`/api/user/changestatus/${id}`,{ status: newStatus });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

const getEmployeeDetails = async (id) => {
    try {
        const { data } = await axiosInstance.get(`/api/user/getemployeedetails/${id}`);
        return data;
    } catch (error) {
        throw error.response.data;
    }
};


const getAdmin = async () => {
    try {
        const {data} = await axiosInstance.get(`/api/user/getadmin`);
        return data;
    } catch (error) {
        throw error.response.data;
    }
    
};

const employeeApi = {
    getEmployee,
    deleteEmployee,
    changeStatus,
    getEmployeeDetails,
    getAdmin,
};

export default employeeApi;
