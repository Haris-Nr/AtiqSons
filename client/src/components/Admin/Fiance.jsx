import React, { useState, useEffect } from 'react';
import { Button, Modal, Upload, message, Card, Space, Form,Image } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { uploadImageAsync, fetchAllImagesAsync, deleteImageAsync } from '../../redux/Features/fiance/fianceSlice';
const baseURL = import.meta.env.VITE_API_BASE_URL;

const Fiance = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { images } = useSelector((state) => state.fiance);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    dispatch(fetchAllImagesAsync());
  }, [dispatch,reload]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        handleUpload(values);
        setIsModalVisible(false);
        dispatch(fetchAllImagesAsync());
        setReload(!reload)
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleUpload = async (values) => {
    try {
      const file = values.image[0].originFileObj;
      dispatch(uploadImageAsync(file));
      message.success('Image uploaded successfully');
      setIsModalVisible(false);
      dispatch(fetchAllImagesAsync());
      setReload(!reload)
    } catch (error) {
      message.error('Upload failed');
    }
  };

  const handleDelete = async (id) => {
    dispatch(deleteImageAsync(id));
    message.success('Image deleted successfully');
    dispatch(fetchAllImagesAsync());
    setReload(!reload)
  };

  return (
    <div>
      <Button type="primary" onClick={showModal}>
        Upload Image
      </Button>
      <Modal title="Upload Image" open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Form form={form} layout="vertical">
          <Form.Item
            name="image"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e && e.fileList;
            }}
            rules={[{ required: true, message: 'Please upload an image!' }]}
          >
            <Upload name="image" listType="picture" beforeUpload={() => false} maxCount={1}>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
      <Space direction="horizontal" size="large" style={{ width: '100%' }}>
        {images.map((image) => (
          <Card key={image._id} extra={<Button icon={<DeleteOutlined />} onClick={() => handleDelete(image._id)}>Delete</Button>}>
            <Image src={`${baseURL}${image.image}`} alt={image.name} width={100} />
          </Card>
        ))}
      </Space>
    </div>
  );
};

export default Fiance;
