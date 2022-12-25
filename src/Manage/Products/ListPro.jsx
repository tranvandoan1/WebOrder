import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteProduct,
  getProductAll,
} from "../../features/ProductsSlice/ProductSlice";
import { getCategori } from "../../features/Categoris/CategoriSlice";
import { Table, Space, Button, message } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import "../../css/Home.css";
import { Link } from "react-router-dom";
const ListPro = () => {
  const products = useSelector((data) => data.product);
  const categoris = useSelector((data) => data.categori.value);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getProductAll());
    dispatch(getCategori());
  }, []);

  const removePro = async (id) => {
    if (confirm("Bạn có muốn xóa không ?")) {
      setLoading(true);
      await dispatch(deleteProduct(id));
      setLoading(false);
      message.success("Xóa thành công");
    }
  };

  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: 1,
      width: 200,
    },
    {
      title: "Danh mục ",
      dataIndex: "cate_id",
      render: (cate_id) =>
        categoris.map((item) => item._id == cate_id && item.name),
      key: 2,
    },
    {
      title: "Ảnh ",
      dataIndex: "photo",
      render: (photo) => <img src={photo} style={{ width: "80px" }} alt="" />,
      key: 3,
    },
    {
      title: "Giá tiền ",
      dataIndex: "price",
      render: (price, data) =>
        `${price.toLocaleString("vi-VN")}${
          data.check == true ? `/KG` : `/${data.dvt}`
        }`,
      key: 4,
    },

    {
      title: "Thao tác",
      dataIndex: "_id",
      key: 5,
      render: (_id, product) => (
        <Space size="middle">
          <Link to={`/manager/products/edit/${_id}`}>
            <EditOutlined style={{ cursor: "pointer" }} />
          </Link>
          <DeleteOutlined
            style={{ cursor: "pointer" }}
            onClick={() => removePro(_id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <>
      <div
        className="header"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <h3>Sản phẩm</h3>{" "}
        <Button type="primary">
          <Link to="add">Thêm sản phẩm</Link>
        </Button>
      </div>
      <hr style={{ color: "rgb(165, 165, 165)" }} />

      <Table
        rowKey="_id"
        columns={columns}
        loading={
          loading ||
          (products?.value.length <= 0 && products?.checkData == false)
            ? true
            : false
        }
        style={{ textAlign: "center" }}
        dataSource={products.value.slice().reverse()}
      />
    </>
  );
};

export default ListPro;
