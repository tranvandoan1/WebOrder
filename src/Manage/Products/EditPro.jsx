import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../css/LayoutAdmin.module.css";
import { Alert, Button, Form, Input, Select, Spin, Switch, Upload } from "antd";
import { getProductAll } from "../../features/ProductsSlice/ProductSlice";
import { getCategori } from "../../features/Categoris/CategoriSlice";
import { uploadProduct } from "./../../features/ProductsSlice/ProductSlice";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../firebase";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};
const EditPro = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [check, setCheck] = useState(false);
  const products = useSelector((data) => data.product.value);
  const product = products?.find((item) => item._id == id);
  const categoris = useSelector((data) => data.categori.value);
  const [photo, setPhoto] = useState();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    dispatch(getProductAll());
    dispatch(getCategori());
  }, []);
  const uploadTable = async (value) => {
    setCheck(true);
    const productNew = {
      cate_id: value.cate_id == undefined ? product?.cate_id : value.cate_id,
      dvt: value.dvt == undefined ? product?.dvt : value.dvt,
      name: value.name == undefined ? product?.name : value.name,
      price: value.price == undefined ? product?.price : value.price,
      user_id: product?.user_id,
      check: value.check == undefined ? product?.check : value.check,
    };
    if (photo == undefined) {
      await dispatch(
        uploadProduct({
          id: product?._id,
          data: {
            ...productNew,
            photo: product?.photo,
          },
        })
      );
      navigate("/manager/products");
      message.success("Sửa thành công");
      setCheck(false);
    } else {
      const imageRef = ref(storage, `images/${photo.file.name}`);
      setLoading(true);
      uploadBytes(imageRef, photo.file).then(() => {
        getDownloadURL(imageRef).then(async (url) => {
          await dispatch(
            uploadProduct({
              id: product?._id,
              data: {
                ...productNew,
                photo: url,
              },
            })
          );
          navigate("/manager/products");
          message.success("Sửa thành công");
          setCheck(false);
        });
      });
    }
  };

  const UploadAvatatr = (file) => {
    setLoading(false);
    const src = URL.createObjectURL(file);
    setPhoto({ url: src, file: file });
    setLoading(false);
  };
  return (
    <div>
      <h5 className={styles.title}>
        Sửa sản phẩm{" "}
        {check == true && (
          <Spin tip="Loading...">
            <Alert message="Đang sửa..." type="info" />
          </Spin>
        )}
      </h5>
      {products?.length <= 0 ? (
        <Spin />
      ) : (
        <Form {...formItemLayout} onFinish={uploadTable}>
          <Form.Item name="name" label="Tên sản phẩm" labelAlign="left">
            <Input defaultValue={product?.name} />
          </Form.Item>
          <Form.Item name="price" label="Giá" labelAlign="left">
            <Input defaultValue={product?.price} />
          </Form.Item>
          <Form.Item name="cate_id" label="Danh mục" labelAlign="left">
            <Select
              placeholder="Chọn danh mục"
              defaultValue={product?.cate_id}
              style={{ textTransform: "capitalize" }}
            >
              {categoris?.map((item) => (
                <Select.Option
                  value={item._id}
                  key={item}
                  style={{ textTransform: "capitalize" }}
                >
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <div style={{ width: "20%" }}>
                <h5 style={{ fontSize: 16, fontWeight: "400" }}>Ảnh : </h5>
              </div>
              <div style={{ width: "80%" }}>
                <Upload
                  listType="picture-card"
                  showUploadList={false}
                  beforeUpload={UploadAvatatr}
                >
                  <div>
                    <div>
                      {loading == true ? (
                        <Spin />
                      ) : (
                        <div
                          style={{
                            position: "relative",
                            overflow: "hidden",
                            width: 100,
                            height: 100,
                          }}
                        >
                          <img
                            src={
                              photo == undefined ? product?.photo : photo.url
                            }
                            className="image"
                            style={{
                              objectFit: "contain",
                              width: "100%",
                              height: "100%",
                              position: "absolute",
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </Upload>
              </div>
            </div>
          </Form.Item>
          <Form.Item
            labelAlign="left"
            label="Cân nặng (nếu có)"
            valuePropName="checked"
            name="check"
          >
            <Switch defaultChecked={product?.check} />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ marginRight: 10 }}
            >
              <Link to="/manager/products">Quay lại</Link>
            </Button>

            {check == true ? (
              <Spin />
            ) : (
              <Button type="primary" htmlType="submit">
                Sửa
              </Button>
            )}
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default EditPro;
