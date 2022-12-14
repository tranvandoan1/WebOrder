import React, { useEffect, useState } from "react";
import "../../src/css/Home.css";
import { Avatar, Button, Input, message, Spin, Upload } from "antd";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import styles from "../css/Account.module.css";
import { useDispatch, useSelector } from "react-redux";
import { editLogin, editInfoUser, getUser } from "../features/User/UserSlice";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase";
import { getAllTable } from "../features/TableSlice/TableSlice";
import { Size } from "./size";
const Introduce = () => {
  const sizes = Size();
  const [check, setCheck] = useState(0);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState();
  const [value, setValue] = useState();
  const [validate, setValidate] = useState();
  const userLoca = JSON.parse(localStorage.getItem("user"));

  const user = useSelector((data) => data.user.value);
  useEffect(() => {
    dispatch(getUser());
    dispatch(getAllTable());
  }, []);
  const intro1 = document.getElementById("intro1");
  const intro2 = document.getElementById("intro2");
  const intro3 = document.getElementById("intro3");
  const intro4 = document.getElementById("intro4");
  const checkIntro = async (values) => {
    if (
      check == 0 ||
      check == 1 ||
      (String(user.nameRestaurant).length <= 0 &&
        (String(user.avatarRestaurant).length <= 0 ||
          user.avatarRestaurant == null) &&
        check == 2)
    ) {
      (check == 0
        ? intro1
        : check == 1
        ? intro2
        : check == 2
        ? intro3
        : String(user.nameRestaurant).length <= 0 &&
          (String(user.avatarRestaurant).length <= 0 ||
            user.avatarRestaurant == null)
        ? intro4
        : ""
      ).classList.remove(
        check == 0
          ? "intro-active1"
          : check == 1
          ? "intro-active2"
          : check == 2
          ? "intro-active3"
          : "intro-active4"
      );

      let timerId = setInterval(() => {
        (check == 0
          ? intro1
          : check == 1
          ? intro2
          : check == 2 && intro3
        ).classList.add("active_none");
      }, 1000);

      setTimeout(() => {
        clearInterval(timerId);
      }, 1000);
      setCheck(check == 0 ? 1 : check == 1 ? 2 : check == 2 && 3);
      (check == 0
        ? intro2
        : check == 1
        ? intro3
        : check == 2 && intro4
      ).classList.remove("active_none");
      let timerId1 = setInterval(() => {
        (check == 0
          ? intro2
          : check == 1
          ? intro3
          : check == 2 && intro4
        ).classList.add(
          check == 0
            ? "intro-active2"
            : check == 1
            ? "intro-active3"
            : check == 2 && "intro-active4"
        );
      }, 1000);

      setTimeout(() => {
        clearInterval(timerId1);
      }, 1000);
    } else {
      if (photo == undefined || String(photo).length <= 0) {
        message.error("B???n ch??a ch???n ???nh !");
      } else if (value == undefined || String(value).length <= 0) {
        setValidate(false);
        message.error("B???n ch??a ch???n t??n !");
      } else {
        const imageRef = ref(storage, `images/${photo.file.name}`);
        setLoading(true);
        uploadBytes(imageRef, photo.file).then(() => {
          getDownloadURL(imageRef).then(async (url) => {
            const uploadUser = {
              _id: user._id,
              nameRestaurant: value == undefined ? user : value,
              avatarRestaurant: url,
            };
            setLoading(true);
            await dispatch(editInfoUser(uploadUser));
            alert("H??y thi???t l???p th??m ????? b???t ?????u nh?? !");
            setPhoto();
            setValue();
            setLoading(false);
            window.location.href = "/";
          });
        });
      }
    }
  };
  const checkIntroOut = async () => {
    const intro1 = document.getElementById("intro1");
    const intro2 = document.getElementById("intro2");
    const intro3 = document.getElementById("intro3");
    const intro4 = document.getElementById("intro4");

    (check == 1
      ? intro2
      : check == 2
      ? intro3
      : check == 3 && intro4
    ).classList.remove(
      check == 1
        ? "intro-active2"
        : check == 2
        ? "intro-active3"
        : check == 3 && "intro-active4"
    );
    let timerId = setInterval(() => {
      (check == 1
        ? intro2
        : check == 2
        ? intro3
        : check == 3 && intro4
      ).classList.add("active_none");
    }, 1000);

    setTimeout(() => {
      clearInterval(timerId);
    }, 1000);
    setCheck(check == 1 ? 0 : check == 2 ? 1 : check == 3 && 2);

    (check == 1
      ? intro1
      : check == 2
      ? intro2
      : check == 3 && intro3
    ).classList.remove("active_none");
    let timerId1 = setInterval(() => {
      (check == 1
        ? intro1
        : check == 2
        ? intro2
        : check == 3 && intro3
      ).classList.add(
        check == 1
          ? "intro-active1"
          : check == 2
          ? "intro-active2"
          : check == 3 && "intro-active3"
      );
    }, 1000);

    setTimeout(() => {
      clearInterval(timerId1);
    }, 1000);
  };
  useEffect(() => {
    setCheck(check);
    const intro1 = document.getElementById("intro1");
    let timerId = setInterval(() => {
      intro1.classList.add("intro-active1");
    }, 1000);

    setTimeout(() => {
      clearInterval(timerId);
    }, 1000);
  }, []);

  const loadFile = (event) => {
    setLoading(false);
    const src = URL.createObjectURL(event);
    setPhoto({ url: src, file: event });
    setLoading(false);
  };

  const skip = async () => {
    alert("H??y thi???t l???p th??m ????? b???t ?????u nh?? !");
    setPhoto();
    setValue();
    await dispatch(editLogin({ id: userLoca._id }));
    localStorage.setItem("key", JSON.stringify(["2"]));
    window.location.href = "/";
  };

  return (
    <div className="intro_main">
      <div
        style={{
          position: "fixed",
          top: 30,
          right: 30,
          zIndex: 100,
          cursor: "pointer",
        }}
      >
        <span
          onClick={() => skip()}
          style={{
            background: "red",
            padding: "22px 10px",
            borderRadius: 1000,
            fontWeight: "500",
            color: "#fff",
          }}
        >
          B??? qua
        </span>
        <span
          onClick={() => {
            if (confirm("B???n c?? mu???n ????ng xu???t kh??ng ?")) {
              localStorage.removeItem("user");
              localStorage.removeItem("token");
              localStorage.removeItem("key");
              window.location.href = "/";
            }
          }}
          style={{
            background: "blue",
            padding: "22px 10px",
            borderRadius: 1000,
            fontWeight: "500",
            color: "#fff",
            marginLeft: 10,
          }}
        >
          ????ng xu???t
        </span>
      </div>
      <div className="intro1" id="intro1">
        <img
          src={
            "https://firebasestorage.googleapis.com/v0/b/order-94f58.appspot.com/o/images%2F%C4%91%C3%A1dsa%C3%A2s.png?alt=media&token=2d5bb4f2-bae6-461f-aa1a-65582b25af0e"
          }
          alt=""
          style={{
            borderRadius: 1000,
            width: 400,
            height: 300,
            display: "none",
          }}
          className="image-intro"
        />
        <div
          style={{ width: sizes.width < 768 ? 300 : 500, color: "black" }}
          id="intro_hello"
        >
          <h2>Xin ch??o! </h2>
          <span style={{ fontSize: 18 }} className="content">
            Ch??o m???ng b???n ?????n v???i Website Order, ?????i ng?? x??y d???ng website mong
            mu???n mang ?????n cho kh??ch h??ng tr???i nghi???m t??ch t???c, thu???n ti???n cho
            vi???c g???i m??n ??n, ki???m so??t ???????c ???????c th???c ????n c???a nh?? h??ng, qu??n ??n
            ... hi???u qu??? trong l??m vi???c.
          </span>
        </div>

        <Button
          onClick={() => checkIntro()}
          style={{
            background: "red",
            marginTop: 30,
            color: "#fff",
            fontSize: 16,
            fontWeight: "500",
            height: 40,
            display: "flex",
            alignItems: "center",
            borderRadius: 3,
          }}
        >
          <span>Ti???p theo</span> <ArrowRightOutlined />
        </Button>
      </div>
      <div className="intro2 active_none" id="intro2">
        <div
          alt=""
          style={{ borderRadius: 10, width: 400, height: 300 }}
          className="image-intro2"
        />
        <div
          style={{
            width: sizes.width < 768 ? 300 : 500,
            color: "black",
            margin: "40px 0",
          }}
          className="intro-hello"
          id="intro_hello"
        >
          <h2>G???i m??n :</h2>

          <span style={{ fontSize: 18 }} className="content">
            V???i c??c t??nh n??ng nh?? : order m??n ??n cho t???ng b??n, ?????t b??n, h???y b??n
            ... ??ang ch??? b???n kh??m ph??
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <Button
            onClick={() => checkIntroOut()}
            style={{
              marginTop: 30,
              color: "blue",
              fontSize: 16,
              fontWeight: "500",
              height: 40,
              display: "flex",
              alignItems: "center",
              borderRadius: 3,
              marginRight: 10,
            }}
          >
            <ArrowLeftOutlined />
            <span>Quay l???i</span>
          </Button>
          <Button
            onClick={() => checkIntro()}
            style={{
              background: "red",
              marginTop: 30,
              color: "#fff",
              fontSize: 16,
              fontWeight: "500",
              height: 40,
              display: "flex",
              alignItems: "center",
              borderRadius: 3,
            }}
          >
            <span>Ti???p theo</span> <ArrowRightOutlined />
          </Button>
        </div>
      </div>
      <div className="intro3 active_none" id="intro3">
        <img
          src="https://mona.software/wp-content/uploads/2020/04/computer.png"
          alt=""
          style={{
            width: 400,
            height: 300,
            margin: "40px 0",
          }}
        />
        <div
          style={{ width: sizes.width < 768 ? 300 : 500, color: "black" }}
          className="intro-hello"
          id="intro_hello"
        >
          <h2>Qu???n l?? :</h2>

          <span style={{ fontSize: 18 }} className="content">
            B???n c?? th??? qu???n l?? s???n ph???m, danh m???c, b??n , xem doanh s??? ...
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <Button
            onClick={() => checkIntroOut()}
            style={{
              marginTop: 30,
              color: "blue",
              fontSize: 16,
              fontWeight: "500",
              height: 40,
              display: "flex",
              alignItems: "center",
              borderRadius: 3,
              marginRight: 10,
            }}
          >
            <ArrowLeftOutlined />
            <span>Quay l???i</span>
          </Button>
          <Button
            onClick={() => checkIntro()}
            style={{
              background: "red",
              marginTop: 30,
              color: "#fff",
              fontSize: 16,
              fontWeight: "500",
              height: 40,
              display: "flex",
              alignItems: "center",
              borderRadius: 3,
            }}
          >
            <span>Ti???p theo</span> <ArrowRightOutlined />
          </Button>
        </div>
      </div>
      <div className="intro4 active_none" id="intro4">
        <div
          style={{ width: sizes.width < 768 ? 300 : 500, color: "black" }}
          className="intro-hello"
          id="intro_hello"
        >
          <div style={{ position: "relative" }}>
            {loading == true ? (
              <Spin size="large" />
            ) : (
              <div
                style={{
                  position: "relative",
                  textAlign: "center",
                  cursor: "pointer",
                  width: 150,
                  height: 150,
                  borderRadius: "100%",
                  overflow: "hidden",
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  alignItems: "center",
                  boxShadow: "0 0 5px #CCCCCC",
                }}
                className="box-image"
              >
                <Upload
                  listType="picture-card"
                  showUploadList={false}
                  beforeUpload={loadFile}
                >
                  {photo ? (
                    <div className={styles.box_image}>
                      <img src={photo.url} className="image" />
                    </div>
                  ) : (
                    <div>
                      <div
                        style={{
                          marginTop: 5,
                          marginLeft: 7,
                        }}
                      >
                        {loading == true ? (
                          <Spin />
                        ) : (
                          <Avatar
                            size={150}
                            src="https://png.pngtree.com/png-vector/20190805/ourlarge/pngtree-account-avatar-user-abstract-circle-background-flat-color-icon-png-image_1650938.jpg"
                          />
                        )}
                      </div>
                    </div>
                  )}
                </Upload>
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    left: 0,
                    background: "rgba(0,0,0,0.5)",
                    fontSize: 20,
                    color: "#fff",
                  }}
                >
                  Ch???n
                </div>
              </div>
            )}
            {photo !== undefined && (
              <CloseCircleOutlined
                onClick={() => setPhoto()}
                style={{
                  fontSize: 20,
                  position: "absolute",
                  color: "red",
                  top: 0,
                  right: 0,
                  zIndex: 1000,
                }}
              />
            )}
          </div>
          <h4 style={{ marginTop: 30 }}>
            H??y ?????t cho qu??n (shop) c???a b???n 1 c??i t??n ?? ngh??a nh?? !
          </h4>
          <Input
            placeholder="T??n...."
            onChange={(e) => (
              setValue(e.target.value), validate == false && setValidate()
            )}
            defaultValue={user?.nameRestaurant}
            style={{
              width: 300,
              marginTop: 20,
              border: validate == false ? "1px solid red" : "",
            }}
          />

          {loading == true ? (
            <Spin size="large" style={{ marginTop: 30 }} />
          ) : (
            <div style={{ display: "flex", alignItems: "center" }}>
              <Button
                onClick={() => checkIntroOut()}
                style={{
                  marginTop: 30,
                  color: "blue",
                  fontSize: 16,
                  fontWeight: "500",
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  borderRadius: 3,
                  marginRight: 10,
                }}
              >
                <ArrowLeftOutlined />
                <span>Quay l???i</span>
              </Button>
              <Button
                onClick={() => checkIntro()}
                style={{
                  background: "red",
                  marginTop: 30,
                  color: "#fff",
                  fontSize: 16,
                  fontWeight: "500",
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  borderRadius: 3,
                }}
              >
                <span>Ti???p theo</span> <ArrowRightOutlined />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Introduce;
