import axiosClient from "../axiosClient";

export const GetCategories = () => {
  return axiosClient.get("/Category");
};

export const CreateCategory = (data) => {
  return axiosClient.post("/Category", data);
};
export const GetCategortyById = (data) => {
//   return axiosClient.post("/Users/Register", data);
};

export const UpdateCategory = (data) => {
//   return axiosClient.post("/Users/Register", data);
};

export const DeleteCategory = (id) => {
  return axiosClient.delete(`/Category/${id}`);
};


