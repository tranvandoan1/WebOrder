import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { editBookTable, getAllTable } from "../features/TableSlice/TableSlice";
import { Row, Col, message, Spin, Alert } from "antd";
import React from "react";
import {
  getAllSaveOrder,
  removeSaveOrderAll,
} from "../features/saveorderSlice/saveOrderSlice";
import IconTable from "../images/table.png";
import Error from "../images/error.png";
import styles from "../css/Home.module.css";
import { MinusOutlined } from "@ant-design/icons";
import CheckInfoBookTable from "./CheckInfoBookTable";
import MoveTable from "./MoveTable";

const ListTable = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tables = useSelector((data) => data.table.value);
  const saveorders = useSelector((data) => data.saveorder.value);
  const [checkOrder, setCheckOrder] = useState();
  const [infoBookTable, setInfoBookTable] = useState();
  const [loading, setLoading] = useState(false);
  const [bookTable, setBookTable] = useState();
  useEffect(() => {
    dispatch(getAllTable());
    dispatch(getAllSaveOrder());
  }, []);

  // mảng mới mà biết được bàn nào có người
  let checkSaveOrder = [];
  tables?.map((element) => {
    let arrFilter = saveorders?.filter((e) => {
      return e.id_table === element._id;
    });

    checkSaveOrder.push({
      _id: element._id,
      data: arrFilter,
      name: element.name,
      timeBookTable: element.timeBookTable,
      amount: element.amount,
      nameUser: element.nameUser,
      phone: element.phone,
    });
  });

  // lọc theo trạng thái của bàn
  const statusTable = [];
  checkSaveOrder?.map((item) => {
    if (
      (props?.statusTable == 1 &&
        ((item.timeBookTable !== "null" && item.data.length > 0) ||
          item.data.length > 0)) ||
      (props?.statusTable == 2 &&
        item.timeBookTable !== "null" &&
        item.data.length <= 0) ||
      (props?.statusTable == 3 &&
        item.timeBookTable == "null" &&
        item.data.length <= 0)
    ) {
      statusTable.push(item);
    }
  });

  // chọn
  const checkOrderr = (item) => {
    const check = checkSaveOrder.find(
      (itemOrder, index) =>
        item._id == itemOrder._id && itemOrder.data.length > 0
    );
    if (check == undefined && item.timeBookTable == "null") {
      navigate(`/order/table-name=${item.name}&&${item._id}`);
    } else if (check == undefined && item.timeBookTable !== "null") {
      setInfoBookTable(item);
      setCheckOrder(false);
    } else {
      setCheckOrder(item);
    }
  };

  const renderSumPriceBookTable = (item) => {
    const prices = item.data.map((item) => {
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
    return sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const deleteTable = async (item) => {
    if (confirm("Bạn có muốn hủy bàn này không ?")) {
      const id = [];
      saveorders?.map((itemm) => {
        if (itemm.id_table == item._id) {
          id.push(itemm._id);
        }
      });
      if (item.timeBookTable == "null") {
        setLoading(true);
        await dispatch(removeSaveOrderAll(id));
        setLoading(false);
      } else {
        setLoading(true);
        await dispatch(removeSaveOrderAll(id));
        await dispatch(
          editBookTable({
            id: item._id,
            nameUser: "",
            timeBookTable: "null",
            amount: 0,
            phone: null,
          })
        );
        setLoading(false);
      }

      setCheckOrder(false);
      message.success("Xóa thành công");
    }
  };
  return (
    <div className="group_home">
      {tables.length <= 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: 10,
          }}
        >
          <Spin size="large" />
        </div>
      ) : (
        <Row>
          {statusTable.length <= 0 && props?.statusTable !== undefined ? (
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img src={Error} alt="" style={{ width: "20%" }} />
              <span style={{ fontSize: 20, fontWeight: "500", color: "red" }}>
                Xin lỗi, hiện tại chưa có dữ liệu.
              </span>
            </div>
          ) : (
            (props?.statusTable == undefined
              ? checkSaveOrder
              : statusTable
            ).map((item, index) => {
              return (
                <Col
                  key={index}
                  className="gutter-row"
                  style={{ padding: "10px", position: "relative" }}
                  xs={12}
                  sm={8}
                  md={6}
                  lg={4}
                  xl={4}
                >
                  <div className="box-table">
                    <div
                      style={{
                        fontSize: "1.5rem",
                        cursor: "pointer",
                        color: "black",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        position: "relative",
                      }}
                      onClick={() => checkOrderr(item)}
                    >
                      <img src={IconTable} alt="" style={{ width: "60%" }} />
                      <div className="node">
                        {item.timeBookTable !== "null" && (
                          <div
                            style={{
                              backgroundColor: "#FF7F00",
                              width: 16,
                              height: 16,
                              borderRadius: 100,
                              marginRight: 5,
                            }}
                          ></div>
                        )}
                        {item.data.length > 0 && (
                          <div
                            style={{
                              backgroundColor: "yellowgreen",
                              width: 16,
                              borderRadius: 100,
                              marginRight: 5,
                              height: 16,
                            }}
                          ></div>
                        )}
                      </div>

                      <div style={{ fontSize: 20, fontWeight: "500" }}>
                        {item.name}
                      </div>
                      {item.amount > 0 ? (
                        (item.data.length > 0 ||
                          item.data.length < 0 ||
                          item.timeBookTable !== "null") && (
                          <span
                            style={{
                              fontSize: 17,
                              color: "#00CC00",
                              fontWeight: "500",
                            }}
                          >
                            <span style={{ color: "#FF7F00" }}>
                              {item.timeBookTable}{" "}
                            </span>
                            {/* Tổng tiền  {sum} */}({" "}
                            {renderSumPriceBookTable(item)}đ )
                          </span>
                        )
                      ) : (
                        <span
                          style={{
                            fontSize: 17,
                            color: item.data.length > 0 ? "#00CC00" : "red",
                            fontWeight: "500",
                          }}
                        >
                          {item.data.length > 0
                            ? `Tổng ${renderSumPriceBookTable(item)}đ`
                            : "Trống"}
                        </span>
                      )}
                    </div>
                    {/* menu chọn khi bàn đặt có người  */}
                    <div
                      className={
                        checkOrder?._id == item._id
                          ? styles.active_animate
                          : styles.animate
                      }
                    >
                      <div
                        onClick={() => setCheckOrder()}
                        style={{
                          backgroundColor: "red",
                          position: "absolute",
                          top: 0,
                          right: 0,
                          width: 20,
                          height: 20,
                          borderRadius: 100,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: 10,
                          cursor: "pointer",
                        }}
                      >
                        <MinusOutlined
                          style={{ color: "#fff", fontWeight: "700" }}
                        />
                      </div>
                      {loading == true ? (
                        <Spin size={33} />
                      ) : (
                        <React.Fragment>
                          <div
                            onClick={() => (
                              setBookTable(item), setCheckOrder()
                            )}
                            style={{
                              fontSize: 18,
                              fontWeight: "500",
                              cursor: "pointer",
                            }}
                          >
                            Chuyển bàn
                          </div>
                          <div
                            onClick={() => deleteTable(item)}
                            style={{
                              fontSize: 18,
                              fontWeight: "500",
                              cursor: "pointer",
                              margin: "10px 0",
                            }}
                          >
                            Hủy bàn
                          </div>
                          <div
                            onClick={() =>
                              navigate(
                                `/order/table-name=${item.name}&&${item._id}`
                              )
                            }
                            style={{
                              fontSize: 18,
                              fontWeight: "500",
                              cursor: "pointer",
                            }}
                          >
                            Order
                          </div>
                        </React.Fragment>
                      )}
                    </div>
                    {/* hiện modal để biết thông tin bàn đặt */}
                    <CheckInfoBookTable
                      infoBookTable={infoBookTable}
                      item={item}
                      hideInfoBookTable={() => setInfoBookTable(false)}
                    />
                  </div>
                </Col>
              );
            })
          )}
        </Row>
      )}

      {/* hiện modal chuyển bàn */}
      <MoveTable
        bookTable={bookTable}
        hideInfoBookTable={() => (setCheckOrder(), setBookTable())}
        checkSaveOrder={checkSaveOrder}
      />
    </div>
  );
};

export default ListTable;
