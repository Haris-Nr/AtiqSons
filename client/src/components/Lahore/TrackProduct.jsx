import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Button, Form, InputNumber, Table, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  TrackingProduct,
  deleteTrack,
  getTrackingProduct,
  resetDeleteState,
} from "../../redux/Features/Product/productSlice";
import moment from "moment";
import DeleteButton from "../common/DeleteButton";

const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {


  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);

  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({
        ...record,
        ...values,
      });
    } catch (errInfo) {
      message.error(errInfo);
    }
  };

  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <InputNumber ref={inputRef} onPressEnter={save} className="w-full" placeholder="Enter Sale" />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};

const TrackProduct = ({ id }) => {

  const dispatch = useDispatch();
  const [dataSource, setDataSource] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [editableRows, setEditableRows] = useState({});
  const [edit, setEdit] = useState(true);


  const { gettrackproduct,deleteProductData } = useSelector((state) => state.product);

  console.log(deleteProductData)

  useEffect(() => {
    dispatch(getTrackingProduct(id))
  }, [dispatch, id]);

  useEffect(() => {
    if (gettrackproduct.data && gettrackproduct.success === true) {
      const formattedData = gettrackproduct.data.map((item, index) => ({
        key: index.toString(),
        ...item,
        date: new Date(item.date),
      }));
      setDataSource(formattedData);
    }
  }, [gettrackproduct.data, gettrackproduct.success]);


  const handleDelete = (trackid) => {
    dispatch(deleteTrack(trackid)).then(() => {
      message.success(deleteProductData.message);
      dispatch(getTrackingProduct(id))
      dispatch(resetDeleteState())
    })
  }

  const [count, setCount] = useState(dataSource.length - 1);

  const defaultColumns = [
    {
      title: "Date",
      dataIndex: "date",
      render: (_, record) => moment(record.date).format("DD/MM/YYYY"),
    },
    {
      title: "Sale",
      dataIndex: "sale",
      editable: edit
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      render: (_, record) =>(
        <DeleteButton 
        onConfirmDelete={()=>handleDelete(record._id)}
        />
      )
    },
  ];

  useEffect(() => {
    const initialEditability = dataSource.reduce((acc, item) => ({ ...acc, [item.key]: true }), {});
    setEditableRows(initialEditability);
  }, [dataSource]);
  
  const handleAdd = () => {
    const newKey = `${count + 1}`;
    const newData = {
      key: newKey.toString(),
      date: new Date(),
      sale: 0,
    };
    setDataSource([...dataSource, newData]);
    setCount(newKey);
    setIsButtonDisabled(true);
    setEditableRows(prev => ({ ...prev, [newKey]: true }));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const today = moment(new Date()).format("DD/MM/YYYY");
      if (
        dataSource.some(
          (data) => moment(data.date).format("DD/MM/YYYY") !== today
        )
      ) {
        setIsButtonDisabled(false);
        setEditableRows(
          dataSource.reduce((acc, item) => ({ ...acc, [item.key]: true }), {})
        );
      }
    }, 86400000);
    return () => clearInterval(timer);
  }, [dataSource]);

  useEffect(() => {
    const today = moment().startOf('day');
    const lastSaleDate = dataSource.length > 0 ? moment(dataSource[dataSource.length - 1].date).startOf('day') : null;
    setIsButtonDisabled(today.isSame(lastSaleDate, 'day'));
  }, [dataSource]);
  

  const handleSave = useCallback((row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const updatedRow = { ...newData[index], ...row, date: moment(row.date).toDate() };
    newData[index] = updatedRow
    setDataSource(newData);
    dispatch(TrackingProduct({ productId:id, date: row.date.toISOString(), sale: row.sale })).then(() => {
      dispatch(getTrackingProduct(id));
      setEdit(false)
      setEditableRows(prev => ({ ...prev, [row.key]: false }));
    });
  },[dispatch,dataSource,id])

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };


  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: editableRows[record.key],
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  return (
    <div className="space-y-5">
      {Date.now() && (
        <Button
          onClick={handleAdd}
          type="primary"
          disabled={isButtonDisabled}
          className="flex justify-start"
        >
          Add a Sale
        </Button>
      )}
      <Table
       size="middle"
       bordered
        components={components}
        rowClassName={() => "editable-row"}
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        scroll={{ x: true }}
      />
    </div>
  );
};

export default TrackProduct;
