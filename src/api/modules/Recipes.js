import axiosClient from "../axiosClient";

export const GetRecipes = (params) => {
  return axiosClient.get("/Recipe", { params });
};

export const CreateRecipe = (data) => {
  return axiosClient.post("/Recipe", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const GetRecipeById = (id) => {
  return axiosClient.get(`/Recipe/${id}`);
};

export const UpdateRecipe = (id, data) => {
  return axiosClient.put(`/Recipe/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const DeleteRecipe = (id) => {
  return axiosClient.delete(`/Recipe/${id}`);
};
