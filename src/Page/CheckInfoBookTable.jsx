import { Button, message, Spin } from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import styles from "../css/Home.module.css";
import { editBookTable } from "../features/TableSlice/TableSlice";
const CheckInfoBookTable = (props) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const cancelReservation = async (item) => {
    if (confirm("Bạn có muốn xóa không ?")) {
      setLoading(true);
      await dispatch(
        editBookTable({
          id: item._id,
          timeBookTable: "null",
          amount: 0,
          phone: "null",
          nameUser: "1",
        })
      );
      setLoading(false);
      props.hideInfoBookTable();
      message.success("Bàn đặt đã được hủy");
    }
  };
  return (
    <div
      className={styles.info_book_table}
      style={
        props.infoBookTable?._id == props.item._id
          ? {
              transform: `scale(1,1)`,
              visibility: "visible",
              opacity: 1,
              zIndex: 1000,
            }
          : {}
      }
    >
      <div
        style={{
          background: "#fff",
          width: 400,
          borderRadius: 2,
        }}
        className={styles.table_book_table}
      >
        <h4
          style={{
            textAlign: "center",
            margin: "10px 0",
            paddingBottom: 10,
            borderBottom: "1px solid rgb(219,219,219)",
          }}
        >
          Thông tin bàn đặt{" "}
        </h4>

        <div style={{ fontSize: 16, fontWeight: "500" }}>
          <span>Người đặt bàn : </span>
          <span style={{ color: "red" }}>{props.item.nameUser}</span>
        </div>
        <div
          style={{
            fontSize: 16,
            fontWeight: "500",
            margin: "10px 0",
          }}
        >
          <span>Số điện thoại : </span>
          <span style={{ color: "red" }}>{props.item.phone}</span>
        </div>
        <div
          style={{
            fontSize: 16,
            fontWeight: "500",
            marginBottom: 10,
          }}
        >
          <span>Thời gian đặt bàn : </span>
          <span style={{ color: "red" }}>{props.item.timeBookTable}</span>
        </div>
        <div style={{ fontSize: 16, fontWeight: "500" }}>
          <span>Số lượng người : </span>
          <span style={{ color: "red" }}>{props.item.amount}</span>
        </div>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <Button
            onClick={() => props.hideInfoBookTable()}
            type="primary"
            style={{
              background: "red",
              border: 0,
              marginRight: 10,
            }}
          >
            Đóng
          </Button>

          <Button
            onClick={() =>
              navigate(`/order/table-name=${props.item.name}&&${props.item._id}`)
            }
            type="primary"
            style={{
              border: 0,
              marginRight: 10,
            }}
          >
            Order
          </Button>
          {loading == true ? (
            <Spin size={33} />
          ) : (
            <Button
              onClick={() => cancelReservation(props.item)}
              type="primary"
            >
              Hủy bàn đặt
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckInfoBookTable;
