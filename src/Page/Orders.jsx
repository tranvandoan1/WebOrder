import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Menu,
  Input,
  Button,
  Modal,
  Row,
  Col,
  Form,
  message,
  Spin,
  Drawer,
} from "antd";
import { useParams, Link } from "react-router-dom";
import {
  DoubleLeftOutlined,
  MenuFoldOutlined,
  MenuOutlined,
  MenuUnfoldOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import SelectedProduct from "./SelectedProduct";
import styles from "../css/Order.module.css";
import { getProductAll } from "./../features/ProductsSlice/ProductSlice";
import { getCategori } from "./../features/Categoris/CategoriSlice";
import { addOrderTable, getAllTable } from "../features/TableSlice/TableSlice";
import { Size } from "../components/size";
import Loading from "../components/Loading";
const Orders = () => {
  const { id } = useParams();
  const sizes = Size();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [productOrder, setProductOrder] = useState([]); //lấy sản phẩm ko có kg
  const [proSelect, setProSelect] = useState([]);
  // hiện input nhập cân nặng
  const [modalWeight, setModalWeight] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const tables = useSelector((data) => data.table);

  const products = useSelector((data) => data.product);
  const categoris = useSelector((data) => data.categori.value);
  useEffect(() => {
    dispatch(getProductAll());
    dispatch(getCategori());
    dispatch(getAllTable());
  }, []);
  const tableOrder = tables?.value?.find((item) => item._id == id);
  const dataTable =
    tableOrder?.orders?.length == undefined
      ? tableOrder?.orders == null
        ? []
        : [tableOrder?.orders]
      : tableOrder?.orders;
  const apply = async (values) => {
    if (Number.isFinite(Number(values.weight)) == false) {
      message.warning("Số lượng phải là số !");
    } else {
      const newSaveOrder = dataTable?.find(
        (item) => item.weight == Number(values.weight)
      );
      form.resetFields();

      setLoading(true);
      setModalWeight(false);
      if (newSaveOrder !== undefined) {
        const newData = [];
        dataTable?.map((itemOrder) => {
          if (itemOrder.id == newSaveOrder.id) {
            newData.push({
              ...itemOrder,
              amount: +newSaveOrder.amount + +1,
              weight: Number(values.weight),
            });
          } else {
            newData.push(itemOrder);
          }
        });

        await dispatch(
          addOrderTable({
            data: newData,
            id_table: id,
          })
        );
      } else {
        const newOrder = {
          amount: 1,
          id_pro: productOrder._id,
          weight: Number(values.weight),
          name: productOrder.name,
          photo: productOrder.photo,
          price: productOrder.price,
          dvt: productOrder.dvt,
          id: Math.random().toString(36).substring(0, 20),
        };
        await dispatch(
          addOrderTable({
            data:
              dataTable?.length <= 0 || dataTable == null
                ? newOrder
                : [...dataTable, newOrder],
            id_table: id,
          })
        );
      }
      setLoading(false);
    }
  };

  const selectProduct = async (pro) => {
    const date = new Date();
    // lấy ra được sản phẩm vừa chọn
    // kiểm tra xem sp lựa chọn đã tồn lại ở bàn này hay chưa
    const newSaveOrder = dataTable?.find((item) => item.id_pro == pro._id);
    // th1 nếu mà sp order mà cần có kg
    if (pro.check == true) {
      // nếu sp là sp theo cân thì hiện input nhập cân nặng
      setModalWeight(true);
      setProductOrder(pro);
    } else {
      if (newSaveOrder == undefined) {
        const newOrder = {
          amount: 1,
          id_pro: pro._id,
          name: pro.name,
          photo: pro.photo,
          price: pro.price,
          dvt: pro.dvt,
          weight: 0,
          id: Math.random().toString(36).substring(0, 20),
        };
        setLoading(true);
        await dispatch(
          addOrderTable({
            data:
              dataTable?.length <= 0 || dataTable == null
                ? newOrder
                : [...dataTable, newOrder],
            id_table: id,
            time_start: `${
              String(date.getHours()).length == 1
                ? `0${date.getHours()}`
                : date.getHours()
            }:${
              String(date.getMinutes()).length == 1
                ? `0${date.getMinutes()}`
                : date.getMinutes()
            }`,
          })
        );
        setLoading(false);
      } else {
        const newData = [];
        dataTable?.map((itemOrder) => {
          if (itemOrder.id == newSaveOrder.id) {
            newData.push({
              ...itemOrder,
              amount: +newSaveOrder.amount + +1,
            });
          } else {
            newData.push(itemOrder);
          }
        });
        setLoading(true);
        await dispatch(
          addOrderTable({
            data: newData,
            id_table: id,
          })
        );
      }
      setLoading(false);
    }
  };

  const listCate = (id) => {
    if (id == "all") {
      setProSelect([]);
    } else {
      const productFind = products?.value?.filter((item) => item.cate_id == id);
      setProSelect(productFind);
    }
  };
  // show menu width<1024
  const [openCart, setOpenCart] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      {/* reponsive  */}
      {sizes.width < 1024 ? (
        <div
          style={{
            background: "rgb(57, 90, 255)",
            padding: 10,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              border: "1px solid #CCCCCC",
              borderRadius: 5,
              padding: "3px 8px",
              cursor: "pointer",
            }}
            onClick={() => setOpenMenu(true)}
          >
            <MenuOutlined style={{ color: "#fff", fontSize: 20 }} />
          </div>
          <div
            style={{
              border: "1px solid #CCCCCC",
              borderRadius: 5,
              padding: "3px 8px",
              cursor: "pointer",
              position: "relative",
            }}
            onClick={() => setOpenCart(true)}
          >
            {loading == true ? (
              <Spin />
            ) : (
              <React.Fragment>
                <ShoppingCartOutlined style={{ color: "#fff", fontSize: 20 }} />
                <span
                  style={{
                    position: "absolute",
                    top: -10,
                    left: -10,
                    background: "red",
                    borderRadius: "100%",
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: "500",
                    width: 23,
                    height: 23,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {dataTable == null ? 0 : dataTable?.length}
                </span>
              </React.Fragment>
            )}
          </div>
        </div>
      ) : null}
      {products?.value?.length <= 0 && products?.checkData == false ? (
        <Loading />
      ) : products?.value?.length <= 0 && products?.checkData == true ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            flex: 1,
          }}
        >
          <span style={{ fontSize: 20, color: "red", fontWeight: "500" }}>
            Chưa có sản phẩm
          </span>

          <Link
            to="/tables"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 15,
            }}
          >
            <DoubleLeftOutlined style={{ marginRight: 10 }} /> Quay lại{" "}
          </Link>
        </div>
      ) : (
        <React.Fragment>
          {isModalOpen == true || sizes.width > 1024 ? (
            <div
              style={{
                position: "absolute",
                top: 10,
                left: 0,
                background: "#fff",
                zIndex: 100,
                borderRadius: "100%",
                display: "flex",
                justifyContent: "space-between",
                padding: "10px ",
                boxShadow: "0 0 10px blue",
              }}
            >
              <MenuUnfoldOutlined
                className="icon"
                onClick={() => setIsModalOpen(false)}
                style={{
                  color: "blue",
                  cursor: "pointer",
                  fontSize: 20,
                  fontWeight: "700",
                }}
              />
            </div>
          ) : null}
          <Row>
            <Col
              xs={0}
              sm={0}
              md={isModalOpen == true ? 0 : 0}
              lg={sizes.width < 1024 ? 0 : isModalOpen == true ? 0 : 4}
              xl={isModalOpen == true ? 0 : 4}
            >
              <div
                className={styles.back}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Link to="/tables">
                  {" "}
                  <DoubleLeftOutlined className="icon" /> Quay lại{" "}
                </Link>
                <MenuFoldOutlined
                  className="icon"
                  onClick={() => setIsModalOpen(true)}
                  style={{ color: "#fff", cursor: "pointer", fontSize: 20 }}
                />
              </div>
              <div className={styles.menu}>
                <Menu style={{ fontSize: "1.1rem" }}>
                  <Menu.Item key="00" onClick={() => listCate("all")}>
                    Tất cả
                  </Menu.Item>
                  {categoris.map((item, index) => {
                    return (
                      <Menu.Item
                        key={item._id}
                        style={{ textTransform: "capitalize" }}
                        onClick={() => listCate(item._id)}
                      >
                        {item.name}
                      </Menu.Item>
                    );
                  })}
                </Menu>
              </div>
            </Col>
            <Col
              xs={24}
              sm={24}
              md={sizes.width < 1024 ? 24 : isModalOpen == true ? 16 : 16}
              lg={isModalOpen == true ? 18 : 14}
              xl={isModalOpen == true ? 18 : 14}
            >
              <div
                className="products"
                style={{ paddingBottom: 10, height: "100vh" }}
              >
                <Row>
                  {(proSelect?.length >= 1 ? proSelect : products?.value)?.map(
                    (item_pro) => {
                      return (
                        <Col
                          xs={12}
                          sm={8}
                          md={6}
                          lg={
                            sizes.width == 1024
                              ? isModalOpen == true
                                ? 6
                                : 8
                              : 6
                          }
                          xl={6}
                          key={item_pro._id}
                          onClick={() => selectProduct(item_pro)}
                        >
                          <div className="list_pro">
                            <div
                              className="img"
                              style={{
                                height:
                                  sizes.width < 768
                                    ? 170
                                    : sizes.width == 1024
                                    ? isModalOpen == true
                                      ? 170
                                      : 160
                                    : 180,
                              }}
                            >
                              <img src={item_pro.photo} alt="" />
                              <div className="name-price">
                                <div className="name">{item_pro.name}</div>
                                <div className="price">
                                  {item_pro.price
                                    .toString()
                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                  đ
                                </div>
                              </div>
                            </div>
                          </div>
                        </Col>
                      );
                    }
                  )}
                </Row>
              </div>
            </Col>
            <Col
              xs={0}
              sm={0}
              md={sizes.width < 1024 ? 0 : isModalOpen == true ? 6 : 6}
              lg={isModalOpen == true ? 6 : 6}
              xl={isModalOpen == true ? 6 : 6}
            >
              <SelectedProduct
                loading={loading}
                tableOrder={tableOrder}
                isModalOpen={isModalOpen}
                callBack={(e) => setLoading(e)}
              />
            </Col>
          </Row>

          {/*nhập cân nặng */}
          <Modal
            title="Cân nặng"
            visible={modalWeight}
            onCancel={() => setModalWeight(false)}
          >
            <Form
              name="basic"
              labelCol={{
                span: 6,
              }}
              wrapperCol={{
                span: 18,
              }}
              initialValues={{
                remember: true,
              }}
              form={form}
              onFinish={apply}
              autoComplete="off"
            >
              <Form.Item
                label="Cân nặng"
                name="weight"
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: "Chưa nhập cân nặng!",
                  },
                ]}
              >
                <Input placeholder="Nhập cân nặng" type="number" />
              </Form.Item>

              <Form.Item
                wrapperCol={{
                  offset: 6,
                  span: 16,
                }}
              >
                <Button type="primary" htmlType="submit">
                  Áp dụng
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </React.Fragment>
      )}

      {/* show menu cart width <1024 */}
      {sizes.width < 1024 ? (
        <React.Fragment>
          <Drawer
            title={
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>Sản phẩm đã chọn</span>
                {loading == true && <Spin />}
              </div>
            }
            placement="right"
            onClose={() => setOpenCart(false)}
            open={openCart}
            width={sizes.width < 539 ? "100%" : "60%"}
          >
            <SelectedProduct
              loading={loading}
              tableOrder={tableOrder}
              isModalOpen={isModalOpen}
            />
          </Drawer>
          <Drawer
            title="Lọc theo danh mục"
            placement="left"
            onClose={() => setOpenMenu(false)}
            open={openMenu}
          >
            <div>
              <Menu style={{ fontSize: "1.1rem", border: 0 }}>
                <Menu.Item key="00" onClick={() => listCate("all")}>
                  Tất cả
                </Menu.Item>
                {categoris.map((item, index) => {
                  return (
                    <Menu.Item
                      key={index}
                      style={{ textTransform: "capitalize" }}
                      onClick={() => {
                        listCate(item._id);
                        setOpenMenu(false);
                      }}
                    >
                      {item.name}
                    </Menu.Item>
                  );
                })}
                <Menu.Item style={{ textTransform: "capitalize" }}>
                  <Link
                    to="/tables"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <DoubleLeftOutlined
                      className="icon"
                      style={{ marginRight: 5, marginTop: 2 }}
                    />{" "}
                    Quay lại{" "}
                  </Link>
                </Menu.Item>
              </Menu>
            </div>
          </Drawer>
        </React.Fragment>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Orders;
