import axios from "axios";

export const api = axios.create({
  baseURL: "",
  //посилання на бек
  withCredentials: true,
});
