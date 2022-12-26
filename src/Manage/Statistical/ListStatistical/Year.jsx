import { Bar } from "@ant-design/plots";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { getAllOrder } from "./../../../features/Order/Order";
import { Row, Statistic } from "antd";
import styles from "../../../css/CssAdmin.module.css";

const Year = (props) => {
  const dispatch = useDispatch();
  const orders = useSelector((data) => data.order.value);

  const year =
    props?.check == "thisYear"
      ? moment().year()
      : props?.check == "lastYear"
      ? moment().year() - 1
      : props?.check;
  useEffect(() => {
    dispatch(getAllOrder());
  }, []);

  const monthOfYear = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  const list = () => {
    const dataOrder = [];

    orders.filter((item) => {
      const time = new Date(item.createdAt);
      if (time.getFullYear() == year) {
        dataOrder.push({
          price: item.sumPrice,
          time: time.getMonth() + 1,
          sale: item.sale,
        });
      }
    });

    const orderFindYear = [];
    monthOfYear.map((item) => {
      const data = dataOrder.filter((itemm) => itemm.time == item);
      orderFindYear.push(data);
    });
    // tính tổng tiền các tháng
    const data = [];
    orderFindYear.map((item, index) => {
      if (item.lenght <= 0) {
        data.push({ day: index + 1, price: 0 });
      } else {
        let sum = 0;
        for (let i = 0; i < item.length; i++) {
          sum += Math.ceil(item[i].price * ((100 - item[i].sale) / 100));
        }
        data.push({ day: `Tháng ${index + 1}`, price: sum });
      }
    });

    // tính tổng tiền
    let sum = 0;
    for (let i = 0; i < dataOrder.length; i++) {
      sum += Math.ceil(dataOrder[i].price * ((100 - dataOrder[i].sale) / 100));
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
              props?.check == "thisYear"
                ? "Năm nay"
                : props?.check == "lastYear"
                ? "Năm trước"
                : `Năm ${props?.check}`
            }
            value={
              props?.check == "thisYear"
                ? `${year} `
                : props?.check == "lastYear"
                ? `${year} `
                : `${props?.check} `
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

export default Year;
