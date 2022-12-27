import { PlusCircleOutlined } from "@ant-design/icons";
import {
  Form,
  Input,
  Button,
  Select,
  Upload,
  Spin,
  Alert,
  Row,
  Col,
  message,
  Switch,
} from "antd";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../css/LayoutAdmin.module.css";
import { getCategori } from "../../features/Categoris/CategoriSlice";
import { addProduct } from "../../features/ProductsSlice/ProductSlice";
import { storage } from "../../firebase";
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
const { Option } = Select;
const AddPro = () => {
  const [check, setCheck] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const categoris = useSelector((data) => data.categori.value);
  const user = JSON.parse(localStorage.getItem("user"));
  const [photo, setPhoto] = useState();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    dispatch(getCategori());
  }, []);
  const onSubmit = async (data) => {
    setCheck(true);

    const product = {
      cate_id: data.cate_id,
      photo: photo,
      name: data.name,
      price: Number(data.price),
      user_id: user._id,
      dvt: data.dvt,
      check: data.check == undefined ? false : data.check,
    };
    await dispatch(addProduct(product));
    navigate("/manager/products");
    message.success("Thêm thành công");

    setCheck(false);
  };
  const UploadAvatatr = (file) => {
    const imageRef = ref(storage, `images/${file.name}`);
    setLoading(true);
    uploadBytes(imageRef, file).then(() => {
      getDownloadURL(imageRef).then(async (url) => {
        await setPhoto(url);
        setLoading(false);
      });
    });
  };
  return (
    <div style={{ height: "100%" }}>
      {categoris?.length <= 0 ? (
        <span style={{ color: "red", fontSize: 18, fontWeight: "500" }}>
          Hãy thêm danh mục trước khi thêm sản phẩm !
        </span>
      ) : (
        <React.Fragment>
          <h5 className={styles.title}>
            Thêm sản phẩm{" "}
            {check == true && (
              <Spin tip="Loading...">
                <Alert message="Đang thêm..." type="info" />
              </Spin>
            )}
          </h5>
          <Form {...formItemLayout} onFinish={onSubmit}>
            <Form.Item
              name="name"
              label="Tên sản phẩm"
              labelAlign="left"
              rules={[
                {
                  required: true,
                  message: "Chưa nhập tên sản phẩm!",
                },
              ]}
            >
              <Input placeholder="Tên sản phẩm" />
            </Form.Item>
            <Form.Item
              name="price"
              label="Giá"
              labelAlign="left"
              rules={[
                {
                  required: true,
                  message: "Chưa nhập giá sản phẩm!",
                },
              ]}
            >
              <Input placeholder="Giá sản phẩm" type="number" />
            </Form.Item>
            <Form.Item
              name="cate_id"
              label="Danh mục"
              labelAlign="left"
              rules={[
                {
                  required: true,
                  message: "Chưa nhập giá sản phẩm!",
                },
              ]}
            >
              <Select
                placeholder="Chọn danh mục"
                style={{ textTransform: "capitalize" }}
              >
                {categoris.map((item, index) => (
                  <Option
                    value={item._id}
                    key={item}
                    style={{ textTransform: "capitalize" }}
                  >
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="dvt"
              label="Đơn vị"
              labelAlign="left"
              rules={[
                {
                  required: true,
                  message: "Chưa nhập giá sản phẩm!",
                },
              ]}
            >
              <Input placeholder="Đơn vị (Đĩa , cân ...)" />
            </Form.Item>
            <Form.Item>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <div style={{ width: "20%" }}>
                  <h5 style={{ fontSize: 16, fontWeight: "400" }}>Ảnh : </h5>
                </div>
                <div style={{ width: "80%" }}>
                  <Upload
                    listType="picture-card"
                    showUploadList={false}
                    beforeUpload={UploadAvatatr}
                  >
                    <div>
                      <div
                        style={{
                          marginTop: 8,
                        }}
                      >
                        {loading == true ? (
                          <Spin />
                        ) : (
                          <div
                            style={
                              photo == undefined
                                ? {
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }
                                : {
                                    position: "relative",
                                    overflow: "hidden",
                                    width: 100,
                                    height: 100,
                                  }
                            }
                          >
                            {photo == undefined ? (
                              <PlusCircleOutlined
                                style={{
                                  fontSize: 30,
                                  opacity: 0.3,
                                  color: "blue",
                                }}
                              />
                            ) : (
                              <img
                                src={photo}
                                className="image"
                                style={{
                                  objectFit: "contain",
                                  width: "100%",
                                  height: "100%",
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                }}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </Upload>
                </div>
              </div>
            </Form.Item>
            <Form.Item
              labelAlign="left"
              label="Cân nặng (nếu có)"
              valuePropName="checked"
              name="check"
            >
              <Switch />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ marginRight: 10 }}
              >
                <Link to="/manager/products">Quay lại</Link>
              </Button>
              {check == true||loading==true ? (
                <Spin />
              ) : (
                <Button type="primary" htmlType="submit">
                  Thêm
                </Button>
              )}
            </Form.Item>
          </Form>
        </React.Fragment>
      )}
    </div>
  );
};

export default AddPro;
