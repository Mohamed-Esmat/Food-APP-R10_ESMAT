import axiosClient from "../axiosClient";

export const GetTags = () => {
  return axiosClient.get("/tag");
}
