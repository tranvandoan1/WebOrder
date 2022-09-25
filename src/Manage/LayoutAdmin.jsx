import React, { useEffect, useState } from "react";
import { Avatar, Layout, Menu, message, Spin } from "antd";
import {
  ShoppingCartOutlined,
  ProfileOutlined,
  UserOutlined,
  ClusterOutlined,
  RollbackOutlined,
  BorderlessTableOutlined,
  BarChartOutlined,
  SettingOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import { NavLink, Outlet } from "react-router-dom";
import styles from "../css/LayoutAdmin.module.css";
import "../css/Order.css";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getProductAll } from "./../features/ProductsSlice/ProductSlice";
import { getAllTable } from "../features/TableSlice/TableSlice";
import { getCategori } from "./../features/Categoris/CategoriSlice";
import { getUser } from "../features/User/UserSlice";
import { uploadLogin } from "../API/Users";
const { Header, Content, Footer, Sider } = Layout;

const LayoutAdmin = () => {
  const dispatch = useDispatch();
  const user = useSelector((data) => data.user.value);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    dispatch(getUser());
  }, []);
  const products = useSelector((data) => data.product.value);
  const tables = useSelector((data) => data.table.value);
  const categoris = useSelector((data) => data.categori.value);
  useEffect(() => {
    dispatch(getProductAll());
    dispatch(getCategori());
    dispatch(getAllTable());
  }, []);
  const key = JSON.parse(localStorage.getItem("key"));
  const signOut = async () => {
    if (confirm("Bạn có muốn đăng xuất không !")) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setLoading(true);
      if (user?.loginWeb == 0) {
        await uploadLogin({ id: user?._id });
      }
      window.location.href = "/signin";
      setLoading(false);
    }
  };
  return (
    <Layout hasSider>
      {loading == true ? (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,.1)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            opacity: 0.5,
          }}
        >
          <Spin size="large" />
        </div>
      ) : (
        <React.Fragment>
          <Sider
            style={{
              overflow: "auto",
              height: "100vh",
              position: "fixed",
              left: 0,
              top: 0,
              bottom: 0,
            }}
          >
            <div className={styles.avatar_header}>
              <Avatar
                src={user.avatarRestaurant}
                style={{ margin: "10px" }}
                size={60}
                alt=""
              />
              <span className={styles.title_logo}>{user.nameRestaurant}</span>
            </div>
            <br />

            <Menu
              theme="dark"
              mode="inline"
              className={styles.menu}
              defaultSelectedKeys={
                key == null
                  ? [
                      user?.loginWeb == 0 ||
                      products?.length > 0 ||
                      categoris?.length > 0 ||
                      tables?.length > 0
                        ? "1"
                        : "1",
                    ]
                  : key
              }
              items={[
                (products?.length > 0 ||
                  categoris?.length > 0 ||
                  tables?.length > 0) && {
                  key: "1",
                  icon: <BarChartOutlined />,
                  label: "Thông kê",
                  itemIcon: <NavLink to="statistical" />,
                  style: { color: "black" },
                  onClick: () => {
                    localStorage.setItem("key", JSON.stringify(["1"]));
                  },
                },
                {
                  key: "2",
                  icon: <BorderlessTableOutlined />,
                  label: "Bàn",
                  itemIcon: <NavLink to="table" />,
                  style: { color: "black" },
                  onClick: () => {
                    localStorage.setItem("key", JSON.stringify(["2"]));
                  },
                },
                {
                  key: "3",
                  icon: <ProfileOutlined />,
                  label: "Danh mục",
                  itemIcon: <NavLink to="categoris" />,
                  style: { color: "black" },
                  onClick: () => {
                    localStorage.setItem("key", JSON.stringify(["3"]));
                  },
                },
                {
                  key: "4",
                  icon: <ClusterOutlined />,
                  label: "Sản phẩm",
                  itemIcon: <NavLink to="products" />,
                  style: { color: "black" },
                  onClick: () => {
                    localStorage.setItem("key", JSON.stringify(["4"]));
                  },
                },

                {
                  key: "5",
                  icon: <ShoppingCartOutlined />,
                  label: "Đơn hàng",
                  itemIcon: <NavLink to="order" />,
                  style: { color: "black" },
                  onClick: () => {
                    localStorage.setItem("key", JSON.stringify(["5"]));
                  },
                },
                {
                  key: "6",
                  icon: <UserOutlined />,
                  label: "Tài khoản",
                  itemIcon: <NavLink to="account" />,
                  style: { color: "black" },
                  onClick: () => {
                    localStorage.setItem("key", JSON.stringify(["6"]));
                  },
                },
                {
                  key: "7",
                  icon: <SettingOutlined />,
                  label: "Cài đặt",
                  itemIcon: <NavLink to="setting" />,
                  style: { color: "black" },
                  onClick: () => {
                    localStorage.setItem("key", JSON.stringify(["7"]));
                  },
                },

                (tables?.length > 0 ||
                  products?.length > 0 ||
                  categoris?.length > 0) && {
                  key: "8",
                  icon: <RollbackOutlined />,
                  label: "Quay lại",
                  itemIcon: <NavLink to="/tables" />,
                  style: { color: "black" },
                  onClick: () => {
                    localStorage.removeItem("key");
                  },
                },
              ]}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                marginLeft: 25,
                marginTop: 10,
              }}
              onClick={() => signOut()}
            >
              <LoginOutlined />
              <span style={{ textAlign: "center", marginLeft: 10 }}>
                Đăng xuất
              </span>
            </div>
          </Sider>
          <Layout
            className="site-layout"
            style={{
              overflow: "auto",
              height: "100vh",
              marginLeft: 200,
            }}
          >
            <Content style={{ margin: "5px 10px 0" }}>
              <div className="site-layout-background" style={{ padding: 24 }}>
                <Outlet />
              </div>
            </Content>
          </Layout>
        </React.Fragment>
      )}
    </Layout>
  );
};

export default LayoutAdmin;
