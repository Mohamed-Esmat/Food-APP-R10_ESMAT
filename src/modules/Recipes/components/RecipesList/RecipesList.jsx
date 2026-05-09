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
