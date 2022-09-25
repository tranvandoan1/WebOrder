import { EditOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Col, Form, Input, message, Row, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { upload } from "../API/Users";
import styles from "../css/Account.module.css";
import { openNotificationWithIcon } from "../Notification";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { editUser, getUser } from "../features/User/UserSlice";

const Setting = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState();
  const user = useSelector((data) => data.user.value);
  useEffect(() => {
    dispatch(getUser());
  }, []);
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
      _id: user._id,
      nameRestaurant:
        values.nameRestaurant == undefined
          ? user?.nameRestaurant
          : values.nameRestaurant,
      avatarRestaurant: photo == undefined ? user?.avatarRestaurant : photo,
    };
    setLoading(true);
    message.warning("Đang tiến hành sửa !");
    await dispatch(editUser(uploadUser))
    setPhoto();
    setLoading(false);
    message.success("Sửa thành công");
  };
  
  return (
    <div>
      {Object.keys(user).length>0 && (
        <>
          <div className={styles.header}>
            <h5>Cài đặt</h5>
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
                  label="Tên quán"
                  name="nameRestaurant"
                  style={{ marginTop: 30, fontWeight: "500" }}
                >
                  <Input
                    className={styles.input}
                    placeholder="Basic usage"
                    defaultValue={user?.nameRestaurant}
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
                {String(user.avatarRestaurant).length <= 0 ? (
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
                  <Avatar size={200} src={user.avatarRestaurant} />
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

export default Setting;
