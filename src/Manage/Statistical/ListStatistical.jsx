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
const ListStatistical = () => {
  const dispatch = useDispatch();
  const allData = useSelector((data) => data.allData.value);
  useEffect(() => {
    dispatch(getAll());
  }, []);

  const listOrder = () => {
    if (allData.products !== undefined) {
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
    <div style={{ background: "#fff", height: "100vh" }}>
      {allData?.products?.length == undefined ? (
        <div
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spin size="large" />
        </div>
      ) : (
        <React.Fragment>
          <div className={styles.title}>
            <h5 style={{ display: "flex", alignItems: "center", fontSize: 18 }}>
              <HddOutlined
                style={{ fontSize: 30, color: "chocolate", marginRight: 10 }}
              />{" "}
              Thống kê
            </h5>
          </div>
          <hr style={{ background: "rgb(161, 161, 161)", height: 0.5 }} />

          <div className="list">
            <Row>
              <Col xs={12} sm={4} md={12} lg={8} xl={6}>
                <Link to="/manager/table">
                  <div className={styles.list_cate}>
                    <FileTextOutlined
                      style={{
                        marginRight: 10,
                        fontSize: 30,
                        color: "chocolate",
                      }}
                    />{" "}
                    Danh mục :{" "}
                    {allData.categoris !== undefined &&
                      allData.categoris.length}
                  </div>
                </Link>
              </Col>
              <Col xs={12} sm={4} md={12} lg={8} xl={6}>
                <Link to="/manager/products">
                  <div className={styles.list_cate}>
                    <FaProductHunt
                      style={{
                        color: "chocolate",
                        fontSize: 30,
                        marginRight: 10,
                      }}
                    />
                    Sản phẩm :{" "}
                    {allData.products !== undefined && allData.products.length}
                  </div>
                </Link>
              </Col>
              <Col xs={12} sm={4} md={12} lg={8} xl={6}>
                <Link to="/manager/order">
                  <div className={styles.list_cate}>
                    <FaOpencart
                      style={{
                        color: "chocolate",
                        fontSize: 30,
                        marginRight: 10,
                      }}
                    />
                    Đơn hôm nay : {listOrder() !== undefined && listOrder()}
                  </div>
                </Link>
              </Col>
              <Col xs={12} sm={4} md={12} lg={8} xl={6}>
                <Link to="/manager/table">
                  <div className={styles.list_cate}>
                    <FaTable
                      style={{
                        color: "chocolate",
                        fontSize: 30,
                        marginRight: 10,
                      }}
                    />
                    Số lượng bàn :{" "}
                    {allData.tables !== undefined && allData.tables.length}
                  </div>
                </Link>
              </Col>
            </Row>
          </div>
          <br />
          <List />
        </React.Fragment>
      )}
    </div>
  );
};

export default ListStatistical;
