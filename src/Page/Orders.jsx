import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addSaveOrder,
  uploadSaveOrderFind,
} from "../features/saveorderSlice/saveOrderSlice";
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
} from "antd";
import { Link } from "react-router-dom";
import { DoubleLeftOutlined } from "@ant-design/icons";
import SelectedProduct from "./SelectedProduct";
import styles from "../css/Order.module.css";
import { getProductAll } from "./../features/ProductsSlice/ProductSlice";
import { getCategori } from "./../features/Categoris/CategoriSlice";
import { getAllSaveOrder } from "./../features/saveorderSlice/saveOrderSlice";
import Loading from "../Loading";
const Orders = () => {
  const [productOrder, setProductOrder] = useState([]); //lấy sản phẩm ko có kg
  const [proSelect, setProSelect] = useState([]);
  // hiện input nhập cân nặng
  const [modalWeight, setModalWeight] = useState(false);
  // const [isModalOpen, setIsModalOpen] = useState(true);
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const { name, id } = useParams();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const saveorders = useSelector((data) => data.saveorder.value);
  const products = useSelector((data) => data.product);
  const categoris = useSelector((data) => data.categori.value);
  useEffect(() => {
    dispatch(getProductAll());
    dispatch(getCategori());
    dispatch(getAllSaveOrder());
  }, []);

  const apply = async (values) => {
    if (Number.isFinite(Number(values.weight)) == false) {
      message.warning("Số lượng phải là số !");
    } else {
      const newSaveOrder = saveorders.find(
        (item) =>
          item.id_pro == productOrder._id &&
          item.id_table == id &&
          item.weight == Number(values.weight)
      );
      if (newSaveOrder !== undefined) {
        const upSaveOrder = {
          amount: +newSaveOrder.amount + +1,
          weight: Number(values.weight),
        };
        form.resetFields();

        setLoading(true);
        await dispatch(
          uploadSaveOrderFind({ id: newSaveOrder._id, data: upSaveOrder })
        );
        setLoading(false);
        setModalWeight(false);
      } else {
        const newOrder = {
          id_user: user._id,
          amount: 1,
          id_table: id,
          id_pro: productOrder._id,
          weight: Number(values.weight),
          name: productOrder.name,
          photo: productOrder.photo,
          price: productOrder.price,
          dvt: productOrder.dvt,
        };
        form.resetFields();

        setModalWeight(false);
        setLoading(true);

        await dispatch(addSaveOrder(newOrder));
        setLoading(false);
      }
    }
  };

  const selectProduct = async (pro) => {
    // lấy ra được sản phẩm vừa chọn
    // kiểm tra xem sp lựa chọn đã tồn lại ở bàn này hay chưa
    const newSaveOrder = saveorders.find(
      (item) => item.id_pro == pro._id && item.id_table == id
    );

    // th1 nếu mà sp order mà cần có kg
    if (pro.check == true) {
      // nếu sp là sp theo cân thì hiện input nhập cân nặng
      setModalWeight(true);
      setProductOrder(pro);
    } else {
      if (newSaveOrder == undefined) {
        const newOrder = {
          id_user: user._id,
          amount: 1,
          id_table: id,
          id_pro: pro._id,
          name: pro.name,
          photo: pro.photo,
          price: pro.price,
          dvt: pro.dvt,
        };
        setLoading(true);
        await dispatch(addSaveOrder(newOrder));
        setLoading(false);
      } else {
        const addSaveOrder = {
          amount: +newSaveOrder.amount + +1,
        };
        setLoading(true);
        await dispatch(
          uploadSaveOrderFind({ id: newSaveOrder._id, data: addSaveOrder })
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
  return (
    <div>
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
          <Row>
            <Col xs={0} sm={0} md={6} lg={4} xl={4}>
              <div className={styles.back}>
                <Link to="/tables">
                  {" "}
                  <DoubleLeftOutlined className="icon" /> Quay lại{" "}
                </Link>
              </div>
              <div className={styles.menu}>
                <Menu style={{ fontSize: "1.1rem" }}>
                  <Menu.Item key="00" onClick={() => listCate("all")}>
                    Tất cả
                  </Menu.Item>
                  {categoris.map((item, index) => {
                    return (
                      <Menu.Item
                        key={index}
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
            <Col xs={24} sm={24} md={12} lg={14} xl={14}>
              <div className="products" style={{ paddingBottom: 10 }}>
                <Row>
                  {(proSelect?.length >= 1 ? proSelect : products?.value)?.map(
                    (item_pro) => {
                      return (
                        <Col
                          xs={12}
                          sm={8}
                          md={12}
                          lg={8}
                          xl={6}
                          key={item_pro._id}
                          onClick={() => selectProduct(item_pro)}
                        >
                          <div className="list_pro">
                            <div className="img">
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
            <Col xs={0} sm={0} md={6} lg={6} xl={6}>
              <SelectedProduct loading={loading} />
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
    </div>
  );
};

export default Orders;
