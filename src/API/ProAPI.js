import { axiosClient } from "./Axios.js";
const ProAPI = {
    getAll() {
        const url = `/products`;
        return axiosClient.get(url);
    },
    get(id) {
        const url = `/products/${id}`;
        return axiosClient.get(url);
    },
};
export default ProAPI;
export const add = (product) => {
    const url = `/products`;
    return axiosClient.post(url, product);
}
export const remove = (id) => {
    const url = `/products/${id}`;
    return axiosClient.delete(url);
}
export const upload = (id, data) => {
    const url = `/products/${id}`;
    return axiosClient.put(url, data);
}