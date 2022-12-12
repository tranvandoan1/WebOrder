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
import { getProduct } from "../features/ProductsSlice/ProductSlice";
import { getCategori } from "../features/Categoris/CategoriSlice";
import "../css/Order.css";
import { openNotificationWithIcon } from "../Notification";
import moment from "moment";
import {
  addOrderTable,
} from "../features/TableSlice/TableSlice";
import { getAllTable } from "./../features/TableSlice/TableSlice";
import { addOrder } from "../features/Order/Order";
import { removeOrderTable } from "../API/TableAPI";
const SelectedProduct = (props) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const { name, id } = useParams();
  const dispatch = useDispatch();
  let navigate = useNavigate();

  const tables = useSelector((data) => data.table.value);
  const tableFind = tables?.find((item) => item._id == id);
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
    dispatch(getProduct());
    dispatch(getCategori());
    dispatch(getAllTable());
  }, []);

  // tính tổng tiền
  const prices = tableFind?.orders?.map((item) => {
    if (item.weight) {
      return Math.ceil(+item.price * item.weight * +item.amount);
    } else {
      return Math.ceil(+item.price * +item.amount);
    }
  });
  let sum = 0;
  for (var i = 0; i < prices?.length; i++) {
    sum += +prices[i];
  }

  const showModal = () => {
    tableFind?.orders?.length >= 1
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
    const newData = [];
    const handle = async () => {
      tableFind?.orders?.map((itemOrder) => {
        if (itemOrder.id == item.item.id) {
          newData.push({
            ...itemOrder,
            amount:
              item.check == "reduce"
                ? +item.item.amount - +1
                : +item.item.amount + +1,
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
    };
    if (item.item.amount == 1) {
      if (item.check == "reduce") {
        const newDataOrder = tableFind?.orders.filter(
          (itemOrder) => itemOrder.id !== item.item.id
        );
        await dispatch(
          addOrderTable({
            data: newDataOrder,
            id_table: id,
          })
        );
      } else {
        handle();
      }
    } else {
      handle();
    }
  };

  //thanh toán

  const comfirm = async () => {
    const order = [];
    tableFind?.orders?.map((item) =>
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
      orders: tableFind?.orders,
      bookTable: {
        nameUser: tableFind?.nameUser,
        timeBookTable: tableFind?.timeBookTable,
        phone: tableFind?.phone,
        amount: tableFind?.amount,
      },
      sale: value == undefined ? 0 : Number(value),
      sumPrice: sum,
      table_id: id,
      start_time: tableFind?.time_start,
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
    setLoading(true);
    await dispatch(addOrder(data));
    await removeOrderTable({ id: id });
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
  // thay đổi số lượng từ ô input
  const changeAmountInput = async (item) => {
    setLoading(true);
    if (isNaN(valueAmount?.amount) == false) {
      if (valueAmount?.amount == 0 || String(valueAmount?.amount).length <= 0) {
        const newDataOrder = tableFind?.orders.filter(
          (itemOrder) => itemOrder.id !== item.id
        );
        await dispatch(
          addOrderTable({
            data: newDataOrder,
            id_table: id,
          })
        );
      } else {
        const newData = [];
        tableFind?.orders?.map((itemOrder) => {
          if (itemOrder.id == item.id) {
            newData.push({
              ...itemOrder,
              amount: Number(
                valueAmount?.amount == undefined
                  ? item.amount
                  : valueAmount?.amount
              ),
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
      }
    } else {
      if (valueAmount?.amount !== undefined) {
        message.warning("Hãy nhập số !");
        setValueAmount();
      }
    }
    setValueAmount();
    setLoading(false);
  };
  return (
    <div>
      <div className="order">
        <div className="order_pro">Sản phẩm đã chọn</div>
        {tableFind?.orders?.length <= 0 || tableFind?.orders == null ? (
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
            <div
              className="box-order"
              style={{ overflowX: "scroll", height: "60%" }}
            >
              {tableFind?.orders?.map((item, index) => {
                return (
                  <Row key={index} className="row-order">
                    <Col
                      xs={0}
                      sm={0}
                      md={props?.isModalOpen == true ? 0 : 3}
                      lg={3}
                      xl={3}
                    >
                      <span className="stt">{index + 1}</span>
                    </Col>
                    <Col
                      xs={4}
                      sm={18}
                      md={props?.isModalOpen == true ? 12 : 13}
                      lg={props?.isModalOpen == true ? 3 : 12}
                      xl={13}
                    >
                      <span className="name_ode">{item.name}</span>
                      {item.weight > 0 && (
                        <span>{item.weight && item.weight + "kg"}</span>
                      )}
                    </Col>
                    <Col
                      xs={12}
                      sm={4}
                      md={props?.isModalOpen == true ? 9 : 8}
                      lg={8}
                      xl={8}
                    >
                      <span className="quantity buttons_added">
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
                              : item.id == valueAmount?.id
                              ? valueAmount?.amount
                              : item.amount
                          }
                          style={{ textAlign: "center" }}
                          onChange={(e) => {
                            setValueAmount({
                              id: item.id,
                              amount: e.target.value,
                            });
                          }}
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
                <div className="row payment_confirmation">
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
                      {tableFind?.orders?.length < 8 ? (
                        <Table
                          columns={columns}
                          bordered={false}
                          style={{ fontSize: ".8rem" }}
                          dataSource={tableFind?.orders}
                          pagination={false}
                          rowKey={(item) => item._id}
                        />
                      ) : (
                        <Table
                          columns={columns}
                          bordered={false}
                          style={{ fontSize: ".8rem" }}
                          dataSource={tableFind?.orders}
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
