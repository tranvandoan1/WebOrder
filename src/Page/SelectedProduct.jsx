import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Input,
  Button,
  Result,
  Modal,
  Row,
  Col,
  Table,
  message,
  Spin,
} from "antd";
import {
  removeSaveOrder,
  getAllSaveOrder,
  uploadSaveOrderFind,
  removeSaveOrderAll,
} from "../features/saveorderSlice/saveOrderSlice";
import { getProduct } from "../features/ProductsSlice/ProductSlice";
import { getCategori } from "../features/Categoris/CategoriSlice";
import "../css/Order.css";
import { openNotificationWithIcon } from "../Notification";
import moment from "moment";
import { editBookTable } from "../features/TableSlice/TableSlice";
import { getAllTable } from "./../features/TableSlice/TableSlice";
import { addOrder } from "../features/Order/Order";
const SelectedProduct = (props) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const { name, id } = useParams();
  const dispatch = useDispatch();
  let navigate = useNavigate();

  const saveorders = useSelector((data) => data.saveorder.value);
  const tables = useSelector((data) => data.table.value);
  const tableFind = tables?.find((item) => item._id == id);
  const saveOrdersFind = saveorders?.filter((item) => item.id_table == id);

  const [value, setValue] = useState(0);
  const [valueSale, setValueSale] = useState(0);
  const [valueAmount, setValueAmount] = useState({
    id: null,
    amount: undefined,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [loading, setLoading] = useState(false);

  // call dữ liệu
  useEffect(() => {
    dispatch(getAllSaveOrder());
    dispatch(getProduct());
    dispatch(getCategori());
    dispatch(getAllTable());
  }, []);

  // tính tổng tiền
  const prices = saveOrdersFind?.map((item) => {
    if (item.weight) {
      return Math.ceil(+item.price * item.weight * +item.amount);
    } else {
      return Math.ceil(+item.price * +item.amount);
    }
  });
  let sum = 0;
  for (var i = 0; i < prices.length; i++) {
    sum += +prices[i];
  }

  const showModal = () => {
    saveOrdersFind?.length >= 1
      ? setIsModalVisible(true)
      : message.warning("Bạn chưa chọn món");
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // thanh toán thành cộng về trang chính
  const [success, setSuccess] = useState(false);

  //tăng giảm số lượng
  const quantityChange = async (item) => {
    const upSaveOrder = {
      amount:
        item.check == "reduce"
          ? +item.item.amount - +1
          : +item.item.amount + +1,
    };
    if (item.item.amount >= 2) {
      setLoading(true);
      await dispatch(
        uploadSaveOrderFind({ id: item.item._id, data: upSaveOrder })
      );
      setLoading(false);
    } else if (item.item.amount <= 1) {
      if (item.check == "reduce") {
        setLoading(true);
        await dispatch(removeSaveOrder(item.item._id));
        setLoading(false);
      } else {
        setLoading(true);
        await dispatch(
          uploadSaveOrderFind({ id: item.item._id, data: upSaveOrder })
        );
        setLoading(false);
      }
    }
  };

  //thanh toán
  const date = new Date(saveOrdersFind[0]?.createdAt);

  const comfirm = async () => {
    const order = [];
    saveOrdersFind.map((item) =>
      order.push({
        _id: item.id_pro,
        name_pro: item.name,
        amount: item.amount,
        weight: item.weight == undefined ? 0 : item.weight,
        dvt: item.dvt,
        price: item.price,
      })
    );
    const data = {
      seller_name:
        customerName == undefined || String(customerName).length <= 0
          ? "Admin"
          : customerName,
      user_id: user._id,
      orders: order,
      bookTable: {
        nameUser: tableFind?.nameUser,
        timeBookTable: tableFind?.timeBookTable,
        phone: tableFind?.phone,
        amount: tableFind?.amount,
      },
      sale: value == undefined ? 0 : Number(value),
      sumPrice: sum,
      table_id: id,
      start_time: `${
        String(date.getHours()).length == 1
          ? `0${date.getHours()}`
          : date.getHours()
      }:${
        String(date.getMinutes()).length == 1
          ? `0${date.getMinutes()}`
          : date.getMinutes()
      }`,
      end_time: `${
        String(moment().hours()).length == 1
          ? `0${moment().hours()}`
          : moment().hours()
      }:${
        String(moment().minutes()).length == 1
          ? `0${moment().minutes()}`
          : moment().minutes()
      }`,
    };
    const idDelete = [];
    saveOrdersFind.map((item) => idDelete.push(item._id));
    setLoading(true);
    await dispatch(addOrder(data));
    await dispatch(removeSaveOrderAll(idDelete));
    if (tableFind?.timeBookTable !== "null") {
      await dispatch(
        editBookTable({
          id: id,
          nameUser: "",
          timeBookTable: "null",
          amount: 0,
          phone: "null",
        })
      );
    }
    setSuccess(true);
    setIsModalVisible(false);
    setLoading(false);
    navigate("/tables");
    message.success("Thanh toán thành công ");
  };

  // áp mã
  const applySale = () => {
    if (value > 0) {
      setValueSale(value);
    } else {
      openNotificationWithIcon("warning", "Bạn chưa nhập mã !");
    }
  };
  // hủy mã
  const cancel = () => {
    setValue(0);
    setValueSale(0);
  };

  const columns = [
    {
      title: "Tên món",
      dataIndex: "name",
      width: 150,
      render: (name, data) =>
        data.weight > 0 ? (
          <span>
            {name} ({data.weight}kg)
          </span>
        ) : (
          name
        ),
    },
    {
      title: "Số lượng",
      dataIndex: "amount",
    },
    {
      title: "Đơn vị(Kg)",
      dataIndex: "dvt",
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      render: (price) => price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
    },
    {
      title: "Thành tiền",
      dataIndex: "price",
      render: (price, data) =>
        (data.weight
          ? +data.price * +data.weight * +data.amount
          : +data.price * +data.amount
        )
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
    },
  ];
  const changeAmountInput = async (item) => {
    if (isNaN(valueAmount?.amount) == false) {
      if (valueAmount?.amount == 0 || String(valueAmount?.amount).length <= 0) {
        setLoading(true);
        await dispatch(removeSaveOrder(item._id));
        setLoading(false);
      } else {
        const upSaveOrder = {
          amount:
            valueAmount?.amount == undefined
              ? item.amount
              : valueAmount?.amount,
        };
        setLoading(true);
        await dispatch(
          uploadSaveOrderFind({ id: item._id, data: upSaveOrder })
        );
        setLoading(false);
      }
      setValueAmount();
    } else {
      message.warning("Hãy nhập số !");
      setValueAmount();
    }
  };
  return (
    <div>
      <div className="order">
        <div className="order_pro">Sản phẩm đã chọn</div>
        {saveOrdersFind.length <= 0 ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <span style={{ fontSize: 20, fontWeight: "500", color: "blue" }}>
              Hãy thêm món nào{" "}
            </span>
          </div>
        ) : (
          <React.Fragment>
            <div className="box-order">
              {saveOrdersFind?.map((item, index) => {
                return (
                  <Row key={index} className="row-order">
                    <Col xs={4} sm={2} md={12} lg={3} xl={3}>
                      <span className="stt">{index + 1}</span>
                    </Col>
                    <Col xs={4} sm={18} md={12} lg={13} xl={13}>
                      <span className="name_ode">{item.name}</span>
                      <span>{item.weight && item.weight + "kg"}</span>
                    </Col>
                    <Col xs={12} sm={4} md={12} lg={8} xl={8}>
                      <span className="quantity buttons_added">
                        {/* <input
                          type="button"
                          value="-"
                          className="minus button is-form"
                        /> */}
                        <Button
                          style={{
                            background: "rgb(211, 211, 211)",
                            paddingRight: 10,
                            paddingLeft: 10,
                            textAlign: "center",
                            fontWeight: "600",
                            marginRight: 2,
                          }}
                          onClick={() =>
                            quantityChange({ item: item, check: "reduce" })
                          }
                        >
                          -
                        </Button>
                        <Input
                          value={
                            valueAmount?.amount == undefined
                              ? item.amount
                              : item._id == valueAmount?.id
                              ? valueAmount?.amount
                              : item.amount
                          }
                          style={{ textAlign: "center" }}
                          onChange={(e) =>
                            setValueAmount({
                              id: item._id,
                              amount: e.target.value,
                            })
                          }
                          onBlur={() => changeAmountInput(item)}
                        />
                        <Button
                          style={{
                            background: "rgb(211, 211, 211)",
                            paddingRight: 10,
                            paddingLeft: 10,
                            textAlign: "center",
                            fontWeight: "600",
                            marginLeft: 2,
                          }}
                          onClick={() =>
                            quantityChange({ item: item, check: "add" })
                          }
                        >
                          +
                        </Button>
                      </span>
                    </Col>
                  </Row>
                );
              })}
            </div>
            <div className="discount">
              <div className="inpkk ">
                Giảm giá :
                <Input
                  style={{ width: 40 }}
                  placeholder="......"
                  value={value > 1 ? value : ""}
                  onChange={(e) => setValue(e.target.value)}
                />
                <Button
                  style={{ textAlign: "right" }}
                  onClick={() => applySale()}
                  type="primary"
                >
                  Áp dụng
                </Button>
                {value > 0 && (
                  <Button
                    style={{
                      textAlign: "right",
                      background: "red",
                      border: "0",
                      marginLeft: 10,
                    }}
                    onClick={() => cancel()}
                    type="primary"
                  >
                    Hủy
                  </Button>
                )}
              </div>

              <div className="payy">
                {loading == true || props.loading == true ? (
                  <Spin size="large" />
                ) : (
                  <div className="sum">
                    Tổng Tiền :{" "}
                    <span
                      style={{ color: "red", fontWeight: "500", fontSize: 22 }}
                    >
                      {Math.ceil(sum * ((100 - valueSale) / 100))
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                      đ
                    </span>
                  </div>
                )}
                <Button
                  className="pay"
                  style={{
                    background: "blue",
                    width: "100%",
                    height: "100%",
                    fontSize: "1.3rem",
                  }}
                  type="primary"
                  onClick={showModal}
                >
                  Thanh toán
                </Button>
              </div>

              {/* <!-- xác nhận thanh toán--> */}
              <Modal
                title="Xác nhận thanh toán"
                width={"80%"}
                visible={isModalVisible}
                onCancel={handleCancel}
              >
                <div className="row">
                  <div className="col-4">
                    <div className="jidrr">
                      <div className="buyer_information">
                        Thông tin người mua
                      </div>
                      <div className="user_name">
                        Khách hàng :{" "}
                        <Input
                          id="user"
                          placeholder="Nhập tên khách hàng..."
                          onChange={(e) => setCustomerName(e.target.value)}
                        />
                      </div>
                      <br />
                      {loading == true ? (
                        <Spin size="large" />
                      ) : (
                        <Button type="primary" onClick={() => comfirm()}>
                          Xác nhận
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="col-8">
                    <div className="tablee_xn">
                      <div className="information">sản phẩm đã thêm</div>
                      {saveOrdersFind.length < 8 ? (
                        <Table
                          columns={columns}
                          bordered={false}
                          style={{ fontSize: ".8rem" }}
                          dataSource={saveOrdersFind}
                          pagination={false}
                          rowKey={(item) => item._id}
                        />
                      ) : (
                        <Table
                          columns={columns}
                          bordered={false}
                          style={{ fontSize: ".8rem" }}
                          dataSource={saveOrdersFind}
                          pagination={false}
                          scroll={{ y: 300 }}
                          rowKey={(item) => item._id}
                        />
                      )}

                      <div
                        style={{
                          textAlign: "right",
                          marginTop: "20px",
                          fontSize: "17px",
                        }}
                      >
                        <span style={{ fontWeight: 500 }}>
                          Giảm giá : {value ? value : "0"}%
                        </span>
                        <br />
                        <span style={{ fontWeight: 500, color: "#ee4d2d" }}>
                          Tổng thanh toán :{" "}
                          {Math.ceil(sum * ((100 - valueSale) / 100))
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                          đ
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Modal>

              {/* <!--// thah toán--> */}

              <Modal visible={success}>
                <Result
                  status="success"
                  title="Thanh toán thành công"
                  extra={[
                    <Link to={`/tables`} style={{ fontSize: 20 }}>
                      Quay lại
                    </Link>,
                  ]}
                />
              </Modal>
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

export default SelectedProduct;
