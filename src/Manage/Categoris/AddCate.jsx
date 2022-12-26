import React, { useState } from "react";
import { Form, Input, Button, message, Spin } from "antd";
import styles from "../../css/LayoutAdmin.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addCategori } from "../../features/Categoris/CategoriSlice";
const AddCate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [loading, setLoading] = useState(false);

  const addCate = async (values) => {
    setLoading(true);

    await dispatch(addCategori({ name: values.name, user_id: user._id }));
    setLoading(false);

    message.success("Thêm thành công");
    navigate("/manager/categoris");
  };

  return (
    <div>
      <h5 className={styles.title}>Thêm danh mục</h5>
      <Form
        name="basic"
        initialValues={{
          remember: true,
        }}
        onFinish={addCate}
        autoComplete="off"
      >
        <Form.Item
          label="Tên danh mục"
          name="name"
          rules={[
            {
              required: true,
              message: "Chưa nhập tên danh mục!",
            },
          ]}
        >
          <Input placeholder="Danh mục" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ marginRight: 10 }}>
            <Link to="/manager/categoris">Quay lại</Link>
          </Button>
          {loading == true ? (
            <Spin style={{ marginLeft: 20 }} />
          ) : (
            <Button type="primary" htmlType="submit">
              Thêm
            </Button>
          )}
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddCate;
