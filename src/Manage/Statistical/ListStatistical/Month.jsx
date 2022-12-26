import { Bar } from "@ant-design/plots";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { getAllOrder } from "../../../features/Order/Order";
import { Row, Statistic } from "antd";
import styles from "../../../css/CssAdmin.module.css";

const Month = (props) => {
  const dispatch = useDispatch();
  const orders = useSelector((data) => data.order.value);
  const month =
    props?.check == "thisMonth"
      ? moment().month() + 1
      : props?.check == "lastMonth"
      ? moment().month()
      : props?.check;
  const year = moment().year();
  useEffect(() => {
    dispatch(getAllOrder());
  }, []);

  const dateOfMonth = Array.from(
    {
      length: moment(
        `${moment().year()}-${
          String(moment().month() + 1).length == 1
            ? `0${moment().month() + 1}`
            : moment().month() + 1
        }`
      ).daysInMonth(),
    },
    (v, k) => k + 1
  );

  const list = () => {
    const dataOrder = [];

    orders.filter((item) => {
      const time = new Date(item.createdAt);
      if (time.getFullYear() == year && time.getMonth() + 1 == month) {
        dataOrder.push({
          day: `Ngày ${time.getDate()}`,
          price: item.sumPrice,
          time: time.getDate(),
        });
      }
    });

    // lấy cách ngày không có đơn
    const emptyDay = [];
    function getDifference(array1, array2) {
      return array1.filter((object1) => {
        return !array2.some((object2) => {
          return object1 === object2.time;
        });
      });
    }
    getDifference(dateOfMonth, dataOrder).map((item) =>
      emptyDay.push({ day: `Ngày ${item}`, price: 0, time: item })
    );
    // sắp xếp các ngày theo tứ tự tăng dần
    const data = [...dataOrder, ...emptyDay];
    data?.sort((a, b) => {
      return a.time - b.time;
    });

    // tính tổng tiền
    let orderPrice = [];

    orders.filter((item) => {
      const time = new Date(item.createdAt);
      if (time.getFullYear() == year && time.getMonth() + 1 == month) {
        orderPrice.push(item);
      }
    });

    let sum = 0;
    for (let i = 0; i < orderPrice.length; i++) {
      sum += Math.ceil(
        orderPrice[i].sumPrice * ((100 - orderPrice[i].sale) / 100)
      );
    }
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
                  const { name, value, color } = item;
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
          return "";
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
          <Statistic
            title={
              props?.check == "thisMonth"
                ? "Tháng này"
                : props?.check == "lastMonth"
                ? "Tháng trước"
                : `Tháng ${props.check}`
            }
            value={`${moment().year()}-${
              props?.check == "thisMonth"
                ? String(moment().month() + 1).length == 1
                  ? `0${moment().month() + 1}`
                  : moment().month() + 1
                : props?.check == "lastMonth"
                ? String(moment().month()).length == 1
                  ? `0${moment().month()}`
                  : moment().month()
                : `${props?.check}`
            }`}
          />
          <Statistic
            title="Doanh thu"
            value={`${sum}`}
            suffix="VNĐ"
            style={{
              margin: "0 32px",
            }}
          />
        </Row>

        <br />
        {sum == 0 ? (
          <span className={styles.noData}>Chưa có doanh thu</span>
        ) : (
          <div
            style={{
              height: "100%",
            }}
            className={styles.statisticsMonth}
          >
            <Bar {...config} style={{ height: 1500 }} />
          </div>
        )}
      </>
    );
  };
  return <div>{list()}</div>;
};

export default Month;
