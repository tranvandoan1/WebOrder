import React, { useState } from "react";
import { Form, Input, Button, Checkbox, Modal, message, Spin } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "../css/Signin.css";
import UserAPI from "../API/Users";
import { Link, useNavigate } from "react-router-dom";
const Signin = () => {
  const [loading, setLoading] = useState(false);
  const signin = async (values) => {
    const user = {
      email: values.email,
      password: values.password,
    };
    setLoading(true);
    try {
      const { data } = await UserAPI.signin(user);
      localStorage.setItem("user", JSON.stringify({ _id: data.user._id }));
      localStorage.setItem("token", JSON.stringify(data.token));
      alert("Mời bạn vào trang web");
      if (data?.user?.loginWeb == 0) {
        window.location.href = "/";
      } else {
        window.location.href = "/";
      }
      setLoading(false);
    } catch (error) {
      const errorLogin = error.response.data.error;
      message.error(errorLogin);
      setLoading(false);
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
            Đăng nhập
          </h3>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={signin}
          >
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
              rules={[{ required: true, message: "Vui lòng nhập password!" }]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>
            {loading == true ? (
              <Spin style={{ marginRight: 10 }} />
            ) : (
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                >
                  Đăng nhập
                </Button>
                <Link style={{ marginLeft: "10px" }} to="/signup">
                  Đăng ký
                </Link>
              </Form.Item>
            )}
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Signin;
