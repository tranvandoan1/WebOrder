import { axiosClient } from "./Axios.js";
const FloorAPI = {
  getAll() {
    const url = `/floor`;
    return axiosClient.get(url);
  },
  get(id) {
    const url = `/floor/${id}`;
    return axiosClient.get(url);
  },
};
export default FloorAPI;
export const remove = (id) => {
  const url = `/floor/${id}`;
  return axiosClient.delete(url);
};
export const add = (floor) => {
  const url = `/floor`;
  return axiosClient.post(url, floor);
};
export const upload = (id, data) => {
  const url = `/floor/${id}`;
  return axiosClient.put(url, data);
};
