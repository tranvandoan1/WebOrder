import { Button, message, Space,Table } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllTable,
  removeTable,
} from "./../../features/TableSlice/TableSlice";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
const ListTable = () => {
  const dispatch = useDispatch();
  const tables = useSelector((data) => data.table.value);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    dispatch(getAllTable());
  }, []);
  const deleteCate = async (id) => {
    if (confirm("Bạn có muốn xóa không ?")) {
      setLoading(true);
      await dispatch(removeTable(id));
      setLoading(false);
      message.success("Xóa thành công");
    }
  };
  const columns = [
    {
      title: "Tên bàn",
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
      render: (data) => (
        <>
          <Space size="middle" style={{ marginRight: 10 }}>
            <Link to={`/manager/table/edit/${data._id}`}>
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
  return (
    <div>
      <div
        className="header"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <h3>Bàn</h3>
        <Button type="primary">
          <Link to="add">Thêm bàn</Link>
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
        loading={loading}
        rowKey={(item) => item._id}
        style={{ textAlign: "center" }}
        dataSource={tables}
        bordered
      />
    </div>
  );
};

export default ListTable;
