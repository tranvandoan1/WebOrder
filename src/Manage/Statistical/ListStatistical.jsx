import { HddOutlined, FileTextOutlined } from "@ant-design/icons";
import React, { useEffect } from "react";
import List from "./ListStatistical/List";
import styles from "../../css/CssAdmin.module.css";
import { useDispatch, useSelector } from "react-redux";
import { Col, Row, Spin } from "antd";
import { getAll } from "../../features/AllDataSlice/AllDataSlice";
import moment from "moment";
import { Link } from "react-router-dom";
import { FaProductHunt, FaOpencart, FaTable } from "react-icons/fa";
import { Size } from "../../components/size";
const ListStatistical = () => {
  const sizes = Size();
  const dispatch = useDispatch();
  const allData = useSelector((data) => data.allData.value);
  useEffect(() => {
    dispatch(getAll());
  }, []);
  const listOrder = () => {
    if (allData?.orders !== undefined) {
      let orders = [];
      allData.orders.filter((item) => {
        const time = new Date(item.createdAt);
        if (
          `${time.getDate()}-${time.getMonth() + 1}-${time.getFullYear()}` ==
          `${moment().date()}-${moment().month() + 1}-${moment().year()}`
        ) {
          orders.push(item);
        }
      });
      return orders.length;
    }
  };
  return (
    <div style={{ background: "#fff", flex: 1 }}>
      <React.Fragment>
        <div className={styles.title}>
          <h5 style={{ display: "flex", alignItems: "center", fontSize: 18 }}>
            <HddOutlined
              style={{
                fontSize: sizes.width < 768 ? 20 : 30,
                color: "chocolate",
                marginRight: 10,
              }}
            />{" "}
            Thống kê
          </h5>
        </div>
        <hr style={{ background: "rgb(161, 161, 161)", height: 0.5 }} />

        <div className="list">
          <Row>
            <Col xs={12} sm={4} md={12} lg={8} xl={6}>
              <Link to="/manager/table">
                <div
                  className={styles.list_cate}
                  style={{ fontSize: sizes.width < 768 ? 10 : 15, height: 50 }}
                >
                  <FileTextOutlined
                    style={{
                      marginRight: 10,
                      fontSize: sizes.width < 768 ? 10 : 30,
                      color: "chocolate",
                    }}
                  />{" "}
                  Danh mục :{" "}
                  {allData.categoris !== undefined ? (
                    allData.categoris.length
                  ) : (
                    <Spin style={{ marginLeft: 10 }} />
                  )}
                </div>
              </Link>
            </Col>
            <Col xs={12} sm={4} md={12} lg={8} xl={6}>
              <Link to="/manager/products">
                <div
                  className={styles.list_cate}
                  style={{ fontSize: sizes.width < 768 ? 10 : 15, height: 50 }}
                >
                  <FaProductHunt
                    style={{
                      color: "chocolate",
                      fontSize: sizes.width < 768 ? 20 : 30,
                      marginRight: 10,
                    }}
                  />
                  Sản phẩm :{" "}
                  {allData.products !== undefined ? (
                    allData.products.length
                  ) : (
                    <Spin style={{ marginLeft: 10 }} />
                  )}
                </div>
              </Link>
            </Col>
            <Col xs={12} sm={4} md={12} lg={8} xl={6}>
              <Link to="/manager/order">
                <div
                  className={styles.list_cate}
                  style={{ fontSize: sizes.width < 768 ? 10 : 15, height: 50 }}
                >
                  <FaOpencart
                    style={{
                      color: "chocolate",
                      fontSize: sizes.width < 768 ? 20 : 30,
                      marginRight: 10,
                    }}
                  />
                  Đơn hôm nay :{" "}
                  {listOrder() !== undefined ? (
                    listOrder()
                  ) : (
                    <Spin style={{ marginLeft: 10 }} />
                  )}
                </div>
              </Link>
            </Col>
            <Col xs={12} sm={4} md={12} lg={8} xl={6}>
              <Link to="/manager/table">
                <div
                  className={styles.list_cate}
                  style={{ fontSize: sizes.width < 768 ? 10 : 15, height: 50 }}
                >
                  <FaTable
                    style={{
                      color: "chocolate",
                      fontSize: sizes.width < 768 ? 20 : 30,
                      marginRight: 10,
                    }}
                  />
                  Số lượng bàn :{" "}
                  {allData.tables !== undefined ? (
                    allData.tables.length
                  ) : (
                    <Spin style={{ marginLeft: 10 }} />
                  )}
                </div>
              </Link>
            </Col>
          </Row>
        </div>
        <br />
        <List />
      </React.Fragment>
    </div>
  );
};

export default ListStatistical;
