import axiosInstance from './axiosInstance';


const getEmployee = async (page,limit) => {
    try {
        const queryParams = `?page=${page}&limit=${limit}`;
        const { data } = await axiosInstance.get(`/api/user/getemployee${queryParams}`);
        return data;
    } catch (error) {
        throw error.response.data;
    }  
};


const deleteEmployee = async (id) => {
    try {
        const {data} = await axiosInstance.delete(`/api/user/delete/${id}`);
        return data;
    } catch (error) {
        throw error.response.data;
    }
};

const changeStatus = async (id, newStatus) => {
    try {
        const {data} = await axiosInstance.patch(`/api/user/changestatus/${id}`,{ status: newStatus });
        return data;
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

const getAdmin = async (page,limit) => {
    try {
        const queryParams = `?page=${page}&limit=${limit}`;
        const {data} = await axiosInstance.get(`/api/user/getadmin${queryParams}`);
        return data;
    } catch (error) {
        throw error.response.data;
    }
    
};

const getEmployeeNameAndId = async () => {
    try {
        const {data} = await axiosInstance.get(`/api/user/getempnameid`);
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
    getEmployeeNameAndId,
};

export default employeeApi;
