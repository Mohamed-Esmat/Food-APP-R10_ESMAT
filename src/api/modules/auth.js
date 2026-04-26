import axiosClient from "../axiosClient";

export const Login = (data) => {
  return axiosClient.post("/Users/Login", data);
};

export const Register = (data) => {
  return axiosClient.post("/Users/Register", data);
};

export const GetProfile = () => {
  return axiosClient.get("/Users/Profile");
};
