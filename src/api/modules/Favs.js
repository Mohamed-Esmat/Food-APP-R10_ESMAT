import axiosClient from "../axiosClient";

export const GetFavs = () => {
  return axiosClient.get("/userRecipe");
};

export const CreateFav = (data) => {
  return axiosClient.post("/userRecipe", data);
};

export const DeleteFav = (id) => {
  return axiosClient.delete(`/userRecipe/${id}`);
};


