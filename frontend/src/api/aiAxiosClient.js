import axios from "axios";

const aiAxiosClient = axios.create({
    baseURL: "http://localhost:8000"
});

export default aiAxiosClient;