import React, { useEffect, useState } from 'react'
import { DeleteFav, GetFavs } from '../../../../api/modules/Favs';
import Nodata from '../../../Shared/components/NoData/Nodata';
import noDataImg from '../../../../assets/images/no-data.png'
import { toast } from 'react-toastify';

export default function FavList() {
  const [favList, setFavList] = useState([]);
  const removeFav = async (id) =>{
      try {
          const response = await DeleteFav(id); 
          getList(); 
          toast.success('elfav etms7t!!')                
        } catch (error) {
          console.log(error);
        }
  }
    const getList = async () => {
        try {
          const response = await GetFavs();                  
          setFavList(response.data.data)
        } catch (error) {
          console.log(error);
        }
      };

      useEffect(() => {
        getList()
      
      }, [])
      
  return (
    <div>
      {favList.length>0? 
       <div className="container">
         <div className="row">
           {favList.map(fav=>
            <div key={fav.id} className="col-md-4 ">
             <div className='border border-3 rounded rounded-3 text-center p-2'>
                {fav.recipe.imagePath?
                     <img className='img-fluid' src={`https://upskilling-egypt.com:3006/${fav.recipe.imagePath}`} alt="" />
                               :<img className='img-fluid' src={noDataImg}/>}
               <h4>{fav.recipe.name}</h4>
               <p>{fav.recipe.description}</p>
                <i onClick={()=>removeFav(fav.id)} className='fa fa-3x fa-heart'></i>

             </div>
           </div>
           )}
         </div>
       </div>:<Nodata/>}
     
    </div>
  )
}
