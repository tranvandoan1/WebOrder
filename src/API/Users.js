import { axiosClient } from "./Axios.js";

const UserAPI = {
  signup(user) {
    const url = `/signup`;
    return axiosClient.post(url, user);
  },
  signin(user) {
    const url = `/signin`;
    return axiosClient.post(url, user);
  },
};
export default UserAPI;
export const upload = (data) => {
  const url = `/user-upload`;
  return axiosClient.post(url, data);
};
export const uploadLogin = (data) => {
  const url = `/user-upload-login`;
  return axiosClient.post(url, data);
};
export const getAllUser = (data) => {
  const url = `/users`;
  return axiosClient.get(url);
};
export const getUserCheckLogIn = (data) => {
  const url = `/user-check-login`;
  return axiosClient.post(url, data);
};
