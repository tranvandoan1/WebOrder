import { CloseCircleOutlined, UserOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Col,
  Form,
  Input,
  message,
  Row,
  Spin,
  Upload,
} from "antd";
import React, { useEffect, useState } from "react";
import styles from "../../css/Account.module.css";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../firebase";
import { editInfoUser, getUser } from "../../features/User/UserSlice";
import { useDispatch, useSelector } from "react-redux";
import { validateEmail, validatePhone } from "../../components/Validate";

const Account = () => {
  const dispatch = useDispatch();
  const user = useSelector((data) => data.user.value);
  useEffect(() => {
    dispatch(getUser());
  }, []);
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState();

  const UploadAvatatr = (event) => {
    setLoading(false);
    const src = URL.createObjectURL(event);
    setPhoto({ url: src, file: event });
    setLoading(false);
  };
  const onFinish = async (values) => {
   if(values.phone==undefined&&values.email==undefined&&values.name==undefined&&photo==undefined){
    message.warning('Chưa có thay đổi !')
   }else{
    message.warning("Đang tiến hành sửa !");
    const componentSetting = async (image) => {
      const uploadUser = {
        name: values.name == undefined ? user.name : values.name,
        email: values.email == undefined ? user.email : values.email,
        phone: values.phone == undefined ? user.phone : values.phone,
        avatar: image !== undefined ? image : user.avatar,
        _id: user._id,
      };
      setLoading(true);
      await dispatch(editInfoUser(uploadUser));

      setPhoto();
      setLoading(false);
      message.success("Sửa thành công");
    };
    if (
      validatePhone(
        `0${values.phone == undefined ? user.phone : values.phone}`
      ) == false
    ) {
      message.error("Số điện thoại chưa đúng !");
    } else if (
      validateEmail(values.email == undefined ? user.email : values.email) ==
      false
    ) {
      message.error("Email chưa đúng !");
    } else {
      if (photo == undefined) {
        componentSetting();
      } else {
        const imageRef = ref(storage, `images/${photo.file.name}`);
        setLoading(true);
        uploadBytes(imageRef, photo.file).then(() => {
          getDownloadURL(imageRef).then(async (url) => {
            componentSetting(url);
          });
        });
      }
    }
   }
  };
  const removeImage = async () => {
    const uploadUser = {
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: "",
      _id: user._id,
    };
    setLoading(true);
    message.warning("Đang tiến hành xóa !");
    await dispatch(editInfoUser(uploadUser));
    setPhoto();
    setLoading(false);
    message.success("Xóa thành công");
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
                flexDirection: "column",
              }}
            >
              <div
                className="avatar-border"
                style={{
                  position: "relative",
                  width: 120,
                  height: 120,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid #CCCCCC",
                  borderRadius: "100%",
                }}
              >
                {photo !== undefined && (
                  <CloseCircleOutlined
                    onClick={() => setPhoto()}
                    style={{
                      fontSize: 20,
                      color: "red",
                      position: "absolute",
                      top: -10,
                      right: -10,
                    }}
                  />
                )}

                <div
                  style={{
                    position: "relative",
                    width: 120,
                    height: 120,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid #CCCCCC",
                    borderRadius: "100%",
                    overflow: "hidden",
                  }}
                >
                  <div
                    className="text-upload"
                    style={{
                      position: "absolute",
                      bottom: 0,
                      width: "100%",
                      background: "#888888",
                      textAlign: "center",
                      color: "#fff",
                      fontSize: 14,
                      display: "none",
                      transition: "1s ",
                      zIndex: 10,
                    }}
                  >
                    Sửa
                  </div>
                  <Upload
                    // listType="picture-card"
                    showUploadList={false}
                    beforeUpload={UploadAvatatr}
                  >
                    {loading == true ? (
                      <Spin size="large" />
                    ) : (
                      <div>
                        {photo == undefined ? (
                          String(user.avatar).length <= 0 ||
                          user.avatar == null ? (
                            <div>
                              <UserOutlined
                                style={{ fontSize: 35, padding: 20 }}
                              />
                            </div>
                          ) : (
                            <Avatar
                              className="show-user_avatar"
                              src={user.avatar}
                            />
                          )
                        ) : (
                          <Avatar
                            className="show-avatar_upload"
                            src={photo.url}
                          />
                        )}
                      </div>
                    )}
                  </Upload>
                </div>
              </div>
              {loading !== true && (
                <div>
                  {String(user.avatar).length <= 0 ||
                  user.avatar == null ? null : (
                    <label
                      className={styles.user_choose_photo}
                      onClick={() => removeImage()}
                      style={{
                        background: "red",
                        color: "#fff",
                        border: 0,
                        cursor: "pointer",
                      }}
                    >
                      <div className={styles.choose_photo}>Xóa ảnh</div>
                    </label>
                  )}
                </div>
              )}
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default Account;
