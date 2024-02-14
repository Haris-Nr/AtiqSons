import axiosInstance from "./axiosInstance";


const createOrder = async (values, onSuccess, onFail) => {
    try {

        const formData = new FormData();
        formData.append('sku', values.sku);
        formData.append('productName', values.productName);
        formData.append('quantity', values.quantity);
        formData.append('price', values.price);
        formData.append('status', values.status);


        formData.append('picture', values.picture[0].originFileObj);
        const response = await axiosInstance.post(`/api/order`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });

        if(response.status === 201 || response.status === 200){
            onSuccess();
        }else{
            onFail();
        }

        return response.data;
    } catch (error) {
        onFail();
        throw error.response.data
    }
}

const getOrders = async (page, pageSize, search) => {
    try {
        const response = await axiosInstance.get(`/api/order?page=${page}&limit=${pageSize}&search=${search}`);
        return response.data;
    } catch (error) {
        throw error.response.data
    }
}

const getOrder = async (id) => {
    try {
        const response = await axiosInstance.get(`/api/order/${id}`);
        return response.data;
    } catch (error) {
        throw error.response.data
    }
}

const updateOrder = async (id, orderData, onSuccess, onFail) => {
    try {
        const formData = new FormData();
        
        if(orderData.sku){
            formData.append('sku', orderData.sku);
        }

        if(orderData.productName){
            formData.append('productName', orderData.productName);
        }

        if(orderData.quantity){
            formData.append('quantity', orderData.quantity);
        }

        if(orderData.price){
            formData.append('price', orderData.price);
        }

        if(orderData.status){
            formData.append('status', orderData.status);
        }

        if(orderData.picture){
            formData.append('picture', orderData.picture[0].originFileObj);
        }



        const response = await axiosInstance.put(`/api/order/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });

        if(response.status === 200){
            onSuccess();
        } else {
            onFail();
        }

        return response;
    } catch (error) {
        onFail();
        throw error.response.data
    }
}


const deleteOrder = async (id, onSuccess, onFail) => {
    try {
        const response = await axiosInstance.delete(`/api/order/${id}`);
        if(response.status === 200){
            onSuccess();
        }else{
            onFail();
        }
        return response.data;
    } catch (error) {
        onFail();
        throw error.response.data
    }
}


const reOrder = async (id, onSuccess, onFail) => {
    try {
        const response = await axiosInstance.put(`/api/order/${id}/re-order`);
        if(response.status === 200){
            onSuccess();
        }else{
            onFail();
        }
        return response.data;
    } catch (error) {
        onFail();
        console.log(error);
        throw error.response.data
    }
}

const orderApi = {
    createOrder,
    getOrders,
    getOrder,
    updateOrder,
    deleteOrder,
    reOrder
};

export default orderApi;