import {
  CloseCircleOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Col,
  Form,
  Input,
  message,
  Radio,
  Row,
  Spin,
  Upload,
} from "antd";
import React, { useEffect, useState } from "react";
import styles from "../css/Account.module.css";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase";
import { useSelector, useDispatch } from "react-redux";
import { editInfoUser, getUser } from "../features/User/UserSlice";

const Setting = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState();
  const user = useSelector((data) => data.user.value);
  useEffect(() => {
    dispatch(getUser());
  }, []);
  const UploadAvatatr = (event) => {
    setLoading(false);
    const src = URL.createObjectURL(event);
    setPhoto({ url: src, file: event });
    setLoading(false);
  };
  const onFinish = async (values) => {

    const componentSetting = async (image) => {
      const uploadUser = {
        _id: user._id,
        nameRestaurant:
          values.nameRestaurant == undefined
            ? user?.nameRestaurant
            : values.nameRestaurant,
        avatarRestaurant: image == undefined ? user?.avatarRestaurant : image,
      };
      setLoading(true);
      message.warning("Đang tiến hành sửa !");
      await dispatch(editInfoUser(uploadUser));
      setPhoto();
      setLoading(false);
      message.success("Sửa thành công");
    };
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
  };
  const removeImage = async () => {
    const uploadUser = {
      _id: user._id,
      nameRestaurant: user?.nameRestaurant,
      avatarRestaurant: "",
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
                <Form
                  name="basic"
                  labelCol={{
                    span: 6,
                  }}
                  wrapperCol={{
                    span: 18,
                  }}
                  onFinish={onFinish}
                  disabled={true}
                >
                  <Form.Item
                    label="Ngon ngữ"
                    name="language"
                    style={{ fontWeight: "500" }}
                  >
                    <Radio.Group>
                      <Radio value="vn">Việt Nam</Radio>
                      <Radio value="es">Tiếng Anh</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Form>
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
                        style={{
                          background: "blue",
                          color: "#fff",
                          padding: "2px 15px",
                        }}
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
                          String(user.avatarRestaurant).length <= 0 ||
                          user.avatarRestaurant == null ? (
                            <div>
                              <HomeOutlined
                                style={{ fontSize: 35, padding: 20 }}
                              />
                            </div>
                          ) : (
                            <Avatar
                              className="show-user_avatar"
                              src={user.avatarRestaurant}
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
                  {String(user.avatarRestaurant).length <= 0 ||
                  user.avatarRestaurant == null ? null : (
                    <label
                      className={styles.user_choose_photo}
                      onClick={() => removeImage()}
                      style={{
                        background: "red",
                        color: "#fff",
                        border: 0,
                        cursor: "pointer",
                        borderRadius: 4,
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

export default Setting;
