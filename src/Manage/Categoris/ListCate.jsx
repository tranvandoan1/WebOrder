import React, { useState, useEffect } from "react";
import { Table, Button, Space, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  getCategori,
  removeCategori,
} from "../../features/Categoris/CategoriSlice";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
const ListCate = () => {
  const categoris = useSelector((data) => data.categori);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCategori());
  }, []);
  const columns = [
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Thao tác",
      key: "data._id",
      render: (data) => (
        <>
          <Space size="middle" style={{ marginRight: 10 }}>
            <Link to={`/manager/categoris/edit/${data._id}`}>
              <EditOutlined />
            </Link>
          </Space>
          <Space size="middle">
            <a>
              <DeleteOutlined onClick={() => deleteCate(data._id)} />
            </a>
          </Space>
        </>
      ),
    },
  ];
  const deleteCate = async (data) => {
    if (confirm("Bạn có muốn xóa không ?")) {
      setLoading(true);
      await dispatch(removeCategori(data));
      setLoading(false);
      message.success("Xóa thành công");
    }
  };

  return (
    <>
      <div
        className="header"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <h3>Danh mục</h3>{" "}
        <Button type="primary">
          <Link to="add">Thêm danh mục</Link>
        </Button>
      </div>
      <hr
        style={{
          color: "rgb(165, 165, 165)",
          marginBottom: 20,
          marginTop: 0,
        }}
      />
      <Table
        columns={columns}
        loading={
          loading ||
          (categoris?.value.length <= 0 && categoris?.checkData == false)
            ? true
            : false
        }
        rowKey="_id"
        bordered
        style={{ textAlign: "center" }}
        dataSource={categoris.value.slice().reverse()}
      />
    </>
  );
};

export default ListCate;
