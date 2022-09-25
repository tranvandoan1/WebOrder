import { axiosClient } from "./Axios.js";
const DataaAPI = {
    getAll() {
        const url = `/products`;
        return axiosClient.get(url);
    },
    add(dataa) {
        const url = `/dataa`;
        return axiosClient.post(url, dataa);
    },


};
export default DataaAPI;