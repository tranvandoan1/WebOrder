import React, { useEffect, useState } from "react";
import {
  Layout,
  Menu,
  Button,
  Avatar,
  Form,
  Input,
  TimePicker,
  Select,
  message,
  Spin,
  Drawer,
  Dropdown,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styles from "../css/Home.module.css";
import {
  SettingOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  CloseCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import ListTable from "./ListTable";
import {
  cancelTable,
  getAllTable,
  editBookTable,
} from "../features/TableSlice/TableSlice";
import { getAllSaveOrder } from "../features/saveorderSlice/saveOrderSlice";
import { Size } from "../size";
import { uploadLogin } from "../API/Users";
import { getUser } from "../features/User/UserSlice";
import { validatePhone } from "./../components/Validate";
const { Header, Content, Sider } = Layout;

const LayoutWeb = () => {
  const sizes = Size();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((data) => data.user.value);
  useEffect(() => {
    dispatch(getUser());
  }, []);
  const [checkBookTable, setCheckBookTable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusTable, setStatusTable] = useState();
  const [checkResponsive, setCheckResponsive] = useState(false);
  const [bookTable, setBookTable] = useState();
  const [showMenu, setShowMenu] = useState(false); //hiện menu khi bàn có khách hoặc bàn đặt
  const [moveTable, setMoveTable] = useState(false); //hiện chuyển bàn
  const tables = useSelector((data) => data.table);
  const saveorders = useSelector((data) => data.saveorder.value);
  const [form] = Form.useForm();
  useEffect(() => {
    dispatch(getAllTable());
    dispatch(getAllSaveOrder());
  }, []);

  let checkSaveOrder = [];
  tables?.value?.map((element) => {
    let arrFilter = saveorders?.filter((e) => {
      return e.id_table === element._id;
    });
    arrFilter.length <= 0 &&
      element.timeBookTable == "null" &&
      checkSaveOrder.push({
        _id: element._id,
        data: arrFilter,
        name: element.name,
        timeBookTable: element.timeBookTable,
        amount: element.amount,
        nameUser: element.nameUser,
      });
  });
  const signOut = async () => {
    if (confirm("Bạn có muốn đăng xuất không !")) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.href = "/";
      if (user?.loginWeb == 0) {
        await uploadLogin({ id: user?._id });
      }
    }
  };
  // đặt bàn
  const onFinish = async (values) => {
    if (validatePhone(values.phone) == false) {
      message.warning("Số điện thoại chưa đúng !");
    } else if (Number.isFinite(Number(values.amount)) == false) {
      message.warning("Số lượng phải là số !");
    } else if (isNaN(values.nameUser) == false) {
      message.warning("Tên khách phải là chữ !");
    } else {
      let time = new Date(values.timeBookTable._d);
      setLoading(true);
      await dispatch(
        editBookTable({
          id: values.id,
          nameUser: values.nameUser,
          timeBookTable: `${
            String(time.getHours()).length == 1
              ? `0${time.getHours()}`
              : `${time.getHours()}`
          }:${
            String(time.getMinutes()).length == 1
              ? `0${time.getMinutes()}`
              : `${time.getMinutes()}`
          }`,
          amount: values.amount,
          phone: values.phone,
        })
      );
      setLoading(false);
      form.resetFields();
      setCheckBookTable(false);
      message.success("Đặt bàn thành công");
    }
  };

  const menu = (
    <Menu className={styles.dropdown}>
      <Menu.Item key="2">
        <Link className={styles.link} to="/manager/account">
          <span style={{ fontWeight: "500", fontSize: 18 }}>{user?.name}</span>
        </Link>
      </Menu.Item>
      <Menu.Item
        key="userInfo"
        onClick={() => (
          navigate("/manager/statistical"),
          localStorage.setItem(
            "key",
            JSON.stringify([tables?.value.length <= 0 ? "2" : "1"])
          )
        )}
      >
        <Button type="text" icon={<SettingOutlined />}>
          Quản lý
        </Button>
      </Menu.Item>
      <Menu.Item key="1">
        <Button icon={<LogoutOutlined />} type="text" onClick={() => signOut()}>
          Đăng xuất
        </Button>
      </Menu.Item>
    </Menu>
  );

  // lọc trạng thái bàn
  const handleChange = (value) => {
    setStatusTable(value);
    setCheckResponsive(false);
  };
  const render = () => (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{ position: "relative" }}>
        <Select
          style={{
            width: 200,
            marginRight: 10,
          }}
          value={statusTable == undefined ? undefined : statusTable}
          placeholder="Lọc bàn"
          onChange={handleChange}
        >
          <Select.Option key={1} value="1">
            Có khách
          </Select.Option>
          <Select.Option key={2} value="2">
            Bàn đặt
          </Select.Option>
          <Select.Option key={3} value="3">
            Trống
          </Select.Option>
        </Select>
        {statusTable !== undefined && (
          <CloseCircleOutlined
            onClick={() => setStatusTable()}
            style={{
              position: "absolute",
              right: 20,
              bottom: 25,
              cursor: "pointer",
              color: "red",
            }}
          />
        )}
      </div>

      <div
        className={styles.not}
        style={{ fontSize: 16, marginRight: 15, fontWeight: "500" }}
      >
        <div
          style={{
            backgroundColor: "#FF7F00",
            width: 17,
            height: 17,
            borderRadius: 100,
            marginRight: 5,
          }}
        ></div>
        Đặt bàn
      </div>
      <div
        className={styles.not}
        style={{ fontSize: 16, marginRight: 15, fontWeight: "500" }}
      >
        <div
          style={{
            backgroundColor: "yellowgreen",
            width: 17,
            height: 17,
            borderRadius: 100,
            marginRight: 5,
          }}
        ></div>
        Đang có khách
      </div>
      <Button
        onClick={() => setCheckBookTable(true)}
        style={{
          backgroundColor: "red",
          border: 0,
          marginRight: 10,
          borderRadius: 5,
        }}
        type="primary"
      >
        Đặt bàn
      </Button>
      <Dropdown overlay={menu} arrow>
        <Avatar size={44} src={user?.avatar} style={{ cursor: "pointer" }} />
      </Dropdown>
    </div>
  );
  // hủy bàn
  const onclickCancelTable = async () => {
    if (confirm("Bạn có muốn hủy bàn này không ?")) {
      message.warning("Đang tiến hàng chuyển bàn, xin chờ đợi !");

      await dispatch(cancelTable({ id: bookTable._id }));
      setShowMenu(false); //hiện menu chuyển bàn, xóa bàn, order
      setMoveTable(false);
      setBookTable(); //bàn chọn
      message.success("Chuyển bàn thành công");
    }
  };
  return (
    <div
      style={{
        backgroundColor: "rgb(243, 243, 243)",
        position: "relative",
      }}
      className="layout-body"
    >
      <Layout>
        <Layout className="site-layout">
          <Header className={styles.header}>
            <div
              style={{
                padding: "10px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                height: "100%",
                boxShadow: "0 0 15px rgb(188, 188, 188)",
                borderBottom: "1px solid rgb(235, 235, 235)",
                zIndex: 10,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
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
                      <Avatar
                        src={user?.avatarRestaurant}
                        style={{ margin: "10px" }}
                        size={60}
                        alt=""
                      />
                    ) : (
                      <UserOutlined
                        style={{
                          fontSize: 35,
                          padding: sizes.width < 768 ? "0 10px 0 0" : 20,
                        }}
                      />
                    )}

                    <span style={{ fontSize: 20, fontWeight: "500" }}>
                      {user?.nameRestaurant}
                    </span>
                  </React.Fragment>
                )}
              </div>
              {/* show when width is less than 1024 */}
              {sizes.width < 960 ? (
                <MenuUnfoldOutlined
                  style={{ fontSize: 30, cursor: "pointer" }}
                  onClick={() => setCheckResponsive(true)}
                />
              ) : (
                render()
              )}
            </div>
          </Header>
          <Content className={styles.content}>
            <ListTable
              statusTable={statusTable}
              callBack={(e) => {
                setShowMenu(true), setBookTable(e);
              }}
              bookTable={bookTable}
              moveTable={moveTable}
              showMenu={showMenu}
              hideBookTable={() => {
                setShowMenu(false); //hiện menu chuyển bàn, xóa bàn, order
                setMoveTable(false);
                setBookTable(); //bàn chọn
              }}
            />
          </Content>
        </Layout>
      </Layout>

      {/* book table */}
      <div
        className={styles.book_table}
        style={
          checkBookTable == true
            ? {
                transform: `scale(1,1)`,
                visibility: "visible",
                opacity: 1,
                zIndex: 1000,
                overflow: "scroll",
                height: "100%",
              }
            : {}
        }
      >
        <div
          onClick={() => setCheckBookTable(false)}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
          }}
        ></div>
        <div
          style={{
            background: "#fff",
            borderRadius: 2,
            zIndex: 10,
            width: sizes.width < 786 ? "100%" : 500,
          }}
          className={styles.table_book_table}
        >
          <h3
            style={{
              textAlign: "center",
              margin: "10px 0",
              paddingBottom: 10,
              borderBottom: "1px solid rgb(219,219,219)",
            }}
          >
            Đặt bàn
          </h3>

          <Form
            name="basic"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            initialValues={{
              remember: true,
            }}
            form={form}
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              labelAlign="left"
              label="Tên khách hàng"
              name="nameUser"
              rules={[
                {
                  required: true,
                  message: "Chưa nhập tên khách hàng !",
                },
              ]}
            >
              <Input placeholder="Tên khách hàng" />
            </Form.Item>

            <Form.Item
              labelAlign="left"
              label="Số điện thoại"
              name="phone"
              rules={[
                {
                  required: true,
                  message: "Chưa nhập số điện thoại!",
                },
              ]}
            >
              <Input placeholder="Số điện thoại" type="number" />
            </Form.Item>

            <Form.Item
              labelAlign="left"
              label="Thời gian đến"
              name="timeBookTable"
              rules={[
                {
                  required: true,
                  message: "Chưa chọn giờ!",
                },
              ]}
            >
              <TimePicker format={"HH:mm"} placeholder="Thời gian đến" />
            </Form.Item>

            <Form.Item
              labelAlign="left"
              label="Số lượng người"
              name="amount"
              rules={[
                {
                  required: true,
                  message: "Chưa nhập số lượng người!",
                },
              ]}
            >
              <Input placeholder="Số lượng" type="number" />
            </Form.Item>
            <Form.Item
              labelAlign="left"
              label="Bàn muốn đặt"
              name="id"
              rules={[
                {
                  required: true,
                  message: "Chưa chọn bàn đặt!",
                },
              ]}
            >
              <Select placeholder="Bàn muốn đặt" allowClear>
                {checkSaveOrder.map((item, index) => {
                  return (
                    <Select.Option key={item} value={item._id}>
                      {item.name}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item
            // wrapperCol={{
            //   offset: 8,
            //   span: 16,
            // }}
            >
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: 20,
                }}
              >
                <Button
                  onClick={() => (setCheckBookTable(false), form.resetFields())}
                  type="primary"
                  style={{ background: "red", border: 0, marginRight: 10 }}
                >
                  Hủy
                </Button>
                {loading == true ? (
                  <Spin size="large" />
                ) : (
                  <Button type="primary" htmlType="submit">
                    Đặt bàn
                  </Button>
                )}
              </div>
            </Form.Item>
          </Form>
        </div>
        <Drawer
          title={
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              {String(user.avatarRestaurant).length <= 0 ||
              user.avatarRestaurant == null ? (
                <Avatar src={user?.avatarRestaurant} size={30} alt="" />
              ) : (
                <UserOutlined style={{ fontSize: 25, marginRight: 10 }} />
              )}

              <span style={{ fontSize: 18, fontWeight: "500" }}>
                {user?.nameRestaurant}
              </span>
            </div>
          }
          placement="right"
          onClose={() => setCheckResponsive(false)}
          open={checkResponsive}
          style={{
            padding: 0,
            margin: 0,
          }}
          width={
            sizes.width > 1024 ? "100%" : sizes.width < 768 ? "100%" : "100%"
          }
        >
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <Avatar size={44} src={user?.avatar} />
                <span style={{ marginLeft: 10 }}>{user?.name}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    border: "1px solid #d9d9d9",
                    borderRadius: 4,
                    padding: "5px 10px",
                    background: "hsl(214, 89%, 52%)",
                    color: "#fff",
                  }}
                  onClick={() => signOut()}
                >
                  <LogoutOutlined
                    style={{ fontSize: 14, marginRight: 5, marginTop: 2 }}
                  />
                  <span style={{ fontSize: 12, fontWeight: "400" }}>
                    Đăng xuất
                  </span>
                </div>
                <SettingOutlined
                  onClick={() => navigate("/manager/statistical")}
                  style={{ fontSize: 30, marginLeft: 10, cursor: "pointer" }}
                />
              </div>
            </div>
            <div style={{ position: "relative" }}>
              <Select
                style={{
                  width: "100%",
                  margin: "10px 0",
                }}
                value={statusTable == undefined ? undefined : statusTable}
                placeholder="Lọc bàn"
                onChange={handleChange}
              >
                <Select.Option key={1} value="1">
                  Có khách
                </Select.Option>
                <Select.Option key={2} value="2">
                  Bàn đặt
                </Select.Option>
                <Select.Option key={3} value="3">
                  Trống
                </Select.Option>
              </Select>
              {statusTable !== undefined && (
                <CloseCircleOutlined
                  onClick={() => setStatusTable()}
                  style={{
                    position: "absolute",
                    right: 5,
                    bottom: 15,
                    cursor: "pointer",
                    color: "red",
                    fontSize: 22,
                  }}
                />
              )}
            </div>

            <div
              style={
                sizes.width > 768
                  ? {
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }
                  : {}
              }
            >
              <Button
                onClick={() => (
                  setCheckBookTable(true), setCheckResponsive(false)
                )}
                style={{
                  backgroundColor: "red",
                  border: 0,
                  marginRight: 10,
                  borderRadius: 5,
                }}
                type="primary"
              >
                Đặt bàn
              </Button>
              <div
                style={{ display: "flex", alignItems: "center", marginTop: 10 }}
              >
                (
                <span
                  style={{ marginRight: 10, fontSize: 13, fontWeight: "500" }}
                >
                  {" "}
                  Chú ý :{" "}
                </span>
                <div
                  className={styles.not}
                  style={{ fontSize: 11, marginRight: 15, fontWeight: "500" }}
                >
                  <div
                    style={{
                      backgroundColor: "#FF7F00",
                      width: 10,
                      height: 10,
                      borderRadius: 100,
                      marginRight: 5,
                    }}
                  ></div>
                  Đặt bàn
                </div>
                <div
                  className={styles.not}
                  style={{ fontSize: 11, fontWeight: "500" }}
                >
                  <div
                    style={{
                      backgroundColor: "yellowgreen",
                      width: 10,
                      height: 10,
                      borderRadius: 100,
                      marginRight: 5,
                    }}
                  ></div>
                  Đang có khách
                </div>
                )
              </div>
            </div>
          </div>
        </Drawer>
      </div>

      {/* hiện menu chọn khi bàn có khách */}
      {showMenu == true && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 1000,
            height: "100%",
            width: "100%",
          }}
          className="box-show-menu"
        >
          <div
            onClick={() => setShowMenu(false)}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.6)",
              zIndex: 0,
              height: "100%",
              width: "100%",
            }}
          ></div>
          <div
            style={{
              width: "100%",
              // height:'100%',
              marginTop: 100,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            <div
              style={{
                background: "#fff",
                width: sizes?.width < 786 ? 300 : 400,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-around",
                padding: "20px 30px",
                borderRadius: 5,
                position: "relative",
              }}
            >
              <CloseCircleOutlined
                onClick={() => {
                  setShowMenu(false);
                  setBookTable(undefined);
                }}
                style={{
                  position: "absolute",
                  top: -10,
                  right: -10,
                  color: "red",
                  cursor: "pointer",
                  fontSize: sizes?.width < 786 ? 20 : 25,
                  background: "#fff",
                  borderRadius: "100%",
                }}
              />
              <div
                style={{
                  width: "100%",
                  textAlign: "center",
                  borderBottom: "1px solid rgb(196, 196, 196)",
                }}
              >
                <span
                  style={{
                    fontSize: sizes?.width < 786 ? 17 : 22,
                    color: "black",
                    fontWeight: "500",
                  }}
                >
                  {bookTable?.name}{" "}
                  <span style={{ color: "red", fontWeight: "500" }}>
                    {bookTable?.timeBookTable !== "null" ? "( Bàn đặt )" : ""}
                  </span>
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  position: "relative",
                  marginTop: sizes?.width < 786 ? 20 : 40,
                }}
              >
                <div
                  className="select-option"
                  style={{
                    boxShadow: "0px 0px 30px 0px rgb(0, 24, 145)",
                    width: sizes?.width < 786 ? 50 : 80,
                    height: sizes?.width < 786 ? 50 : 80,
                  }}
                  onClick={() => {
                    setShowMenu(false);
                    setMoveTable(true);
                  }}
                >
                  <span
                    style={{
                      color: "black",
                      fontSize: sizes?.width < 786 ? 11 : 13,
                      fontWeight: 600,
                    }}
                  >
                    Chuyển
                  </span>
                </div>
                <div
                  className="select-option-center"
                  style={{
                    margin: "0 30px",
                    borderRadius: "100%",
                    boxShadow: "0px 0px 30px 0px red",
                    width: sizes?.width < 786 ? 50 : 80,
                    height: sizes?.width < 786 ? 50 : 80,
                  }}
                  onClick={() => onclickCancelTable()}
                >
                  <span
                    style={{
                      color: "black",
                      fontSize: sizes?.width < 786 ? 11 : 15,
                      fontWeight: 600,
                    }}
                  >
                    Hủy
                  </span>
                </div>
                <div
                  className="select-option"
                  style={{
                    boxShadow: "0px 0px 30px 0px rgb(204, 255, 0)",
                    width: sizes?.width < 786 ? 50 : 80,
                    height: sizes?.width < 786 ? 50 : 80,
                  }}
                  onClick={() =>
                    navigate(`/order/${bookTable.name}/${bookTable._id}`)
                  }
                >
                  <span
                    style={{
                      color: "black",
                      fontSize: sizes?.width < 786 ? 11 : 16,
                      fontWeight: 600,
                    }}
                  >
                    Order
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LayoutWeb;
