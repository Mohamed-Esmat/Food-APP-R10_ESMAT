import axiosClient from "../axiosClient";

export const GetRecipes = () => {
  return axiosClient.get("/Recipe");
};

export const CreateRecipe = (data) => {
  return axiosClient.post("/Recipe", data);
};
export const GetRecipeById = (data) => {
//   return axiosClient.post("/Users/Register", data);
};

export const UpdateRecipe = (data) => {
//   return axiosClient.post("/Users/Register", data);
};

export const DeleteRecipe = (id) => {
  return axiosClient.delete(`/Recipe/${id}`);
};


