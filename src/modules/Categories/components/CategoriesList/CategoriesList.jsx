import React, { useEffect, useState } from 'react'
import Header from '../../../Shared/components/Header/Header'
import headerImg from '../../../../assets/images/header.png'
import axiosClient from '../../../../api/axiosClient';
import Nodata from '../../../Shared/components/NoData/Nodata';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import DeleteConfirmation from '../../../Shared/components/DeleteConfirmation/DeleteConfirmation';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { CreateCategory, DeleteCategory, GetCategories } from '../../../../api/modules/Categories';
export default function CategoriesList() {
const [categoryId, setCategoryId] = useState(0)
const [categoryName, setCategoryName] = useState('')
// modal delete data
const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = (item) =>
  { 
    setCategoryId(item.id);
    setCategoryName(item.name);
    setShow(true);
  }
  // modal add data
  const [showAdd, setShowAdd] = useState(false);
  const handleAddClose = () => setShowAdd(false);
  const handleAddShow = () => setShowAdd(true);

  let {register,formState:{errors},handleSubmit} = useForm()
  const onSubmit=async (data)=>{
      try {
      const response = await CreateCategory(data);
      handleAddClose();
      getList();
      toast.success('bravo 3leky ya nody')
      console.log(response);
    } catch (error) {
      toast.error(error)
    }
  }
  const [categoriesList, setCategoriesList] = useState([]);

    const getList = async () => {
    try {
      const response = await GetCategories();
      setCategoriesList(response.data.data)
    } catch (error) {
      console.log(error);
    }
  };

    const deleteCategory = async () => {
    try {
      const response = await DeleteCategory(categoryId)
      toast.success(`Successfully delete ${categoryName}`);
      handleClose()
      ///////filter array ->tl3ly mnha el id 
      getList();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getList()
  }, [])
  

  return (
     <>
          <Header
           title={`Hello Categories`}
           descripion={'You can now add your items that any user can order it from the Application and you can edit'} 
           imgUrl={headerImg}/>



      {/* Delete Modal */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          
        </Modal.Header>
        <Modal.Body className='text-center'>
            <DeleteConfirmation deleteItem={'Category'} itemName={categoryName}/>
         </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={deleteCategory}>
            Delete this item
          </Button>
        </Modal.Footer>
      </Modal>

        {/* Add Modal */}
      <Modal show={showAdd} onHide={handleAddClose}>
        <Modal.Header closeButton>
          Add new category
        </Modal.Header>
        <Modal.Body >
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="input-group my-2">
                <input {...register('name',{required:'name is required'})} type="text" className='form-control' placeholder='Category Name' />
              </div>
              {errors.name&& <p className='text-danger'>{errors.name.message}</p>}
              <button className='btn btn-success'>Save</button>
            </form>
         </Modal.Body>
        
      </Modal>

           <div className='px-4 py-3 d-flex justify-content-between justify-content-center align-items-center'>
             <div>
               <h4>Categories List</h4>
               <span>You can check all details</span>
             </div>
             <button onClick={handleAddShow} className='btn btn-success'>Add new Category</button>
           </div>
           <div className='p-4'>
            {categoriesList.length>0?     <table className="table">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Name</th>
      <th scope="col">Creation Date</th>
      <th scope="col">Actions</th>
    </tr>
  </thead>
  <tbody>
    {categoriesList.map(item=> 
    <tr key={item.id}>
      <th scope="row">{item.id}</th>
      <td>{item.name}</td>
      <td>{item.creationDate}</td>
      <td>
         <i className='fa fa-edit text-warning mx-2'></i>
           <i onClick={()=>handleShow(item)} className='fa fa-trash text-danger'></i>

      </td>
    </tr>) 
    }
   
  
  </tbody>
  </table>:<Nodata/>}
       
           </div>
       </>
  )
}
