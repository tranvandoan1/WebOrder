import { Button, Spin, Select, message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import styles from "../css/Home.module.css";
import {
  changeTables,
  getAllSaveOrder,
} from "../features/saveorderSlice/saveOrderSlice";
import { editMoveTable } from "../features/TableSlice/TableSlice";

const MoveTable = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const saveorders = useSelector((data) => data.saveorder.value);
  const [loading, setLoading] = useState(false);
  const [selectTransferTable, setSelectTransferTable] = useState();
  useEffect(() => {
    dispatch(getAllSaveOrder());
  }, []);
  // chuyển bàn
  const cancelReservation = async (item) => {
    if (selectTransferTable == undefined) {
      message.warning("Bạn chưa chọn bàn để chuyển !");
    } else {
      const id = [];
      saveorders?.map((itemm) => {
        if (itemm.id_table == item._id) {
          id.push(itemm._id);
        }
      });
      if (item.timeBookTable == "null") {
        const data = {
          id: id,
          id_table: selectTransferTable,
        };
        setLoading(true);
        await dispatch(changeTables(data));
        setLoading(false);
      } else {
        const data = {
          id: id,
          id_table: selectTransferTable,
        };
        const uploadTable = {
          idStart: props.bookTable._id,
          idEnd: selectTransferTable,
          timeBookTableStart: "null",
          amountStart: 0,
          nameUserStart: "",
          timeBookTableEnd: props?.bookTable.timeBookTable,
          amountEnd: props?.bookTable.amount,
          nameUserEnd: props?.bookTable.nameUser,
        };
        setLoading(true);
        await dispatch(changeTables(data));
        await dispatch(editMoveTable(uploadTable));
        setLoading(false);
      }

      props?.hideInfoBookTable(), setSelectTransferTable();
      message.success("Chuyển bàn thành công");
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

  const moveTables = props?.checkSaveOrder.filter((item) => {
    if (item.timeBookTable == "null" && item.data.length <= 0) {
      return item;
    }
  });
  return (
    <div
      className={styles.info_book_table}
      style={
        props?.bookTable?._id !== undefined
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
          Chuyển bàn
        </h4>

        <div style={{ fontSize: 16, fontWeight: "500" }}>
          <span>Bàn chuyển : </span>
          <span style={{ color: "red" }}>{props?.bookTable?.name}</span>
        </div>
        <div
          style={{
            fontSize: 16,
            fontWeight: "500",
            margin: "10px 0",
          }}
        >
          <span>Tổng số tiền : </span>
          <span style={{ color: "red" }}>
            {props?.checkSaveOrder?.map((check, index) => {
              if (check._id == props?.bookTable?._id) {
                return (
                  <span
                    key={index}
                    style={{
                      fontSize: 17,
                      color: check.data.length > 0 ? "#00CC00" : "red",
                      fontWeight: "500",
                    }}
                  >
                    {renderSumPriceBookTable(check)}đ
                  </span>
                );
              }
            })}
          </span>
        </div>

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
              fontSize: 16,
              fontWeight: "500",
            }}
          >
            Chuyển đến bàn
          </span>{" "}
          <Select
            style={{
              width: "60%",
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
                <Select.Option key={item._id} value={item._id}>
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
            onClick={() => (
              props?.hideInfoBookTable(), setSelectTransferTable()
            )}
            type="primary"
            style={{
              background: "red",
              border: 0,
              marginRight: 10,
            }}
          >
            Đóng
          </Button>
          {loading == true ? (
            <Spin size={33} />
          ) : (
            <Button
              onClick={() => cancelReservation(props?.bookTable)}
              type="primary"
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
