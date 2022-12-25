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
import { addOrderTable } from "../features/TableSlice/TableSlice";
import { getAllTable } from "./../features/TableSlice/TableSlice";
import { addOrder } from "../features/Order/Order";
import { removeOrderTable } from "../API/TableAPI";
import { Size } from "../size";
const SelectedProduct = (props) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const sizes = Size();
  const { id } = useParams();
  const dispatch = useDispatch();
  let navigate = useNavigate();

  const tables = useSelector((data) => data.table.value);
  const tableFind = tables?.find((item) => item._id == id);
  const dataTable =
    tableFind?.orders?.length == undefined
      ? tableFind?.orders == null
        ? []
        : [tableFind?.orders]
      : tableFind?.orders;
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
  const prices = dataTable?.map((item) => {
    if (item?.weight) {
      return Math.ceil(+item?.price * item?.weight * +item?.amount);
    } else {
      return Math.ceil(+item?.price * +item?.amount);
    }
  });
  let sum = 0;
  for (let i = 0; i < prices?.length; i++) {
    sum += +prices[i];
  }

  const showModal = () => {
    dataTable?.length >= 1
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
    props?.callBack(true);
    const newData = [];
    const handle = async () => {
      dataTable?.map((itemOrder) => {
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
      props?.callBack(false);
    };
    if (item.item.amount == 1) {
      if (item.check == "reduce") {
        const newDataOrder = dataTable.filter(
          (itemOrder) => itemOrder.id !== item.item.id
        );
        await dispatch(
          addOrderTable({
            data: newDataOrder,
            id_table: id,
          })
        );
        props?.callBack(false);
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
    dataTable?.map((item) =>
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
      orders: dataTable,
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
          <span style={{ fontSize: sizes.width < 768 ? 12 : 15 }}>
            {name} ({data.weight}kg) ({data.dvt})
          </span>
        ) : (
          <span>
            {name} ({data.dvt})
          </span>
        ),
    },

    {
      title: "Số lượng",
      dataIndex: "amount",
      render: (amount, data) => <div>{amount}</div>,
    },
    // {
    //   title: "Đơn vị(Kg)",
    //   dataIndex: "dvt",
    // },
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
    props?.callBack(true);
    setLoading(true);
    if (isNaN(valueAmount?.amount) == false) {
      if (valueAmount?.amount == 0 || String(valueAmount?.amount).length <= 0) {
        const newDataOrder = dataTable.filter(
          (itemOrder) => itemOrder.id !== item.id
        );
        await dispatch(
          addOrderTable({
            data: newDataOrder,
            id_table: id,
          })
        );
        props?.callBack(false);
      } else {
        const newData = [];
        dataTable?.map((itemOrder) => {
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
        props?.callBack(false);
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
    <div
      className="order"
      style={{
        height: sizes.height,
      }}
    >
      {sizes.width < 1024 ? (
        <></>
      ) : (
        <div onlay className="order_pro" id="order_pro">
          Sản phẩm đã chọn
        </div>
      )}
      {dataTable?.length <= 0 || dataTable == null ? (
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
            style={{
              height: "100%",
            }}
          >
            <div
              onl
              className="box-order"
              style={{
                overflowX: "scroll",
                height:
                  sizes.width < 1024
                    ? sizes.height - 150
                    : sizes.width == 1024
                    ? sizes.height - 203
                    : sizes.height - 203,
                position: "relative",
              }}
            >
              {dataTable?.map((item, index) => {
                return (
                  <Row key={item._id} className="row-order">
                    <Col
                      xs={0}
                      sm={0}
                      md={props?.isModalOpen == true ? 0 : 3}
                      lg={3}
                      xl={3}
                    >
                      <span
                        className="stt"
                        style={{
                          fontSize:
                            sizes.width < 1024
                              ? 20
                              : sizes.width == 1024
                              ? 11
                              : 19,
                        }}
                      >
                        {index + 1}
                      </span>
                    </Col>
                    <Col
                      xs={16}
                      sm={18}
                      md={props?.isModalOpen == true ? 12 : 13}
                      lg={
                        props?.isModalOpen == true
                          ? sizes.width < 1024
                            ? 14
                            : sizes.width == 1024
                            ? 14
                            : 14
                          : sizes.width < 1024
                          ? 14
                          : sizes.width == 1024
                          ? 14
                          : 14
                      }
                      xl={13}
                    >
                      <span
                        className="name_ode"
                        style={{
                          fontSize:
                            sizes.width < 1024
                              ? sizes.width < 768
                                ? 15
                                : 20
                              : sizes.width == 1024
                              ? 14
                              : 19,
                        }}
                      >
                        {item.name}
                      </span>
                      {item.weight > 0 && (
                        <span
                          style={{
                            fontSize:
                              sizes.width < 1024
                                ? sizes.width < 768
                                  ? 15
                                  : 20
                                : sizes.width == 1024
                                ? 11
                                : 19,
                          }}
                        >
                          {item.weight && item.weight + "kg"}
                        </span>
                      )}
                    </Col>
                    <Col
                      xs={8}
                      sm={6}
                      md={props?.isModalOpen == true ? 9 : 8}
                      lg={sizes.width < 1024 ? 6 : sizes.width == 1024 ? 6 : 9}
                      xl={8}
                    >
                      <span className="quantity buttons_added">
                        <Button
                          style={{
                            background: "rgb(211, 211, 211)",
                            paddingRight:
                              sizes.width < 1024
                                ? 10
                                : sizes.width == 1024
                                ? 5
                                : 10,

                            paddingLeft:
                              sizes.width < 1024
                                ? 10
                                : sizes.width == 1024
                                ? 5
                                : 10,

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
                          style={{
                            textAlign: "center",
                            margin: 0,
                            padding: "3px 0",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "column",
                            width: "100%",
                          }}
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
                            paddingRight:
                              sizes.width < 1024
                                ? 10
                                : sizes.width == 1024
                                ? 5
                                : 10,

                            paddingLeft:
                              sizes.width < 1024
                                ? 10
                                : sizes.width == 1024
                                ? 5
                                : 10,
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

              {/* <!-- xác nhận thanh toán--> */}
              <Modal
                title="Xác nhận thanh toán"
                width={sizes.width < 768 ? "100%" : "80%"}
                visible={isModalVisible}
                onCancel={handleCancel}
              >
                <div className="row payment_confirmation">
                  <div className={sizes.width < 768 ? "col-12" : "col-4"}>
                    <div
                      className="jidrr"
                      style={{
                        borderRight:
                          sizes.width < 768
                            ? 0
                            : "1px solid rgb(214, 214, 214)",
                      }}
                    >
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
                  {sizes.width < 768 && <hr />}
                  <div className={sizes.width < 768 ? "col-12" : "col-8"}>
                    <div style={{ padding: sizes.width < 768 ? 0 : 10 }}>
                      <div
                        className="information"
                        style={{ fontSize: sizes.width < 768 ? 14 : 16 }}
                      >
                        sản phẩm đã thêm
                      </div>
                      {dataTable?.length < 8 ? (
                        <Table
                          columns={columns}
                          bordered={false}
                          style={{ fontSize: ".8rem" }}
                          dataSource={dataTable}
                          pagination={false}
                          rowKey={(item) => item._id}
                        />
                      ) : (
                        <Table
                          columns={columns}
                          bordered={false}
                          style={{ fontSize: ".8rem" }}
                          dataSource={dataTable}
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
            <div
              className="discount"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: 150,
              }}
            >
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
                  <div
                    className="sum"
                    style={{
                      marginTop: 20,
                      fontSize:
                        sizes.width < 1024 ? 20 : sizes.width == 1024 ? 17 : 19,
                    }}
                  >
                    Tổng Tiền :{" "}
                    <span
                      style={{
                        color: "red",
                        fontWeight: "500",
                        fontSize:
                          sizes.width < 1024
                            ? 20
                            : sizes.width == 1024
                            ? 20
                            : 19,
                      }}
                    >
                      {Math.ceil(sum * ((100 - valueSale) / 100))
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                      đ
                    </span>
                  </div>
                )}
                <Button
                  style={{
                    width: "100%",
                    fontSize: "1.3rem",
                    padding: 20,
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  type="primary"
                  onClick={showModal}
                  disabled={props?.loading || loading}
                >
                  Thanh toán
                </Button>
              </div>
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default SelectedProduct;
