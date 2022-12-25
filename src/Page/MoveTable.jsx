import { Button, Spin, Select, message } from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

import styles from "../css/Home.module.css";
import { changeTables } from "../features/TableSlice/TableSlice";
import { Size } from "../size";

const MoveTable = (props) => {
  const sizes = Size();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [selectTransferTable, setSelectTransferTable] = useState();

  // chuyển bàn
  const cancelReservation = async () => {
    message.warning("Đang tiến hàng chuyển bàn, xin chờ đợi !");
    if (selectTransferTable == undefined) {
      message.warning("Bạn chưa chọn bàn để chuyển !");
    } else {
      const uploadTable = {
        table1: props?.bookTable,
        table2: selectTransferTable,
      };
      setLoading(true);
      await dispatch(changeTables(uploadTable));
      setLoading(false);

      props?.hideBookTable();
      setSelectTransferTable();
      message.success("Chuyển bàn thành công");
    }
  };

  // hiện tổng tiền
  const renderSumPriceBookTable = () => {
    const prices = (
      props?.bookTable?.orders?.length == undefined
        ? [props?.bookTable?.orders]
        : props?.bookTable?.orders
    )?.map((item) => {
      if (item?.weight) {
        return Math.ceil(+item.price * item?.weight * +item.amount);
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

  // lấy những bàn chưa có khách
  const moveTables = props?.table.filter(
    (item) =>
      (item?.orders?.length <= 0 ||
        item?.orders == null ||
        item?.orders == "null") &&
      item?.timeBookTable == "null"
  );
  return (
    <div
      className={styles.info_book_table}
      style={
        props?.moveTable == true
          ? {
              transform: `scale(1,1)`,
              visibility: "visible",
              opacity: 1,
            }
          : {}
      }
    >
      <div
        style={{
          background: "#fff",
          width: sizes?.width < 786 ? 300 : 400,
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
          Chuyển bàn
        </h4>

        <div
          style={{ fontSize: sizes?.width < 786 ? 12 : 16, fontWeight: "500" }}
        >
          <span>Bàn chuyển : </span>
          <span style={{ color: "red" }}>{props?.bookTable?.name}</span>
        </div>
        <div
          style={{
            fontSize: sizes?.width < 786 ? 12 : 16,
            fontWeight: "500",
            margin: "10px 0",
          }}
        >
          <span>Tổng số tiền : </span>
          <span style={{ color: "red" }}>
            <span
              style={{
                fontSize: sizes?.width < 786 ? 15 : 17,
                color: props?.bookTable?.orders?.length > 0 ? "#00CC00" : "red",
                fontWeight: "500",
              }}
            >
              {renderSumPriceBookTable()}đ
            </span>
          </span>
        </div>
        {props?.bookTable?.timeBookTable !== "null" && (
          <React.Fragment>
            <div
              style={{
                fontSize: sizes?.width < 786 ? 12 : 16,
                fontWeight: "500",
              }}
            >
              <span>Người đặt bàn : </span>
              <span style={{ color: "red" }}>{props?.bookTable?.nameUser}</span>
            </div>
            <div
              style={{
                fontSize: sizes?.width < 786 ? 12 : 16,
                fontWeight: "500",
                margin: "10px 0",
              }}
            >
              <span>Thời gian đặt bàn : </span>
              <span style={{ color: "red" }}>
                {props?.bookTable?.timeBookTable}
              </span>
            </div>
            <div
              style={{
                fontSize: sizes?.width < 786 ? 12 : 16,
                fontWeight: "500",
                marginBottom: 10,
              }}
            >
              <span>Số lượng : </span>
              <span style={{ color: "red" }}>{props?.bookTable?.amount}</span>
            </div>
          </React.Fragment>
        )}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              width: "40%",
              fontSize: sizes?.width < 786 ? 12 : 16,
              fontWeight: "500",
            }}
          >
            Chuyển đến bàn
          </span>{" "}
          <Select
            style={{
              width: "60%",
              fontSize: sizes?.width < 786 ? 11 : 13,
            }}
            value={
              selectTransferTable == undefined
                ? moveTables._id
                : selectTransferTable
            }
            placeholder="Chọn bàn muốn chuyển"
            onChange={(e) => setSelectTransferTable(e)}
          >
            {moveTables?.map((item) => {
              return (
                <Select.Option
                  key={item._id}
                  value={item._id}
                  style={{
                    fontSize: sizes?.width < 786 ? 11 : 13,
                  }}
                >
                  {item.name}
                </Select.Option>
              );
            })}
          </Select>
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
            onClick={() => (props?.hideBookTable(), setSelectTransferTable())}
            type="primary"
            style={{
              background: "red",
              border: 0,
              marginRight: 10,
              padding: "3px 10px",
              fontSize: sizes?.width < 786 ? 11 : 13,
            }}
          >
            Đóng
          </Button>
          {loading == true ? (
            <Spin size={33} />
          ) : (
            <Button
              onClick={() => cancelReservation()}
              type="primary"
              style={{
                border: 0,
                padding: "3px 10px",
                fontSize: sizes?.width < 786 ? 11 : 13,
              }}
            >
              Chuyển bàn
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoveTable;
