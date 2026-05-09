import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GetCategories } from "../../../../api/modules/Categories";
import { GetTags } from "../../../../api/modules/tags";
import { useForm } from "react-hook-form";
import {
  CreateRecipe,
  GetRecipeById,
  UpdateRecipe,
} from "../../../../api/modules/Recipes";
import { toast } from "react-toastify";

export default function RecipeData() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  let {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();
  const [categoriesList, setCategoriesList] = useState([]);
  const [tagsList, setTagsList] = useState([]);
  // const [recipeData, setRecipeData] = useState(null);
  const [existingImage, setExistingImage] = useState(null); // State to hold existing image URL
  const [isLoading, setIsLoading] = useState(isEditMode); // Only set loading to true if in edit mode
  const [imagePreview, setImagePreview] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);

  const getRecipe = async (recipeId) => {
    try {
      const response = await GetRecipeById(recipeId);
      const recipeInfo = response.data;

      // Store existing image URL in state
      setExistingImage(recipeInfo.imagePath);

      // Set preview to existing image
      if (recipeInfo.imagePath && recipeInfo.imagePath.trim()) {
        setImagePreview(`https://upskilling-egypt.com:3006/${recipeInfo.imagePath}`);
      }

      // Pre-fill form with existing recipe data
      const mappedData = {
        name: recipeInfo.name,
        price: recipeInfo.price,
        description: recipeInfo.description,
        tagId: recipeInfo.tag?.id || "", // Handle case where tag might be null
        categoriesIds: recipeInfo.category?.[0]?.id || "", // Handle case where category array might be empty
        // Note: recipeImage will be handled separately since it's a file input
      };
      reset(mappedData);
      setIsLoading(false); // Set loading to false after data is fetched
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch recipe data");
      setIsLoading(false); // Set loading to false even if there's an error
    }
  };

  const getCategories = async () => {
    try {
      const response = await GetCategories();
      setCategoriesList(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getTags = async () => {
    try {
      const response = await GetTags();

      setTagsList(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview URL for newly selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const appendToFormData = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("price", data.price);
    formData.append("description", data.description);
    formData.append("tagId", data.tagId);
    formData.append("categoriesIds", data.categoriesIds);

    // Check the actual file input ref (not react-hook-form data)
    const files = fileInputRef.current?.files;

    if (files && files.length > 0) {
      // User selected a NEW image - use it!
      formData.append("recipeImage", files[0]);
    } else if (isEditMode && existingImage && existingImage.trim()) {
      // No new image selected - fetch and use existing image
      try {
        const response = await fetch(
          `https://upskilling-egypt.com:3006/${existingImage}`
        );
        const blob = await response.blob();
        const file = new File([blob], "recipe-image.jpg", { type: blob.type });
        formData.append("recipeImage", file);
      } catch (error) {
        console.log("Error fetching existing image:", error);
        throw new Error("Failed to load existing image");
      }
    }

    return formData;
  };

  const onSubmit = async (data) => {
    setIsSaving(true);
    try {
      // Await the async formData creation (for image fetching)
      const recipeFormData = await appendToFormData(data);

      if (isEditMode) {
        await UpdateRecipe(id, recipeFormData);
        toast.success("Recipe updated successfully!");
      } else {
        await CreateRecipe(recipeFormData);
        toast.success("Recipe created successfully!");
      }
      navigate("/dashboard/recipes");
    } catch (error) {
      console.log(error);
      toast.error(
        isEditMode ? "Failed to update recipe." : "Failed to create recipe.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    getCategories();
    getTags();
    if (isEditMode) {
      getRecipe(id);
    }
  }, [id, isEditMode]);

  if (isEditMode && isLoading) {
    return <div className="text-center p-5">Loading...</div>;
  }

  return (
    <>
      <div>
        <div className="container-fluid">
          <div className="row recipe-header rounded rounded-3 justify-content-between align-items-center px-5 py-4 m-3">
            <div className="col-md-8">
              <h5> {isEditMode ? "Edit Recipe" : "Fill this recipes!"}</h5>
              <p className="my-3">
                {isEditMode
                  ? "Update your recipe details below"
                  : "you can now fill the meals easily using the table and form , click here and sill it with the table !"}
              </p>
            </div>
            <div className="col-md-4 text-end">
              <button
                onClick={() => navigate("/dashboard/recipes")}
                className="btn btn-success"
              >
                All recipes <i className="fa fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>

        <div>
          <form onSubmit={handleSubmit(onSubmit)} className="w-75 m-auto p-3">
            <div className="input-group my-2">
              <input
                {...register("name", { required: "field is required" })}
                type="text"
                className="form-control"
                placeholder="Name"
              />
            </div>
            {errors.name && (
              <p className="text-danger">{errors.name.message}</p>
            )}
            <div className="input-group my-2">
              <select
                {...register("tagId", { required: "field is required" })}
                className="form-control"
              >
                {tagsList.map((tag) => (
                  <option value={tag.id}>{tag.name}</option>
                ))}
              </select>
            </div>
            {errors.tagId && (
              <p className="text-danger">{errors.tagId.message}</p>
            )}
            <div className="input-group my-2">
              <input
                {...register("price", { required: "field is required" })}
                type="number"
                className="form-control"
                placeholder="price"
              />
            </div>
            {errors.price && (
              <p className="text-danger">{errors.price.message}</p>
            )}
            <div className="input-group my-2">
              <select
                {...register("categoriesIds", {
                  required: "field is required",
                })}
                className="form-control"
              >
                {categoriesList.map((category) => (
                  <option value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            {errors.categoriesIds && (
              <p className="text-danger">{errors.categoriesIds.message}</p>
            )}
            <div className="input-group my-2">
              <textarea
                {...register("description", { required: "field is required" })}
                type="number"
                className="form-control"
                placeholder="Description"
              ></textarea>
            </div>
            {errors.description && (
              <p className="text-danger">{errors.description.message}</p>
            )}
            <div className="input-group my-2">
              <input
                {...register("recipeImage")}
                ref={fileInputRef}
                onChange={handleFileChange}
                type="file"
                className="form-control"
                accept="image/*"
              />
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div className="my-4 p-3 bg-light rounded">
                <p className="mb-3">
                  <strong>Image Preview:</strong>
                </p>
                <img
                  src={imagePreview}
                  alt="Recipe Preview"
                  className="img-thumbnail"
                  style={{ maxWidth: "300px", maxHeight: "300px", objectFit: "cover" }}
                />
              </div>
            )}
            <div className="btns d-flex justify-content-end">
              <button
                type="button"
                onClick={() => navigate("/dashboard/recipes")}
                className="btn btn-outline-success mx-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-success"
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
