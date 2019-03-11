import axios from "axios";
const http = axios.create({
    baseURL: "https://api.dimension.hk/api",
});

export default http;
