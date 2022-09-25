import { EditOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Col, Form, Input, message, Row, Spin } from "antd";
import React, { useEffect, useState } from "react";
import styles from "../../css/Account.module.css";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../firebase";
import { editUser, getUser } from "../../features/User/UserSlice";
import { useDispatch, useSelector } from "react-redux";

const Account = () => {
  const dispatch = useDispatch();
  const user = useSelector((data) => data.user.value);
  useEffect(() => {
    dispatch(getUser());
  }, []);
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState();

  const loadFile = (event) => {
    const photo = document.querySelector("#images").files[0];
    const imageRef = ref(storage, `images/${photo.name}`);
    setLoading(true);
    uploadBytes(imageRef, photo).then(() => {
      getDownloadURL(imageRef).then(async (url) => {
        await setPhoto(url);
        setLoading(false);
      });
    });
  };
  const onFinish = async (values) => {
    const uploadUser = {
      name: values.name == undefined ? user.name : values.name,
      email: values.email == undefined ? user.email : values.email,
      phone: values.phone == undefined ? user.phone : values.phone,
      avatar: photo !== undefined ? photo : user.avatar,
      _id: user._id,
    };
    setLoading(true);
    message.warning("Đang tiến hành sửa !");
    await dispatch(editUser(uploadUser));
    setPhoto();
    setLoading(false);
    message.success("Sửa thành công");
  };
  return (
    <div>
      {Object.keys(user).length > 0 && (
        <>
          <div className={styles.header}>
            <h5>Hồ Sơ Của Tôi</h5>
            <p style={{ opacity: 0.7 }}>
              Quản lý thông tin hồ sơ để bảo mật tài khoản
            </p>
          </div>

          <Row style={{ marginTop: 10 }}>
            <Col
              xs={12}
              sm={4}
              md={12}
              lg={16}
              xl={16}
              className={styles.colLeft}
            >
              <Form
                name="basic"
                labelCol={{
                  span: 6,
                }}
                wrapperCol={{
                  span: 18,
                }}
                onFinish={onFinish}
              >
                <Form.Item
                  label="Tên của bạn "
                  name="name"
                  style={{ marginTop: 30, fontWeight: "500" }}
                >
                  <Input
                    className={styles.input}
                    placeholder="Basic usage"
                    defaultValue={user.name}
                  />
                </Form.Item>
                <Form.Item
                  label="Email"
                  name="email"
                  style={{ marginTop: 30, fontWeight: "500" }}
                >
                  <Input
                    className={styles.input}
                    placeholder="Basic usage"
                    defaultValue={user.email}
                    id="emails"
                  />
                </Form.Item>
                <Form.Item
                  label="Số điện thoại"
                  name="phone"
                  style={{ marginTop: 30, fontWeight: "500" }}
                >
                  <Input
                    className={styles.input}
                    placeholder="Basic usage"
                    defaultValue={`0${user.phone}`}
                  />
                </Form.Item>

                <div style={{ marginTop: 20 }}>
                  <Form.Item
                    wrapperCol={{
                      offset: 8,
                      span: 16,
                    }}
                  >
                    {loading == true ? (
                      <Spin size="large" />
                    ) : (
                      <Button
                        type="primary"
                        htmlType="submit"
                        style={{ background: "blue", color: "#fff" }}
                      >
                        Lưu
                      </Button>
                    )}
                  </Form.Item>
                </div>
              </Form>
            </Col>
            <Col
              xs={12}
              sm={4}
              md={12}
              lg={8}
              xl={8}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div className={styles.user_image}>
                {user.avatar == "" ? (
                  <div className={styles.user_avatar}>
                    <UserOutlined style={{ fontSize: 35, padding: 20 }} />
                  </div>
                ) : photo !== undefined ? (
                  loading == true ? (
                    <Spin size="large" />
                  ) : (
                    <Avatar size={200} src={photo} />
                  )
                ) : loading == true ? (
                  <Spin size="large" />
                ) : (
                  <Avatar size={200} src={user.avatar} />
                )}
                {loading !== true && (
                  <label htmlFor="images" className={styles.user_choose_photo}>
                    <div className={styles.choose_photo}>Chọn ảnh</div>
                  </label>
                )}
              </div>
              <Input
                type="file"
                name=""
                id="images"
                style={{ display: "none" }}
                onChange={() => loadFile(event)}
              />
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default Account;
