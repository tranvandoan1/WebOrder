import React, { useEffect, useState } from "react";
import "../src/css/Home.css";
import { Avatar, Button, Form, Input, message, Spin } from "antd";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  UserOutlined,
} from "@ant-design/icons";
import styles from "./css/Account.module.css";
import { useDispatch, useSelector } from "react-redux";
import { editUser, getUser } from "./features/User/UserSlice";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "./firebase";
import { getAll } from "./features/AllDataSlice/AllDataSlice";
import { getProductAll } from "./features/ProductsSlice/ProductSlice";
import { getAllTable } from "./features/TableSlice/TableSlice";
import { getCategori } from "./features/Categoris/CategoriSlice";
const Introduce = () => {
  const [check, setCheck] = useState(0);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState();
  const [value, setValue] = useState();
  const [validate, setValidate] = useState();
  const products = useSelector((data) => data.product.value);
  const categoris = useSelector((data) => data.categori.value);
  const tables = useSelector((data) => data.table.value);

  const user = useSelector((data) => data.user.value);
  useEffect(() => {
    dispatch(getUser());
    dispatch(getProductAll());
    dispatch(getAllTable());
    dispatch(getCategori());
  }, []);
  const checkIntro = async (values) => {
    const intro1 = document.getElementById("intro1");
    const intro2 = document.getElementById("intro2");
    const intro3 = document.getElementById("intro3");
    const intro4 = document.getElementById("intro4");

    if (
      check == 0 ||
      check == 1 ||
      (String(user.nameRestaurant).length <= 0 &&
        String(user.avatarRestaurant).length <= 0 &&
        check == 2)
    ) {
      (check == 0
        ? intro1
        : check == 1
        ? intro2
        : check == 2
        ? intro3
        : String(user.nameRestaurant).length <= 0 &&
          String(user.avatarRestaurant).length <= 0
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
    } else if (
      String(user.nameRestaurant).length > 0 &&
      String(user.avatarRestaurant).length > 0 &&
      tables.length > 0
    ) {
      localStorage.setItem("key", JSON.stringify(["2"]));
      alert("Chào mừng bạn đến mới Website Order !");
      setPhoto();
      setValue();
      window.location.href = "/tables";
    } else if (
      String(user.nameRestaurant).length > 0 &&
      String(user.avatarRestaurant).length > 0 &&
      tables.length <= 0
    ) {
      alert("Hãy thiết lập thêm để bắt đầu nhé !");
      setPhoto();
      setValue();
      window.location.href = "/manager/table";
    } else {
      if (photo == undefined || String(photo).length <= 0) {
        message.error("Bạn chưa chọn ảnh !");
      } else if (value == undefined || String(value).length <= 0) {
        setValidate(false);
        message.error("Bạn chưa chọn tên !");
      } else {
        const uploadUser = {
          _id: user._id,
          nameRestaurant: value == undefined ? user : value,
          avatarRestaurant:
            photo == undefined
              ? "https://png.pngtree.com/png-vector/20190805/ourlarge/pngtree-account-avatar-user-abstract-circle-background-flat-color-icon-png-image_1650938.jpg"
              : photo,
        };
        setLoading(true);
        await dispatch(editUser(uploadUser));
        alert("Hãy thiết lập thêm để bắt đầu nhé !");
        setPhoto();
        setValue();
        setLoading(false);
        window.location.href = "/manager/table";
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
  return (
    <div className="intro_main">
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
        <div style={{ width: 500, color: "black" }} id="intro_hello">
          <h2>Xin chào! </h2>
          <span style={{ fontSize: 18 }} className="content">
            Chào mừng bạn đến với Website Order, đội ngũ xây dựng website mong
            muốn mang đến cho khách hàng trải nghiệm tích tực, thuận tiện cho
            việc gọi món ăn, kiểm soát được được thực đơn của nhà hàng, quán ăn
            ... hiểu quả trong làm việc.
          </span>
        </div>

        <Button
          onClick={() => checkIntro()}
          style={{
            background: "red",
            marginTop: 30,
            color: "#fff",
            fontSize: 18,
            fontWeight: "500",
            height: 50,
            display: "flex",
            alignItems: "center",
            borderRadius: 3,
          }}
        >
          <span>Tiếp theo</span> <ArrowRightOutlined />
        </Button>
      </div>
      <div className="intro2 active_none" id="intro2">
        <div
          alt=""
          style={{ borderRadius: 10, width: 400, height: 300 }}
          className="image-intro2"
        />
        <div
          style={{ width: 500, color: "black", margin: "40px 0" }}
          className="intro-hello"
          id="intro_hello"
        >
          <h2>Gọi món :</h2>

          <span style={{ fontSize: 18 }} className="content">
            Với các tính năng như : order món ăn cho tầng bàn, đặt bàn, hủy bàn
            ... đang chờ bạn khám phá
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <Button
            onClick={() => checkIntroOut()}
            style={{
              marginTop: 30,
              color: "blue",
              fontSize: 18,
              fontWeight: "500",
              height: 50,
              display: "flex",
              alignItems: "center",
              borderRadius: 3,
              marginRight: 10,
            }}
          >
            <ArrowLeftOutlined />
            <span>Quay lại</span>
          </Button>
          <Button
            onClick={() => checkIntro()}
            style={{
              background: "red",
              marginTop: 30,
              color: "#fff",
              fontSize: 18,
              fontWeight: "500",
              height: 50,
              display: "flex",
              alignItems: "center",
              borderRadius: 3,
            }}
          >
            <span>Tiếp theo</span> <ArrowRightOutlined />
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
          style={{ width: 500, color: "black" }}
          className="intro-hello"
          id="intro_hello"
        >
          <h2>Quản lý :</h2>

          <span style={{ fontSize: 18 }} className="content">
            Bạn có thể quản lý sản phẩm, danh mục, bàn , xem doanh số ...
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <Button
            onClick={() => checkIntroOut()}
            style={{
              marginTop: 30,
              color: "blue",
              fontSize: 18,
              fontWeight: "500",
              height: 50,
              display: "flex",
              alignItems: "center",
              borderRadius: 3,
              marginRight: 10,
            }}
          >
            <ArrowLeftOutlined />
            <span>Quay lại</span>
          </Button>
          <Button
            onClick={() => checkIntro()}
            style={{
              background: "red",
              marginTop: 30,
              color: "#fff",
              fontSize: 18,
              fontWeight: "500",
              height: 50,
              display: "flex",
              alignItems: "center",
              borderRadius: 3,
            }}
          >
            <span>Tiếp theo</span> <ArrowRightOutlined />
          </Button>
        </div>
      </div>
      <div className="intro4 active_none" id="intro4">
        <div
          style={{ width: 500, color: "black" }}
          className="intro-hello"
          id="intro_hello"
        >
          <div>
            {photo !== undefined ? (
              <label
                htmlFor="images"
                style={{ border: 0 }}
                className={styles.user_choose_photo}
              >
                <Avatar size={200} src={photo} />
              </label>
            ) : loading == true ? (
              <Spin size="large" />
            ) : (
              <label
                htmlFor="images"
                style={{
                  position: "relative",
                  overflow: "hidden",
                  textAlign: "center",
                  borderRadius: "100%",
                }}
                className={styles.user_choose_photo}
              >
                <Avatar
                  size={200}
                  src="https://png.pngtree.com/png-vector/20190805/ourlarge/pngtree-account-avatar-user-abstract-circle-background-flat-color-icon-png-image_1650938.jpg"
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    left: 0,
                    background: "rgba(0,0,0,0.5)",
                    fontSize: 16,
                    color: "#fff",
                  }}
                >
                  Chọn
                </div>
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
          <h4 style={{ marginTop: 30 }}>
            Hãy đặt cho quán (shop) của bạn 1 cái tên ý nghĩa nhé !
          </h4>
          <Input
            placeholder="Tên...."
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
                  fontSize: 18,
                  fontWeight: "500",
                  height: 50,
                  display: "flex",
                  alignItems: "center",
                  borderRadius: 3,
                  marginRight: 10,
                }}
              >
                <ArrowLeftOutlined />
                <span>Quay lại</span>
              </Button>
              <Button
                onClick={() => checkIntro()}
                style={{
                  background: "red",
                  marginTop: 30,
                  color: "#fff",
                  fontSize: 18,
                  fontWeight: "500",
                  height: 50,
                  display: "flex",
                  alignItems: "center",
                  borderRadius: 3,
                }}
              >
                <span>Tiếp theo</span> <ArrowRightOutlined />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Introduce;
