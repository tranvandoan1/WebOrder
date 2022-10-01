import React, { useState } from "react";
import { Form, Input, Button, Upload, Modal, message, Spin } from "antd";
import {
  UserOutlined,
  LockOutlined,
  UploadOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import "../css/Signin.css";
import { Link, useNavigate } from "react-router-dom";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import UserAPI from "../API/Users";
import styles from "../css/Home.module.css";
const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState("");

  const UploadAvatatr = (file) => {
    const imageRef = ref(storage, `images/${file.name}`);
    setLoading(true);
    uploadBytes(imageRef, file).then(() => {
      getDownloadURL(imageRef).then(async (url) => {
        await setImage(url);
        setLoading(false);
      });
    });
  };
  const signup = async (values) => {
    const isphone =
      /^(1\s|1|)?((\(\d{3}\))|\d{3})(\-|\s)?(\d{3})(\-|\s)?(\d{4})$/.test(
        values.phone
      );
    const checkValidate1 = values.email.indexOf("@");
    const checkValidate2 = values.email.lastIndexOf(".");

    if (checkValidate1 < 1 || checkValidate2 < checkValidate1 + 2) {
      message.warning("Định dạng email chưa đúng !");
    } else if (isphone == false) {
      message.warning("Số điện thoại chưa đúng !");
    } else if (isNaN(values.name) == false) {
      message.warning("Tên khách phải là chữ !");
    } else {
      const user = {
        email: values.email,
        avatar:
          String(image).length <= 0
            ? "https://png.pngtree.com/png-vector/20190805/ourlarge/pngtree-account-avatar-user-abstract-circle-background-flat-color-icon-png-image_1650938.jpg"
            : image,
        name: values.name,
        phone: values.phone,
        password: values.password,
        nameRestaurant: "",
        avatarRestaurant: "",
        loginApp: 0,
        loginWeb: 0,
      };
      setLoading(true);
      await UserAPI.signup(user);
      setLoading(false);
      alert("Đăng ký thành công. Hãy đăng nhập");
      window.location.href = "/";
    }
  };
  return (
    <div className="backgroundd">
      <div className="back">
        <div className="form-signin">
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
              />
            </Form.Item>
            <Form.Item
              name="email"
              rules={[{ required: true, message: "Vui lòng nhập email!" }]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Email"
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
              />
            </Form.Item>
            <Form.Item name="avatar" label="Avatar">
              {/* <label
                htmlFor="photo"
                style={{ display: "flex", alignItems: "center" }}
              >
                <UploadOutlined style={{ cursor: "pointer" }} />
                <img src={image} alt="" />
              </label>
              <input
                type="file"
                style={{ display: "none" }}
                id="photo"
                onClick={() => Upload5()}
              /> */}
              <Upload
                listType="picture-card"
                showUploadList={false}
                beforeUpload={UploadAvatatr}
              >
                {image ? (
                  <div className={styles.box_image}>
                    <img src={image} className="image" />
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
            {loading == true ? (
              <Spin />
            ) : (
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                >
                  Đăng ký
                </Button>
                <Link style={{ marginLeft: "10px" }} to="/signin">
                  Đăng nhập
                </Link>
              </Form.Item>
            )}
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
