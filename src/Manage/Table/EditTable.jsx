import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { editTable, getAllTable } from "../../features/TableSlice/TableSlice";
import styles from "../../css/LayoutAdmin.module.css";
import { Button, Form, Input, message,Spin } from "antd";
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};
const EditTable = () => {
  const { id } = useParams();
  const tables = useSelector((data) => data.table.value);
  const table = tables?.find((item) => item._id == id);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(getAllTable());
  }, []);
  const uploadTable = async (value) => {
    const newData = {
      name: value.name == undefined ? table.name : value.name,
    };
    setLoading(true);
    await dispatch(editTable({ id: id, data: newData }));
    setLoading(false);
    navigate("/manager/table");
    message.success("Sửa thành công ");
  };

  return (
    <div>
      {loading == true && (
        <div style={{ marginBottom: 10 }}>
          <Spin />
        </div>
      )}
      <h5 className={styles.title}>Sửa bàn</h5>
      {tables.length > 0 && (
        <Form {...formItemLayout} onFinish={uploadTable}>
          <Form.Item name="name" label="Tên bàn" labelAlign="left">
            <Input defaultValue={table?.name} />
          </Form.Item>

          {loading == true ? (
            <Spin />
          ) : (
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ marginRight: 10 }}
              >
                <Link to="/manager/table">Quay lại</Link>
              </Button>
              <Button type="primary" htmlType="submit">
                Sửa
              </Button>
            </Form.Item>
          )}
        </Form>
      )}
    </div>
  );
};

export default EditTable;
