import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, React } from "react";
import { getAllTable } from "../features/TableSlice/TableSlice";
import { Row, Col, Spin } from "antd";

import IconTable from "../images/table.png";
import Error from "../images/error.png";
import "../css/Home.css";
import MoveTable from "./MoveTable";
import { Size } from "./../components/size";

const ListTable = (props) => {
  const sizes = Size();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tables = useSelector((data) => data.table);
  useEffect(() => {
    dispatch(getAllTable());
  }, []);
  const data = [1, 2, 3, 4]
  const ko = data.filter((item) => {
    return
  })
  console.log(ko, '3e2wd')
  // lọc theo trạng thái của bàn
  const statusTable = [];
  tables?.value.map((item) => {
    if (
      props?.statusTable == 1
        ? (item.timeBookTable !== "null" && item?.orders?.length > 0) ||
        item?.orders?.length > 0
        : props?.statusTable == 2
          ? (item.timeBookTable !== "null" && item?.orders?.length > 0) ||
          item.timeBookTable !== "null"
          : props?.statusTable == 3
            ? item.timeBookTable == "null" &&
            (item?.orders?.length <= 0 || item?.orders == null)
            : null
    ) {
      statusTable.push(item);
    }
  });
  // chọn
  const checkOrderr = (item) => {
    if (
      (item?.orders?.length <= 0 || item?.orders == null) &&
      item.timeBookTable == "null"
    ) {
      navigate(`/order/${item.name}/${item._id}`);
    } else if (item?.orders?.length > 0 && item.timeBookTable == "null") {
      props?.callBack(item);
    } else {
      props?.callBack(item);
    }
  };

  const renderSumPriceBookTable = (item) => {
    const prices = (
      item?.orders == null ? [] : item?.orders
    )?.map((item) => {
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
    return sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <div
      style={{
        position: "relative",
        height: "100%",
        background: "#fff",
        zIndex:
          props?.showMenu == true
            ? props?.moveTable == true
              ? 25
              : 10
            : props?.moveTable == true
              ? 25
              : 10,
      }}
    >
      {tables?.value?.length <= 0 && tables?.checkData == false ? (
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
      ) : tables.value.length <= 0 && tables.checkData == true ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            height: "100%",
          }}
        >
          <span style={{ color: "red", fontSize: 30, fontWeight: "500" }}>
            Chưa có bàn nào !
          </span>
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
              <img
                src={Error}
                alt=""
                style={{ width: sizes.width < 768 ? "50%" : "20%" }}
              />
              <span style={{ fontSize: 20, fontWeight: "500", color: "red" }}>
                Xin lỗi, hiện tại chưa có dữ liệu.
              </span>
            </div>
          ) : (
            (props?.statusTable == undefined ? tables?.value : statusTable).map(
              (item, index) => {
                return (
                  <Col
                    key={item._id}
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
                          {item?.orders?.length > 0 && (
                            <div
                              style={{
                                backgroundColor: "yellowgreen",
                                width: sizes.width < 768 ? 12 : 16,
                                borderRadius: 100,
                                marginRight: 5,
                                height: sizes.width < 768 ? 12 : 16,
                              }}
                            ></div>
                          )}
                        </div>

                        <div
                          style={{
                            fontSize: sizes.width < 768 ? 15 : 19,
                            fontWeight: "500",
                          }}
                        >
                          {item.name}
                        </div>
                        {item.amount > 0 ? (
                          (item?.orders?.length > 0 ||
                            item?.orders?.length <= 0 ||
                            item.timeBookTable !== "null") && (
                            <span
                              style={{
                                fontSize: sizes.width < 768 ? 12 : sizes.width == 1024
                                  ? 15
                                  : 16,
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
                              fontSize:
                                sizes.width < 768
                                  ? 12
                                  : sizes.width == 1024
                                    ? 15
                                    : 16,
                              color:
                                item?.orders?.length > 0 ? "#00CC00" : "red",
                              fontWeight: "500",
                            }}
                          >
                            {item?.orders?.length > 0
                              ? `Tổng ${renderSumPriceBookTable(item)}đ`
                              : "Trống"}
                          </span>
                        )}
                      </div>
                    </div>
                  </Col>
                );
              }
            )
          )}
        </Row>
      )}

      {/* hiện modal chuyển bàn */}
      <MoveTable
        bookTable={props?.bookTable}
        hideBookTable={() => {
          props?.hideBookTable();
        }}
        moveTable={props?.moveTable}
        table={tables?.value}
      />
    </div>
  );
};

export default ListTable;
