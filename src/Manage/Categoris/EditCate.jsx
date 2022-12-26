import { Button, Form, Input, message, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getCategori,
  uploadCategori,
} from "../../features/Categoris/CategoriSlice";
import styles from "../../css/AdminCate.module.css";
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
const EditCate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const categoris = useSelector((data) => data.categori.value);
  const categori = categoris?.find((item) => item._id == id);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    dispatch(getCategori());
  }, []);

  const editCate = async (values) => {
    setLoading(true);
    await dispatch(
      uploadCategori({
        id: id,
        data: { name: values.name == undefined ? categori.name : values.name },
      })
    );
    setLoading(false);
    navigate("/manager/categoris");
    message.success("Sửa thành công");
  };

  return (
    <>
      <h5 className={styles.h4}>Sửa danh mục</h5>
      {categoris.length > 0 && (
        <Form
          name="basic"
          initialValues={{
            remember: true,
          }}
          {...formItemLayout}
          onFinish={editCate}
          autoComplete="off"
        >
          <Form.Item label="Tên danh mục" name="name" labelAlign="left">
            <Input defaultValue={categori?.name} placeholder="Tên danh mục" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ marginRight: 10 }}
            >
              <Link to="/manager/categoris">Quay lại</Link>
            </Button>
            {loading == true ? (
              <Spin style={{ marginLeft: 20 }} />
            ) : (
              <Button type="primary" htmlType="submit">
                Sửa
              </Button>
            )}
          </Form.Item>
        </Form>
      )}
    </>
  );
};

export default EditCate;
