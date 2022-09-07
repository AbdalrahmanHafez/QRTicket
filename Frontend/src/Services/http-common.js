import axios from "axios";

var url;
if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  url = "http://localhost:8080/api/";
} else {
  url = "/api/";
}

const axResource = axios.create({
  baseURL: url,
  headers: {
    "Content-type": "application/json",
  },
  withCredentials: true,
});

export default axResource;
