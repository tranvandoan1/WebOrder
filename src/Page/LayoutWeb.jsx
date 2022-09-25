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
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styles from "../css/Home.module.css";
import {
  SettingOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import ListTable from "./ListTable";
import { getAllTable } from "../features/TableSlice/TableSlice";
import { getAllSaveOrder } from "../features/saveorderSlice/saveOrderSlice";
import { editBookTable } from "../features/TableSlice/TableSlice";
import { Size } from "../size";
import { uploadLogin } from "../API/Users";
import { getUser } from "../features/User/UserSlice";
const { Header, Content, Sider } = Layout;

const LayoutWeb = () => {
  const width = Size();
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
  const tables = useSelector((data) => data.table.value);
  const saveorders = useSelector((data) => data.saveorder.value);
  const [form] = Form.useForm();
  useEffect(() => {
    dispatch(getAllTable());
    dispatch(getAllSaveOrder());
  }, []);

  let checkSaveOrder = [];
  tables?.map((element) => {
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
      window.location.href = "/signin";
      if (user?.loginWeb == 0) {
        await uploadLogin({ id: user?._id });
      }
    }
  };
  // đặt bàn
  const onFinish = async (values) => {
    const isphone =
      /^(1\s|1|)?((\(\d{3}\))|\d{3})(\-|\s)?(\d{3})(\-|\s)?(\d{4})$/.test(
        values.phone
      );
    if (isphone == false) {
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

  window.addEventListener("click", function (e) {
    if (e.target == document.getElementById("book_table")) {
      setCheckBookTable(false);
    }
  });
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
          localStorage.setItem("key", JSON.stringify(["1"]))
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

  return (
    <div
      style={{ backgroundColor: "rgb(243, 243, 243)" }}
      className={styles.main}
    >
      <Layout>
        <Layout className="site-layout">
          <Header className={styles.header}>
            <div
              style={{
                padding: "0 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Avatar
                  src="https://123design.org/wp-content/uploads/2020/07/LOGOLM0200-Chibi-%C4%90%E1%BB%87-nh%E1%BA%A5t-%C4%91%E1%BA%A7u-b%E1%BA%BFp-nh%C3%AD-Vua-%C4%91%E1%BA%A7u-b%E1%BA%BFp.jpg"
                  style={{ margin: "10px" }}
                  size={60}
                  alt=""
                />
                <span style={{ fontSize: 20, fontWeight: "500" }}>BOM BOM</span>
              </div>

              {width.width < 960 ? (
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
            <ListTable statusTable={statusTable} />
          </Content>
        </Layout>
      </Layout>
      <div
        className={styles.book_table}
        style={
          checkBookTable == true
            ? {
                transform: `scale(1,1)`,
                visibility: "visible",
                opacity: 1,
                zIndex: 1000,
              }
            : {}
        }
        id="book_table"
      >
        <div
          style={{ background: "#fff", borderRadius: 2 }}
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
                    <Select.Option key={index} value={item._id}>
                      {item.name}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
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
          title="BOM BOM"
          placement="right"
          onClose={() => setCheckResponsive(false)}
          open={checkResponsive}
          style={{
            padding: 0,
            margin: 0,
          }}
        >
          <div>
            <div>
              <Avatar size={44} src={user?.avatar} />
              <span style={{ marginLeft: 10 }}>{user?.name}</span>
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

            <div style={{ display: "flex", alignItems: "center" }}>
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
            </div>

            <Button
              onClick={() => (
                setCheckBookTable(true), setCheckResponsive(false)
              )}
              style={{
                backgroundColor: "red",
                border: 0,
                marginRight: 10,
                borderRadius: 5,
                marginTop: 10,
              }}
              type="primary"
            >
              Đặt bàn
            </Button>
          </div>
        </Drawer>
      </div>
    </div>
  );
};

export default LayoutWeb;
