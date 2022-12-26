import React, { useEffect, useState } from "react";
import { Avatar, Drawer, Layout, Menu, Spin } from "antd";
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
  QuestionCircleOutlined,
  MenuUnfoldOutlined,
  CloseOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { NavLink, Outlet } from "react-router-dom";
import styles from "../css/LayoutAdmin.module.css";
import "../css/Order.css";
import { useSelector, useDispatch } from "react-redux";
import { getAllTable } from "../features/TableSlice/TableSlice";
import { getUser } from "../features/User/UserSlice";
import { uploadLogin } from "../API/Users";
import { Size } from "./../components/size";
const { Header, Content, Footer, Sider } = Layout;

const LayoutAdmin = () => {
  const sizes = Size();
  const dispatch = useDispatch();
  const user = useSelector((data) => data.user.value);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const onClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    dispatch(getUser());
  }, []);
  const tables = useSelector((data) => data.table);
  useEffect(() => {
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
      window.location.href = "/";
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
          {sizes.width > 1024 && (
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
                {String(user.nameRestaurant).length <= 0 &&
                (String(user.avatarRestaurant).length <= 0 ||
                  user.avatarRestaurant == null) ? (
                  <span
                    style={{ padding: 10, color: "red", fontWeight: "500" }}
                  >
                    Hãy cài đặt tên Website của bạn
                  </span>
                ) : (
                  <React.Fragment>
                    {String(user.avatarRestaurant).length <= 0 ||
                    user.avatarRestaurant == null ? (
                      <QuestionCircleOutlined
                        style={{ fontSize: 35, padding: 20, color: "red" }}
                      />
                    ) : (
                      <Avatar
                        src={user.avatarRestaurant}
                        style={{ margin: "10px" }}
                        size={60}
                        alt=""
                      />
                    )}
                    {String(user.nameRestaurant).length <= 0 ||
                    user.nameRestaurant == null ? (
                      <span
                        style={{
                          color: "red",
                          fontSize: 16,
                          fontWeight: "500",
                        }}
                      >
                        Chưa có tên ?
                      </span>
                    ) : (
                      <span className={styles.title_logo}>
                        {user.nameRestaurant}
                      </span>
                    )}
                  </React.Fragment>
                )}
              </div>
              <br />

              <Menu
                theme="dark"
                mode="inline"
                className={styles.menu}
                defaultSelectedKeys={
                  key == null ? [tables?.value?.length > 0 ? "1" : "1"] : key
                }
                items={[
                  {
                    key: "1",
                    icon: <BarChartOutlined />,
                    label: "Thông kê",
                    itemIcon: <NavLink to="statistical" />,
                    style: { color: "black" },
                    onClick: () => {
                      localStorage.removeItem("key");
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
                      localStorage.removeItem("key");
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
                      localStorage.removeItem("key");
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
                      localStorage.removeItem("key");
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
                      localStorage.removeItem("key");
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
                      localStorage.removeItem("key");
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
                      localStorage.removeItem("key");
                      localStorage.setItem("key", JSON.stringify(["7"]));
                    },
                  },
                  (tables?.value?.length <= 0 && tables?.checkData == false) ||
                  (tables.value.length <= 0 && tables.checkData == true)
                    ? null
                    : {
                        key: "8",
                        icon: <RollbackOutlined />,
                        label: "Quay lại Order",
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
          )}
          <Layout
            className="site-layout"
            style={{
              overflow: "auto",
              height: "100vh",
              marginLeft: sizes.width > 1024 ? 200 : 0,
            }}
          >
            {sizes.width <= 1024 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "#0d6efd",
                  padding: "15px 10px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    color: "#fff",
                  }}
                >
                  {String(user.avatar).length > 0 || user.avatar !== null ? (
                    <Avatar src={user?.avatar} size={30} alt="" />
                  ) : (
                    <UserOutlined style={{ fontSize: 25, marginRight: 10 }} />
                  )}

                  <span style={{ fontSize: 18, fontWeight: "500" }}>
                    {user?.name}
                  </span>
                </div>
                <MenuUnfoldOutlined
                  style={{ fontSize: 25, cursor: "pointer", color: "#fff" }}
                  onClick={() => setOpen(true)}
                />
              </div>
            )}

            <Content style={{ margin: "5px 10px 0" }}>
              <div className="site-layout-background" style={{ padding: 24 }}>
                <Outlet />
              </div>
            </Content>
          </Layout>
        </React.Fragment>
      )}

      <Drawer
        title={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <CloseOutlined
              style={{ fontSize: 20, cursor: "pointer", color: "red" }}
              onClick={() => setOpen(false)}
            />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              {String(user.avatarRestaurant).length > 0 ||
              user.avatarRestaurant !== null ? (
                <Avatar src={user?.avatarRestaurant} size={30} alt="" />
              ) : (
                <UserOutlined style={{ fontSize: 25, marginRight: 10 }} />
              )}

              <span style={{ fontSize: 18, fontWeight: "500", marginLeft: 10 }}>
                {user?.nameRestaurant}
              </span>
            </div>
          </div>
        }
        placement="right"
        closable={false}
        onClose={onClose}
        open={open}
        width={sizes.width < 768 ? "100%" : "50%"}
      >
        <Menu
          theme="dark"
          mode="inline"
          className={styles.menu}
          defaultSelectedKeys={
            key == null ? [tables?.value?.length > 0 ? "1" : "1"] : key
          }
          items={[
            {
              key: "1",
              icon: <BarChartOutlined />,
              label: "Thông kê",
              itemIcon: <NavLink to="statistical" />,
              style: { color: "black" },
              onClick: () => {
                localStorage.removeItem("key");
                localStorage.setItem("key", JSON.stringify(["1"]));
                setOpen(false);
              },
            },
            {
              key: "2",
              icon: <BorderlessTableOutlined />,
              label: "Bàn",
              itemIcon: <NavLink to="table" />,
              style: { color: "black" },
              onClick: () => {
                localStorage.removeItem("key");
                localStorage.setItem("key", JSON.stringify(["2"]));
                setOpen(false);
              },
            },
            {
              key: "3",
              icon: <ProfileOutlined />,
              label: "Danh mục",
              itemIcon: <NavLink to="categoris" />,
              style: { color: "black" },
              onClick: () => {
                localStorage.removeItem("key");
                localStorage.setItem("key", JSON.stringify(["3"]));
                setOpen(false);
              },
            },
            {
              key: "4",
              icon: <ClusterOutlined />,
              label: "Sản phẩm",
              itemIcon: <NavLink to="products" />,
              style: { color: "black" },
              onClick: () => {
                localStorage.removeItem("key");
                localStorage.setItem("key", JSON.stringify(["4"]));
                setOpen(false);
              },
            },

            {
              key: "5",
              icon: <ShoppingCartOutlined />,
              label: "Đơn hàng",
              itemIcon: <NavLink to="order" />,
              style: { color: "black" },
              onClick: () => {
                localStorage.removeItem("key");
                localStorage.setItem("key", JSON.stringify(["5"]));
                setOpen(false);
              },
            },
            {
              key: "6",
              icon: <UserOutlined />,
              label: "Tài khoản",
              itemIcon: <NavLink to="account" />,
              style: { color: "black" },
              onClick: () => {
                localStorage.removeItem("key");
                localStorage.setItem("key", JSON.stringify(["6"]));
                setOpen(false);
              },
            },
            {
              key: "7",
              icon: <SettingOutlined />,
              label: "Cài đặt",
              itemIcon: <NavLink to="setting" />,
              style: { color: "black" },
              onClick: () => {
                localStorage.removeItem("key");
                localStorage.setItem("key", JSON.stringify(["7"]));
                setOpen(false);
              },
            },
            (tables?.value?.length <= 0 && tables?.checkData == false) ||
            (tables.value.length <= 0 && tables.checkData == true)
              ? null
              : {
                  key: "8",
                  icon: <RollbackOutlined />,
                  label: "Quay lại Order",
                  itemIcon: <NavLink to="/tables" />,
                  style: { color: "black" },
                  onClick: () => {
                    localStorage.removeItem("key");
                    setOpen(false);
                  },
                },
            {
              key: "9",
              icon: <LogoutOutlined />,
              label: "Đăng xuất",
              style: { color: "black" },
              onClick: () => {
                localStorage.removeItem("key");
                localStorage.setItem("key", JSON.stringify(["11"]));
                if (confirm("Bạn có muốn đăng xuất không ?")) {
                  localStorage.removeItem("user");
                  localStorage.removeItem("token");
                  localStorage.removeItem("key");
                  window.location.href = "/";
                }
              },
            },
          ]}
        />
      </Drawer>
    </Layout>
  );
};

export default LayoutAdmin;
