import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { GetCategories } from '../../../../api/modules/Categories';
import { GetTags } from '../../../../api/modules/tags';
import { useForm } from 'react-hook-form';
import { CreateRecipe } from '../../../../api/modules/Recipes';

export default function RecipeData() {
    const navigate = useNavigate();
    let {register,formState:{errors},handleSubmit}=useForm();
      const [categoriesList, setCategoriesList] = useState([]);
      const [tagsList, setTagsList] = useState([]);

        const getCategories = async () => {
        try {
          const response = await GetCategories();          
          setCategoriesList(response.data.data)
        } catch (error) {
          console.log(error);
        }
      };

        const getTags = async () => {
        try {
          const response = await GetTags();

          setTagsList(response.data)
        } catch (error) {
          console.log(error);
        }
      };

      const appendToFormData=(data)=>{
         const formData = new FormData();
         formData.append("name",data.name);
         formData.append("price",data.price);
         formData.append("description",data.description);
         formData.append("tagId",data.tagId);
         formData.append("categoriesIds",data.categoriesIds);
         formData.append("recipeImage",data.recipeImage[0]);

         return formData;
      }

      const onSubmit=async (data)=>{
         let recipeData=appendToFormData(data);
        try {
              
              const response = await CreateRecipe(recipeData);
              navigate('/dashboard/recipes')
             
            } catch (error) {
                 console.log(error);
                 
            }
      }

        useEffect(() => {
          getCategories();
          getTags()
        }, [])

  return (
    <>
      <div>
        <div className="container-fluid">
          <div className="row recipe-header rounded rounded-3 justify-content-between align-items-center px-5 py-4 m-3">
            <div className="col-md-8">
              <h5> Fill this recipes!</h5>
              <p className='my-3'>you can now fill the meals easily using the table and form , click here and sill it with the table !</p>
            </div>
            <div className='col-md-4 text-end'>
              <button onClick={()=>navigate('/dashboard/recipes')} className='btn btn-success'>All recipes <i className='fa fa-arrow-right'></i></button>
            </div>
          </div>
        </div>

        <div>
          <form onSubmit={handleSubmit(onSubmit)} className='w-75 m-auto p-3'>
              <div className="input-group my-2">
                <input {...register('name',{required:'field is required'})} type="text" className='form-control' placeholder='Name' />
              </div>
              {errors.name&& <p className='text-danger'>{errors.name.message}</p>}
              <div className="input-group my-2">
                <select {...register('tagId',{required:'field is required'})} className='form-control'>
                  {tagsList.map(tag=><option value={tag.id}>{tag.name}</option>)}
                </select>
              </div>
              {errors.tagId&& <p className='text-danger'>{errors.tagId.message}</p>}
                 <div className="input-group my-2">
                <input {...register('price',{required:'field is required'})} type="number" className='form-control' placeholder='price' />
              </div>
              {errors.price&& <p className='text-danger'>{errors.price.message}</p>}
              <div className="input-group my-2">
                <select {...register('categoriesIds',{required:'field is required'})} className='form-control'>
                 {categoriesList.map(category=><option value={category.id}>{category.name}</option>)}

                </select>
              </div>
              {errors.categoriesIds&& <p className='text-danger'>{errors.categoriesIds.message}</p>}
              <div className="input-group my-2">
                <textarea {...register('description',{required:'field is required'})} type="number" className='form-control' placeholder='Description'></textarea>
              </div>
              {errors.description&& <p className='text-danger'>{errors.description.message}</p>}
              <div className="input-group my-2">
                <input {...register('recipeImage')} type="file" className='form-control' />
              </div>
             <div className='btns d-flex justify-content-end'>
               <button className='btn btn-outline-success mx-2'>Cancel</button>
              <button className='btn btn-success'>Save</button>

             </div>
          </form>
        </div>
      </div>
    
    </>
  )
}
