import {axiosClient} from './Axios.js';
const TableAPI = {
  getAll() {
    const url = `/table`;
    return axiosClient.get(url);
  },
  get(id) {
    const url = `/table/${id}`;
    return axiosClient.get(url);
  },
};
export default TableAPI;
export const remove = id => {
  const url = `/table/${id}`;
  return axiosClient.delete(url);
};
export const add = table => {
  const url = `/table`;
  return axiosClient.post(url, table);
};
export const upload = (id, data) => {
  const url = `/table/${id}`;
  return axiosClient.put(url, data);
};
export const uploadBookTable = (table) => {
  const url = `/table/book-table`;
  return axiosClient.post(url, table);
};
export const uploadMoveTable = (table) => {
  const url = `/table/move-table`;
  return axiosClient.post(url, table);
};