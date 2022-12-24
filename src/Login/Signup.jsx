import React, { useState } from "react";
import { Form, Input, Button, Upload, Modal, message, Spin } from "antd";
import {
  UserOutlined,
  LockOutlined,
  PlusCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import "../css/Signin.css";
import {  Link } from "react-router-dom";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import UserAPI from "../API/Users";
import styles from "../css/Home.module.css";
import { Size } from "./../size";
import { validatePhone } from "../components/Validate";
const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState();
  const sizes = Size();
  const UploadAvatatr = (file) => {
    setLoading(false);
    const src = URL.createObjectURL(file);
    setImage({ url: src, file: file });
    setLoading(false);
  };
  const signup = async (values) => {
    const checkValidate1 = values.email.indexOf("@");
    const checkValidate2 = values.email.lastIndexOf(".");
    try {
      if (checkValidate1 < 1 || checkValidate2 < checkValidate1 + 2) {
        message.warning("Định dạng email chưa đúng !");
      } else if (validatePhone(values.phone) == false) {
        message.warning("Số điện thoại chưa đúng !");
      } else if (isNaN(values.name) == false) {
        message.warning("Tên khách phải là chữ !");
      } else {
        setLoading(true);
        if (image == undefined) {
          const user = {
            email: values.email,
            avatar:
              "https://png.pngtree.com/png-vector/20170805/ourlarge/pngtree-account-avatar-user-abstract-circle-background-flat-color-icon-png-image_1650938.jpg",
            name: values.name,
            phone: values.phone,
            password: values.password,
            nameRestaurant: "",
            avatarRestaurant: "",
            accountType: 0,
          };
          await UserAPI.signup(user);
          setLoading(false);
          alert("Đăng ký thành công. Hãy đăng nhập");
          window.location.href = "/";
        } else {
          setLoading(true);
          const imageRef = ref(storage, `images/${image.file.name}`);
          uploadBytes(imageRef, image.file).then(() => {
            getDownloadURL(imageRef).then(async (url) => {
              const user = {
                email: values.email,
                avatar: url,
                name: values.name,
                phone: values.phone,
                password: values.password,
                nameRestaurant: "",
                avatarRestaurant: "",
                accountType: 0,
              };
              await UserAPI.signup(user);
              setLoading(false);
              alert("Đăng ký thành công. Hãy đăng nhập");
              window.location.href = "/";
            });
          });
        }
      }
    } catch (error) {
      const errorLogin = error.response.data.error;
      message.error(errorLogin);
      setLoading(false);
    }
  };
  return (
    <div className="backgroundd">
      <div className="back" style={{ overflow: "scroll" }}>
        <ul className="background-body">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
        <div
          className="form-signin"
          style={{
            width: sizes.width < 1024 ? 500 : sizes.width == 1024 ? 500 : 600,
          }}
        >
          <div
            className="logo"
            style={{ textAlign: "center", marginBottom: "20px" }}
          >
            <img
              src="https://123design.org/wp-content/uploads/2020/07/LOGOLM0200-Chibi-%C4%90%E1%BB%87-nh%E1%BA%A5t-%C4%91%E1%BA%A7u-b%E1%BA%BFp-nh%C3%AD-Vua-%C4%91%E1%BA%A7u-b%E1%BA%BFp.jpg"
              alt=""
            />
          </div>
          <h3
            style={{ textAlign: "center", margin: "20px 0", color: "#ee4d2d" }}
          >
            Đăng ký
          </h3>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={signup}
          >
            <Form.Item
              name="name"
              rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Họ và Tên"
                style={{
                  borderRadius: 5,
                  fontSize:
                    sizes.width < 1024 ? 12 : sizes.width == 1024 ? 13 : 15,
                }}
              />
            </Form.Item>
            <Form.Item
              name="email"
              rules={[{ required: true, message: "Vui lòng nhập email!" }]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Email"
                style={{
                  borderRadius: 5,
                  fontSize:
                    sizes.width < 1024 ? 12 : sizes.width == 1024 ? 13 : 15,
                }}
                type="email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your Password!" },
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
                style={{
                  borderRadius: 5,
                  fontSize:
                    sizes.width < 1024 ? 12 : sizes.width == 1024 ? 13 : 15,
                }}
              />
            </Form.Item>
            <Form.Item
              name="phone"
              rules={[
                { required: true, message: "Please input your Password!" },
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="phone"
                placeholder="Số điện thoại"
                style={{
                  borderRadius: 5,
                  fontSize:
                    sizes.width < 1024 ? 12 : sizes.width == 1024 ? 13 : 15,
                }}
              />
            </Form.Item>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ position: "relative", width: 200 }}>
                <Form.Item label="Avatar">
                  <Upload
                    listType="picture-card"
                    showUploadList={false}
                    beforeUpload={UploadAvatatr}
                  >
                    {image ? (
                      <div className={styles.box_image}>
                        <img src={image.url} className="image" />
                      </div>
                    ) : (
                      <div>
                        <div
                          style={{
                            marginTop: 8,
                          }}
                        >
                          {loading == true ? (
                            <Spin />
                          ) : (
                            <PlusCircleOutlined
                              style={{
                                fontSize: 30,
                                opacity: 0.3,
                                color: "blue",
                              }}
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </Upload>
                </Form.Item>
                {image !== undefined && (
                  <CloseCircleOutlined
                    onClick={() => setImage()}
                    style={{
                      fontSize: 15,
                      position: "absolute",
                      color: "red",
                      top: -10,
                      right: -25,
                      zIndex: 1000,
                    }}
                  />
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                  width: "100%",
                  flexDirection: "column",
                  height: "100%",
                  marginTop: 55,
                }}
              >
                {loading == true ? (
                  <Spin />
                ) : (
                  <Form.Item>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Link
                        style={{
                          fontSize: 14,
                          padding: 5,
                          margin: 0,
                        }}
                        to="/signin"
                      >
                        Đăng nhập
                      </Link>
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="login-form-button"
                        style={{
                          fontSize: 16,
                          padding: "5px 5px",
                          margin: 0,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          fontWeight: "400",
                          borderRadius: 4,
                          height: 30,
                          width: 100,
                        }}
                      >
                        Đăng ký
                      </Button>
                    </div>
                  </Form.Item>
                )}
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
