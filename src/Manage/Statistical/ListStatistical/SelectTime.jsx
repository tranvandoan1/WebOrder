import { DatePicker, Row, Select, Statistic } from "antd";
import React, { useEffect, useState } from "react";
import styles from "../../../css/CssAdmin.module.css";
import { Bar } from "@ant-design/plots";
import { useSelector, useDispatch } from "react-redux";
import { getAllOrder } from "./../../../features/Order/Order";
import moment from "moment";
import Year from "./Year";
import Month from "./Month";
import styles1 from "../../../css/Home.module.css";
import { EyeOutlined } from "@ant-design/icons";
const SelectTime = () => {
  const dipsatch = useDispatch();
  const orders = useSelector((data) => data.order.value);
  const [detailStatistic, setDetailStatistic] = useState(false);
  const [date, setDate] = useState();
  const [check, setCheck] = useState();

  const datee = moment().date();
  const month = moment().month() + 1;
  const year = moment().year();

  useEffect(() => {
    dipsatch(getAllOrder());
  }, []);

  const onChange = (date, dateString) => {
    if (String(dateString).length <= 0) {
      setDate();
    } else {
      setDate(dateString);
    }
  };
  const list = () => {
    const timeSelect = new Date(date);

    const order = orders.filter((item) => {
      const time = new Date(item.createdAt);
      if (
        check == 1
          ? time.getDate() == timeSelect.getDate() &&
            time.getMonth() + 1 == timeSelect.getMonth() + 1 &&
            time.getFullYear() == timeSelect.getFullYear()
          : check == 2
          ? time.getMonth() + 1 == timeSelect.getMonth() + 1 &&
            time.getFullYear() == timeSelect.getFullYear()
          : time.getFullYear() == timeSelect.getFullYear()
      ) {
        return item;
      }
    });
    let sum = 0;
    for (let i = 0; i < order.length; i++) {
      sum += Math.ceil(order[i].sumPrice * ((100 - order[i].sale) / 100));
    }

    const data = [
      {
        day: `${
          check == 1
            ? `Ngày ${timeSelect.getDate()}`
            : check == 2
            ? `Tháng ${timeSelect.getMonth() + 1}`
            : `Năm ${timeSelect.getFullYear()}`
        }`,
        price: sum,
      },
    ];
    const config = {
      data,
      xField: "price",
      yField: "day",
      barWidthRatio: 0.6,
      legend: false,
      seriesField: "",
      meta: {
        price: {
          alias: "Tiền",
        },
      },
      label: {
        content: (data) => {
          return `${data.price.toLocaleString("vi-VN")} VNĐ`;
        },
        offset: 10,
        position: "middle",

        style: {
          fill: "#FFFFFF",
          opacity: 1,
          fontWeight: "600",
        },
      },

      minBarWidth: 20,
      maxBarWidth: 20,
    };
    const selectTime = new Date(date);
    return (
      <>
        <Row>
          <Statistic
            title={`${check == 1 ? "Ngày" : check == 2 ? "Tháng" : "Năm"} chọn`}
            value={
              check == 2
                ? selectTime.getFullYear() == year &&
                  selectTime.getMonth() + 1 == month
                  ? "Tháng này"
                  : `${selectTime.getFullYear()}-${
                      String(selectTime.getMonth() + 1).length == 1
                        ? `0${selectTime.getMonth() + 1}`
                        : selectTime.getMonth() + 1
                    }`
                : check == 3
                ? selectTime.getFullYear() == year
                  ? "Năm nay"
                  : `${selectTime.getFullYear()} `
                : selectTime.getFullYear() == year &&
                  selectTime.getMonth() + 1 == month &&
                  selectTime.getDate() == datee
                ? "Hôm nay"
                : date
            }
          />
          <Statistic
            title="Doanh thu"
            value={`${sum}`}
            suffix="VNĐ"
            style={{
              margin: "0 32px",
            }}
          />
          {(check == 2 ||
            check == "thisYear" ||
            check == "lastMonth" ||
            check == 3) &&
            sum !== 0 && (
              <div className="detail">
                <Statistic
                  title="Xem chi tiết"
                  value=""
                  suffix={
                    <span style={{ cursor: "pointer" }}>
                      <EyeOutlined
                        style={{ color: "yellowgreen" }}
                        onClick={() => setDetailStatistic(true)}
                      />
                    </span>
                  }
                />
              </div>
            )}
        </Row>
        <br />
        {sum !== 0 ? (
          <Bar {...config} style={{ height: 80 }} />
        ) : (
          <span style={{ color: "red", fontSize: 18, fontWeight: "500" }}>
            {" "}
            Chưa có doanh số
          </span>
        )}
      </>
    );
  };
  const handleChange = (value) => {
    setCheck(value);
  };
  window.addEventListener("click", function (e) {
    if (e.target == document.getElementById("book_table")) {
      setDetailStatistic(false);
    }
  });
  const time = new Date(date);

  return (
    <>
      Xem doanh số theo :{" "}
      <Select
        style={{
          width: 120,
          marginRight: 20,
          marginBottom: 20,
        }}
        onChange={handleChange}
        placeholder="Chọn"
      >
        <Select.Option value="1">Ngày</Select.Option>
        <Select.Option value="2">Tháng</Select.Option>
        <Select.Option value="3">Năm</Select.Option>
      </Select>
      {check !== undefined && (
        <>
          Chọn {check == 1 ? "ngày" : check == 2 ? "tháng" : "năm"} :{" "}
          <DatePicker
            onChange={onChange}
            picker={check == 1 ? "" : check == 2 ? "month" : "year"}
          />
        </>
      )}
      {date !== undefined && list()}
      <div
        id="book_table"
        className={styles1.info_book_table}
        style={
          detailStatistic == true
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
            width: 1000,
            borderRadius: 2,
            overflow: "hidden",
            height: 600,
          }}
          className={styles1.table_book_table}
        >
          <div
            style={{
              height: "100%",
              overflow: "scroll",
              padding: 20,
            }}
            className={styles.statisticsMonth}
          >
            {check == 2 ? (
              <Month check={time.getMonth() + 1} />
            ) : check == 3 ? (
              <Year check={time.getFullYear()} />
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SelectTime;
