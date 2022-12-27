import React, { useEffect } from "react";
import { Collapse, Descriptions, Empty, message, Pagination, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrder, removeOrder } from "../features/Order/Order";

import { getAllTable } from "../features/TableSlice/TableSlice";
import { DeleteOutlined } from "@ant-design/icons";
const { Panel } = Collapse;

const ListOder = () => {
  window.scrollTo(0, 0);
  const dispatch = useDispatch();
  const orders = useSelector((data) => data.order.value);
  const tables = useSelector((data) => data.table.value);

  useEffect(() => {
    dispatch(getAllOrder());
    dispatch(getAllTable());
  }, []);
  const deleteOrder = async (id) => {
    if (confirm("Bạn có muốn xóa không ?")) {
      message.warning("Đang tiến hành xóa !");
      await dispatch(removeOrder({ id: id }));
      message.success("Xóa thành công");
    }
  };
  return (
    <div
      style={{
        height: "100vh",
        background: "#fff",
        overflow: "scroll",
        flex: 1,
      }}
      className="unScroll"
    >
      <div>
        <h4>Hóa đơn</h4>
        <hr style={{ background: "rgba(0,0,0,.3)" }} />
        {orders?.length > 0 ? (
          <Collapse accordion>
            {orders
              .slice()
              .reverse()
              .map((item, index) => {
                const time = new Date(item.createdAt);
                return (
                  <Panel
                    style={{ fontWeight: "400", fontSize: 16 }}
                    header={`#${item._id}${" ------ "} Ngày ${time.getDate()}-${
                      String(time.getMonth() + 1).length == 1
                        ? `0${time.getMonth() + 1}`
                        : time.getMonth() + 1
                    }-${time.getFullYear()} --- ${
                      String(time.getHours()).length == 1
                        ? `0${time.getHours()}`
                        : time.getHours()
                    }:${
                      String(time.getMinutes()).length == 1
                        ? `0${time.getMinutes()}`
                        : time.getMinutes()
                    }`}
                    key={item}
                  >
                    <div
                      style={{
                        textAlign: "left",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ fontWeight: "500", fontSize: 16 }}>
                        Tên khác hàng : {item.seller_name}
                      </span>
                      <br />
                      {tables.map(
                        (table) =>
                          table._id == item.table_id && (
                            <span
                              style={{ fontWeight: "500", fontSize: 16 }}
                              key={table._id}
                            >
                              Tên bàn : {table.name}
                            </span>
                          )
                      )}
                    </div>
                    <div
                      style={{
                        textAlign: "left",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ fontWeight: "500", fontSize: 16 }}>
                        Giờ đến : {item.start_time}
                      </span>
                      <span style={{ fontWeight: "500", fontSize: 16 }}>
                        Giờ về : {item.end_time}
                      </span>
                    </div>
                    <div
                      style={{
                        textAlign: "left",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ fontWeight: "500", fontSize: 16 }}>
                        {item.bookTable.timeBookTable > 0 && (
                          <>Bàn đặt lúc : {item.bookTable.timeBookTable}</>
                        )}
                      </span>
                      <span style={{ fontWeight: "500", fontSize: 16 }}>
                        {item.bookTable.nameUser > 0 && (
                          <>Người đặt : {item.bookTable.nameUser}</>
                        )}
                      </span>
                    </div>
                    <div
                      style={{
                        textAlign: "left",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ fontWeight: "500", fontSize: 16 }}>
                        {item.bookTable.phone > 0 && (
                          <>Số điện thoại : {item.bookTable.phone}</>
                        )}
                      </span>

                      <span style={{ fontWeight: "500", fontSize: 16 }}>
                        {item.bookTable.amount > 0 && (
                          <>Số lượng người : {item.bookTable.amount}</>
                        )}
                      </span>
                    </div>
                    <span style={{ fontWeight: "500", fontSize: 16 }}>
                      {item.sale > 0 && <>Giảm : {item.sale} %</>}
                    </span>
                    <br />
                    <br />
                    <span style={{ fontWeight: "500", fontSize: 16 }}>
                      Thực đơn
                    </span>
                    <Descriptions bordered size="default">
                      {item?.orders?.map((itemDetail) => {
                        return (
                          <div
                            key={itemDetail._id}
                            style={{ fontWeight: "400", fontSize: 16 }}
                          >
                            <Descriptions.Item label="Sản phẩm">
                              {itemDetail.name} (
                              <span style={{ color: "red", fontWeight: "600" }}>
                                x{itemDetail.amount}
                              </span>
                              ) :{Number(itemDetail?.price).toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                              {itemDetail?.weight ? "VND/KG" : "VND"}
                              <br />
                              {itemDetail?.weight > 1 && (
                                <>Cân nặng : {itemDetail.weight} KG</>
                              )}
                            </Descriptions.Item>

                            <br />
                          </div>
                        );
                      })}
                    </Descriptions>
                    <br></br>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderTop: "1px solid rgb(218, 218, 218)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          margin: "20px 0",
                        }}
                      >
                        {item.sale > 0 && (
                          <span
                            style={{
                              width: "100%",
                              fontSize: "1.1rem",
                              fontWeight: "600",
                            }}
                          >
                            Tổng :{" "}
                            <span>
                              {" "}
                              {item.sumPrice
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                              VND
                            </span>
                          </span>
                        )}
                        <span
                          style={{
                            width: "100%",
                            fontSize: "1.1rem",
                            fontWeight: "600",
                          }}
                        >
                          Tổng thanh toán :{" "}
                          <span
                            style={{
                              color: "red",
                              fontWeight: "500",
                              fontSize: 23,
                            }}
                          >
                            {" "}
                            {Math.ceil(
                              item.sumPrice * ((100 - item.sale) / 100)
                            )
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                            VND
                          </span>
                        </span>
                      </div>

                      <DeleteOutlined
                        style={{ cursor: "pointer", fontSize: 18 }}
                        onClick={() => deleteOrder(item._id)}
                      />
                    </div>
                  </Panel>
                );
              })}
          </Collapse>
        ) : (
          <Empty />
        )}
      </div>
    </div>
  );
};

export default ListOder;
