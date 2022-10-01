import { axiosClient } from "./Axios.js";
const OrderAPI = {
  getAll() {
    const url = `/order`;
    return axiosClient.get(url);
  },
  get(id) {
    const url = `/order/${id}`;
    return axiosClient.get(url);
  },
};
export default OrderAPI;
export const remove = (order) => {
  const url = `/order-remove`;
  return axiosClient.post(url, order);
};
export const add = (order) => {
  const url = `/order`;
  return axiosClient.post(url, order);
};
export const upload = (id, order) => {
  const url = `/order/${id}`;
  return axiosClient.put(url, order);
};
