import React, { useState } from "react";
import { Form, Input, Button, Spin, message } from "antd";
import styles from "../../css/LayoutAdmin.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addTable } from "./../../features/TableSlice/TableSlice";
const AddTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [loading, setLoading] = useState(false);

  const addCate = async (values) => {
    const newData = {
      name: values.name,
      user_id: user._id,
      nameUser: "",
      amount: 0,
      timeBookTable: "null",
    };
    setLoading(true);
    await dispatch(addTable(newData));
    setLoading(false);
    navigate("/manager/table");
    message.success("Thêm thành công");
  };
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
  return (
    <div>
      {loading == true && (
        <div style={{ marginBottom: 10 }}>
          <Spin />
        </div>
      )}
      <h5 className={styles.title}>Thêm bàn</h5>
      <Form
        initialValues={{
          remember: true,
        }}
        {...formItemLayout}
        onFinish={addCate}
      >
        <Form.Item
          name="name"
          label="Tên bàn"
          labelAlign="left"
          rules={[
            {
              required: true,
              message: "Chưa nhập tên bàn!",
            },
          ]}
        >
          <Input placeholder="Bàn" />
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
              Thêm
            </Button>
          </Form.Item>
        )}
      </Form>
    </div>
  );
};

export default AddTable;
