import React, { useState, useEffect } from "react";
import { Bar } from "@ant-design/plots";
import styles from "../../../css/CssAdmin.module.css";
import { BarChartOutlined, EyeOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrder } from "../../../features/Order/Order";
import { Row, Select, Statistic } from "antd";
import Month from "./Month";
import moment from "moment";
import SelectTime from "./SelectTime";
import "../../../css/Home.css";
import styles1 from "../../../css/Home.module.css";
import Year from "./Year";
import { Size } from "../../../components/size";
const { Option } = Select;

const List = () => {
  const sizes = Size();
  const user = JSON.parse(localStorage.getItem("user"));
  const dispatch = useDispatch();
  const [check, setCheck] = useState("today");
  const [detailStatistic, setDetailStatistic] = useState(false);
  const orders = useSelector((data) => data.order);
  useEffect(() => {
    dispatch(getAllOrder());
  }, []);

  const date = moment().date();
  const month = moment().month();
  const year = moment().year();
  const list = () => {
    let order = [];

    orders?.value.filter((item) => {
      if (item.user_id == user._id) {
        const time = new Date(item.createdAt);
        if (
          check == "today"
            ? date == time.getDate() &&
              month + 1 == time.getMonth() + 1 &&
              year == time.getFullYear()
            : check == "thisMonth"
            ? month + 1 == time.getMonth() + 1 && year == time.getFullYear()
            : check == "thisYear"
            ? year == time.getFullYear()
            : check == "yesterDay"
            ? date == time.getDate() - 1 &&
              month + 1 == time.getMonth() + 1 &&
              year == time.getFullYear()
            : check == "lastMonth"
            ? month == time.getMonth() + 1 && year == time.getFullYear()
            : year - 1 == time.getFullYear()
        ) {
          order.push(item);
        }
      }
    });
    // tính tổng tiền
    let sum = 0;
    for (let i = 0; i < order.length; i++) {
      sum += Math.ceil(order[i].sumPrice * ((100 - order[i].sale) / 100));
    }

    const data = [
      {
        day:
          check == "today"
            ? "Hôm nay"
            : check == "thisMonth"
            ? "Tháng này"
            : check == "thisYear"
            ? "Năm nay"
            : check == "yesterDay"
            ? "Hôm qua"
            : check == "lastMonth"
            ? "Tháng trước"
            : check == "lastYear"
            ? "Năm trước"
            : " ",
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
      tooltip: {
        customContent: (title, items) => {
          return (
            <>
              <h6 style={{ marginTop: 10, fontSize: 13 }}>{title}</h6>
              <ul style={{ paddingLeft: 0 }}>
                {items?.map((item, index) => {
                  const { value, color } = item;
                  return (
                    <li
                      key={item.year}
                      className="g2-tooltip-list-item"
                      data-index={index}
                      style={{
                        marginBottom: 4,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <span
                        className="g2-tooltip-marker"
                        style={{ backgroundColor: color }}
                      ></span>
                      <span
                        style={{
                          display: "inline-flex",
                          flex: 1,
                          justifyContent: "space-between",
                        }}
                      >
                        <span style={{ margiRight: 16 }}>
                          Tiền :{" "}
                          {value
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{" "}
                          VNĐ
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </>
          );
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
    return (
      <>
        <Row>
          <div
            style={{ display: "flex", alignItems: "center" }}
            className="statistic"
          >
            <Statistic
              title={
                <span style={{ fontSize: sizes.width < 768 ? 15 : 20 }}>
                  {check == "today"
                    ? "Hôm nay"
                    : check == "thisMonth"
                    ? "Tháng này"
                    : check == "thisYear"
                    ? "Năm nay"
                    : check == "yesterDay"
                    ? "Hôm qua"
                    : check == "lastMonth"
                    ? "Tháng trước"
                    : check == "lastYear"
                    ? "Năm trước"
                    : " "}
                </span>
              }
              value={`${
                check == "lastYear"
                  ? `${moment().year() - 1} `
                  : `${moment().year()}${check !== "thisYear" ? "-" : " "}`
              }${
                check == "today" || check == "thisMonth" || check == "yesterDay"
                  ? `${
                      String(moment().month() + 1).length == 1
                        ? `0${moment().month() + 1}`
                        : moment().month() + 1
                    }${check !== "thisMonth" ? "-" : ""}`
                  : ""
              }${
                check == "today"
                  ? `${moment().date()}`
                  : check == "yesterDay"
                  ? `${moment().date() - 1}`
                  : check == "lastMonth"
                  ? `${
                      String(moment().month()).length == 1
                        ? `0${moment().month()}`
                        : moment().month()
                    }`
                  : ""
              }`}
            />
            <Statistic
              title={
                <span style={{ fontSize: sizes.width < 768 ? 15 : 20 }}>
                  Doanh thu
                </span>
              }
              value={`${sum}`}
              suffix="VNĐ"
              style={{
                margin: "0 32px",
              }}
            />
          </div>
          {(check == "thisMonth" ||
            check == "thisYear" ||
            check == "lastMonth" ||
            check == "lastYear") && (
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
        {sum == 0 ? (
          <span className={styles.noData}>Chưa có doanh thu</span>
        ) : (
          <Bar {...config} style={{ height: 80 }} />
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

  return (
    <div>
      <div className={styles.statistical}>
        <div className={styles.title}>
          <h5 style={{ display: "flex", alignItems: "center", fontSize: 18 }}>
            <BarChartOutlined
              style={{ fontSize: 30, color: "cadetblue", marginRight: 10 }}
            />{" "}
            Doanh số
          </h5>
          <Select
            defaultValue="today"
            style={{ width: 120 }}
            onChange={handleChange}
          >
            <Option value="today">Hôm nay</Option>
            <Option value="thisMonth">Tháng này</Option>
            <Option value="thisYear">Năm nay</Option>
            <Option value="yesterDay">Hôm qua</Option>
            <Option value="lastMonth">Tháng trước</Option>
            <Option value="lastYear">Năm trước</Option>
            <Option value="selectDay">Chọn</Option>
          </Select>
        </div>
        <hr style={{ background: "rgb(161, 161, 161)", height: 0.5 }} />

        {check == "today" ||
        check == "thisMonth" ||
        check == "thisYear" ||
        check == "yesterDay" ||
        check == "lastMonth" ||
        check == "lastYear" ? (
          list()
        ) : check == "selectDay" ? (
          <SelectTime />
        ) : (
          ""
        )}
      </div>
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
              overflowX: "auto",
              padding: 20,
            }}
            className={styles.statisticsMonth}
          >
            {check == "thisMonth" || check == "lastMonth" ? (
              <Month check={check} />
            ) : check == "thisYear" || check == "lastYear" ? (
              <Year check={check} />
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default List;
