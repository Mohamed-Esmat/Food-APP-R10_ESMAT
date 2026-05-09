# Session Tasks: Update Recipe + Pagination

This guide is organized as two tasks you will teach in session.
Each task includes:

- Steps with exact files and line ranges to update.
- Full updated file content for every file touched by that task.

---

## Task 1: Update Recipe (Edit Flow)

### Step-by-step changes (with line ranges)

1. Add edit route so RecipeData can load by id.

- File: src/App.jsx
- Lines: 53-55 (new route: recipe-data/:id)

2. Add API helpers for GET by id and UPDATE; also ensure Create uses multipart (same as update).

- File: src/api/modules/Recipes.js
- Lines: 3-24

3. Update RecipeData form to support create vs update.

- File: src/modules/Recipes/components/RecipeData/RecipeData.jsx
- Lines: 2-31 (useParams + edit mode + state)
- Lines: 33-62 (getRecipe + form prefill)
- Lines: 83-125 (image preview + formData with existing image)
- Lines: 127-149 (create vs update submit)
- Lines: 151-157 (load data when in edit mode)
- Lines: 159-289 (UI: edit text, file input, preview, buttons)

4. Ensure the edit icon navigates to the edit route.

- File: src/modules/Recipes/components/RecipesList/RecipesList.jsx
- Lines: 156-159 (navigate to /dashboard/recipe-data/:id)

### Commit-style notes (line-by-line intent)

#### File: src/App.jsx

- Lines 53-55: feat(routes): add edit route `recipe-data/:id` for RecipeData

#### File: src/api/modules/Recipes.js

- Lines 3-5: feat(api): allow GetRecipes to accept pagination params
- Lines 7-13: feat(api): send multipart for CreateRecipe
- Lines 14-16: feat(api): add GetRecipeById for edit preload
- Lines 18-24: feat(api): add UpdateRecipe with multipart

#### File: src/modules/Recipes/components/RecipeData/RecipeData.jsx

- Lines 1-11: feat(edit): import `useParams`, `GetRecipeById`, `UpdateRecipe`, `toast`
- Lines 14-31: feat(edit): add edit-mode state and refs
- Lines 33-62: feat(edit): load recipe by id and prefill form
- Lines 83-93: feat(ui): show image preview when file changes
- Lines 95-125: feat(edit): build FormData using new or existing image
- Lines 127-149: feat(edit): submit Create vs Update
- Lines 151-157: feat(edit): fetch recipe when `id` changes
- Lines 159-160: feat(ui): show loading in edit mode
- Lines 163-289: feat(ui): update header text, file input, preview, cancel/save buttons

#### File: src/modules/Recipes/components/RecipesList/RecipesList.jsx

- Lines 156-159: feat(edit): navigate to `/dashboard/recipe-data/:id` from edit icon

### Updated file content (Task 1)

#### File: src/App.jsx

```jsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import AuthLayout from "./modules/Shared/components/AuthLayout/AuthLayout";
import NotFound from "./modules/Shared/components/NotFound/NotFound";
import Login from "./modules/Authentication/components/Login/Login";
import Register from "./modules/Authentication/components/Register/Register";
import VerfiyAccount from "./modules/Authentication/components/VerfiyAccount/VerfiyAccount";
import ForgetPass from "./modules/Authentication/components/ForgetPass/ForgetPass";
import ResetPass from "./modules/Authentication/components/ResetPass/ResetPass";
import MasterLayout from "./modules/Shared/components/MasterLayout/MasterLayout";
import Dashboard from "./modules/Dashboard/components/Dashboard/Dashboard";
import RecipesList from "./modules/Recipes/components/RecipesList/RecipesList";
import RecipeData from "./modules/Recipes/components/RecipeData/RecipeData";
import CategoriesList from "./modules/Categories/components/CategoriesList/CategoriesList";
import CategoryData from "./modules/Categories/components/CategoryData/CategoryData";
import UsersList from "./modules/Users/components/UsersList/UsersList";
import FavList from "./modules/Favourites/components/FavList/FavList";
// import { useEffect, useState } from "react";
// import { jwtDecode } from "jwt-decode";
import ProtectedRoute from "./modules/Shared/components/ProtectedRoute/ProtectedRoute";
import { ToastContainer } from "react-toastify";

function App() {
  //move then improve
  //lifting state up
  //poc proof of concept

  const routes = createBrowserRouter([
    {
      path: "",
      element: <AuthLayout />,
      errorElement: <NotFound />,
      children: [
        { index: true, element: <Login /> },
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
        { path: "verify-account", element: <VerfiyAccount /> },
        { path: "forget-pass", element: <ForgetPass /> },
        { path: "reset-pass", element: <ResetPass /> },
      ],
    },
    {
      path: "dashboard",
      element: (
        <ProtectedRoute>
          <MasterLayout />
        </ProtectedRoute>
      ),
      errorElement: <NotFound />,
      children: [
        { index: true, element: <Dashboard /> },
        { path: "", element: <Dashboard /> },
        { path: "recipes", element: <RecipesList /> },
        { path: "recipe-data", element: <RecipeData /> },
        { path: "recipe-data/:id", element: <RecipeData /> },
        { path: "categories", element: <CategoriesList /> },
        { path: "users", element: <UsersList /> },
        { path: "favourites", element: <FavList /> },
      ],
    },
  ]);
  return (
    <>
      <ToastContainer />
      <RouterProvider router={routes}></RouterProvider>
    </>
  );
}

export default App;
```

#### File: src/api/modules/Recipes.js

```jsx
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
```

#### File: src/modules/Recipes/components/RecipeData/RecipeData.jsx

```jsx
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
        setImagePreview(
          `https://upskilling-egypt.com:3006/${recipeInfo.imagePath}`,
        );
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
          `https://upskilling-egypt.com:3006/${existingImage}`,
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
                  style={{
                    maxWidth: "300px",
                    maxHeight: "300px",
                    objectFit: "cover",
                  }}
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
```

#### File: src/modules/Recipes/components/RecipesList/RecipesList.jsx

```jsx
import React, { useContext, useEffect, useState } from "react";
import headerImg from "../../../../assets/images/header.png";
import Header from "../../../Shared/components/Header/Header";
import Nodata from "../../../Shared/components/NoData/Nodata";
import { DeleteRecipe, GetRecipes } from "../../../../api/modules/Recipes";
import noDataImg from "../../../../assets/images/no-data.png";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import DeleteConfirmation from "../../../Shared/components/DeleteConfirmation/DeleteConfirmation";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../context/AuthContext";
import { CreateFav } from "../../../../api/modules/Favs";
export default function RecipesList() {
  const navigate = useNavigate();
  const { loginData } = useContext(AuthContext);

  const [recipesList, setRecipesList] = useState([]);
  const [recipeId, setRecipeId] = useState(0);
  const [recipeName, setRecipeName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = (item) => {
    // alert(item.id);
    setRecipeId(item.id);
    setRecipeName(item.name);
    setShow(true);
  };
  const addToFavs = async (id) => {
    // alert(id);
    try {
      const response = await CreateFav({
        recipeId: id,
      });
      toast.success("fav added!!");
    } catch (error) {
      console.log(error);
    }
  };

  const getList = async () => {
    try {
      const response = await GetRecipes({
        pageNumber: currentPage,
        pageSize: pageSize,
      });
      setRecipesList(response.data.data);
      setTotalPages(response.data.totalNumberOfPages);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteRecipe = async () => {
    try {
      const response = await DeleteRecipe(recipeId);
      toast.success(`Successfully delete ${recipeName}`);
      handleClose();
      ///////filter array ->tl3ly mnha el id
      getList();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getList();
  }, [currentPage, pageSize]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <Header
        title={`Hello Recipes`}
        descripion={
          "You can now add your items that any user can order it from the Application and you can edit"
        }
        imgUrl={headerImg}
      />
      {/* Delete Modal */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body className="text-center">
          <DeleteConfirmation deleteItem={"Recipe"} itemName={recipeName} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={deleteRecipe}>
            Delete this item
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="px-4 py-3 d-flex justify-content-between justify-content-center align-items-center">
        <div>
          <h4>Recipes List</h4>
          <span>You can check all details</span>
        </div>
        {loginData?.userGroup != "SystemUser" ? (
          <button
            className="btn btn-success"
            onClick={() => navigate("/dashboard/recipe-data")}
          >
            Add new Recipe
          </button>
        ) : (
          <></>
        )}
      </div>
      <div className="p-4">
        {recipesList.length > 0 ? (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Name</th>
                  <th scope="col">Image</th>
                  <th scope="col">Price</th>
                  <th scope="col">Description</th>
                  <th scope="col">Category</th>
                  <th scope="col">Tag</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {recipesList.map((item) => (
                  <tr key={item.id}>
                    <th scope="row">{item.id}</th>
                    <td>{item.name}</td>
                    <td>
                      {item.imagePath ? (
                        <img
                          className="table-img"
                          src={`https://upskilling-egypt.com:3006/${item.imagePath}`}
                          alt=""
                        />
                      ) : (
                        <img className="table-img" src={noDataImg} />
                      )}
                    </td>
                    <td>{item.price}</td>
                    <td>{item.description}</td>
                    <td>{item.category[0]?.name}</td>
                    <td>{item.tag?.name}</td>

                    <td>
                      {loginData?.userGroup != "SystemUser" ? (
                        <>
                          <i
                            onClick={() =>
                              navigate(`/dashboard/recipe-data/${item.id}`)
                            }
                            className="fa fa-edit text-warning mx-2"
                            style={{ cursor: "pointer" }}
                          ></i>
                          <i
                            onClick={() => handleShow(item)}
                            className="fa fa-trash text-danger"
                            style={{ cursor: "pointer" }}
                          ></i>
                        </>
                      ) : (
                        <i
                          onClick={() => addToFavs(item.id)}
                          className="fa fa-heart text-danger mx-2"
                        ></i>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totalPages >= 1 && (
              <nav aria-label="Page navigation example">
                <ul className="pagination justify-content-end">
                  <li
                    className={
                      currentPage === 1 ? "page-item disabled" : "page-item"
                    }
                  >
                    <button
                      className="page-link"
                      type="button"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                  </li>
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    return (
                      <li
                        key={pageNumber}
                        className={
                          pageNumber === currentPage
                            ? "page-item active"
                            : "page-item"
                        }
                        aria-current={
                          pageNumber === currentPage ? "page" : undefined
                        }
                      >
                        <button
                          className="page-link"
                          type="button"
                          onClick={() => handlePageChange(pageNumber)}
                        >
                          {pageNumber}
                        </button>
                      </li>
                    );
                  })}
                  <li
                    className={
                      currentPage === totalPages
                        ? "page-item disabled"
                        : "page-item"
                    }
                  >
                    <button
                      className="page-link"
                      type="button"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </>
        ) : (
          <Nodata />
        )}
      </div>
    </>
  );
}
```

---

## Task 2: Pagination for Recipes List

### Step-by-step changes (with line ranges)

1. Allow recipes endpoint to accept pagination params.

- File: src/api/modules/Recipes.js
- Lines: 3-5

2. Add pagination state + fetch by page + pagination UI.

- File: src/modules/Recipes/components/RecipesList/RecipesList.jsx
- Lines: 21-23 (pagination state)
- Lines: 46-54 (GetRecipes with pageNumber/pageSize)
- Lines: 71-77 (fetch on page change + handler)
- Lines: 181-239 (Bootstrap pagination markup)

### Commit-style notes (line-by-line intent)

#### File: src/api/modules/Recipes.js

- Lines 3-5: feat(pagination): accept `pageNumber` and `pageSize` params

#### File: src/modules/Recipes/components/RecipesList/RecipesList.jsx

- Lines 21-23: feat(pagination): add `currentPage`, `pageSize`, `totalPages`
- Lines 46-54: feat(pagination): call API with pagination params and set total pages
- Lines 71-77: feat(pagination): refetch on page change and handle page clicks
- Lines 181-239: feat(pagination): render Bootstrap pagination UI

### Updated file content (Task 2)

#### File: src/api/modules/Recipes.js

```jsx
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
```

#### File: src/modules/Recipes/components/RecipesList/RecipesList.jsx

```jsx
import React, { useContext, useEffect, useState } from "react";
import headerImg from "../../../../assets/images/header.png";
import Header from "../../../Shared/components/Header/Header";
import Nodata from "../../../Shared/components/NoData/Nodata";
import { DeleteRecipe, GetRecipes } from "../../../../api/modules/Recipes";
import noDataImg from "../../../../assets/images/no-data.png";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import DeleteConfirmation from "../../../Shared/components/DeleteConfirmation/DeleteConfirmation";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../context/AuthContext";
import { CreateFav } from "../../../../api/modules/Favs";
export default function RecipesList() {
  const navigate = useNavigate();
  const { loginData } = useContext(AuthContext);

  const [recipesList, setRecipesList] = useState([]);
  const [recipeId, setRecipeId] = useState(0);
  const [recipeName, setRecipeName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = (item) => {
    // alert(item.id);
    setRecipeId(item.id);
    setRecipeName(item.name);
    setShow(true);
  };
  const addToFavs = async (id) => {
    // alert(id);
    try {
      const response = await CreateFav({
        recipeId: id,
      });
      toast.success("fav added!!");
    } catch (error) {
      console.log(error);
    }
  };

  const getList = async () => {
    try {
      const response = await GetRecipes({
        pageNumber: currentPage,
        pageSize: pageSize,
      });
      setRecipesList(response.data.data);
      setTotalPages(response.data.totalNumberOfPages);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteRecipe = async () => {
    try {
      const response = await DeleteRecipe(recipeId);
      toast.success(`Successfully delete ${recipeName}`);
      handleClose();
      ///////filter array ->tl3ly mnha el id
      getList();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getList();
  }, [currentPage, pageSize]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <Header
        title={`Hello Recipes`}
        descripion={
          "You can now add your items that any user can order it from the Application and you can edit"
        }
        imgUrl={headerImg}
      />
      {/* Delete Modal */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body className="text-center">
          <DeleteConfirmation deleteItem={"Recipe"} itemName={recipeName} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={deleteRecipe}>
            Delete this item
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="px-4 py-3 d-flex justify-content-between justify-content-center align-items-center">
        <div>
          <h4>Recipes List</h4>
          <span>You can check all details</span>
        </div>
        {loginData?.userGroup != "SystemUser" ? (
          <button
            className="btn btn-success"
            onClick={() => navigate("/dashboard/recipe-data")}
          >
            Add new Recipe
          </button>
        ) : (
          <></>
        )}
      </div>
      <div className="p-4">
        {recipesList.length > 0 ? (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Name</th>
                  <th scope="col">Image</th>
                  <th scope="col">Price</th>
                  <th scope="col">Description</th>
                  <th scope="col">Category</th>
                  <th scope="col">Tag</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {recipesList.map((item) => (
                  <tr key={item.id}>
                    <th scope="row">{item.id}</th>
                    <td>{item.name}</td>
                    <td>
                      {item.imagePath ? (
                        <img
                          className="table-img"
                          src={`https://upskilling-egypt.com:3006/${item.imagePath}`}
                          alt=""
                        />
                      ) : (
                        <img className="table-img" src={noDataImg} />
                      )}
                    </td>
                    <td>{item.price}</td>
                    <td>{item.description}</td>
                    <td>{item.category[0]?.name}</td>
                    <td>{item.tag?.name}</td>

                    <td>
                      {loginData?.userGroup != "SystemUser" ? (
                        <>
                          <i
                            onClick={() =>
                              navigate(`/dashboard/recipe-data/${item.id}`)
                            }
                            className="fa fa-edit text-warning mx-2"
                            style={{ cursor: "pointer" }}
                          ></i>
                          <i
                            onClick={() => handleShow(item)}
                            className="fa fa-trash text-danger"
                            style={{ cursor: "pointer" }}
                          ></i>
                        </>
                      ) : (
                        <i
                          onClick={() => addToFavs(item.id)}
                          className="fa fa-heart text-danger mx-2"
                        ></i>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totalPages >= 1 && (
              <nav aria-label="Page navigation example">
                <ul className="pagination justify-content-end">
                  <li
                    className={
                      currentPage === 1 ? "page-item disabled" : "page-item"
                    }
                  >
                    <button
                      className="page-link"
                      type="button"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                  </li>
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    return (
                      <li
                        key={pageNumber}
                        className={
                          pageNumber === currentPage
                            ? "page-item active"
                            : "page-item"
                        }
                        aria-current={
                          pageNumber === currentPage ? "page" : undefined
                        }
                      >
                        <button
                          className="page-link"
                          type="button"
                          onClick={() => handlePageChange(pageNumber)}
                        >
                          {pageNumber}
                        </button>
                      </li>
                    );
                  })}
                  <li
                    className={
                      currentPage === totalPages
                        ? "page-item disabled"
                        : "page-item"
                    }
                  >
                    <button
                      className="page-link"
                      type="button"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </>
        ) : (
          <Nodata />
        )}
      </div>
    </>
  );
}
```
