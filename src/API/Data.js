import { axiosClient } from "./Axios.js";
const DataAPI = {
    getAll() {
        const url = `/dataa`;
        return axiosClient.get(url);
    },
    get(id) {
        const url = `/dataa/${id}`;
        return axiosClient.get(url);
    },
    add(data) {
        const url = `/dataa`;
        return axiosClient.post(url, data);
    },
    remove(id) {
        const url = `/dataa/${id}`;
        return axiosClient.delete(url);
    },

};
export default DataAPI;