import React from 'react'
export default function Header({title,descripion,imgUrl}) {
  return (
    <div className='py-3 px-5 m-2 text-white rounded rounded-4 header-bg'>
       <div className="container-fluid">
        <div className="row">
           <div className="col-md-8 d-flex align-items-center">
            <div>
               <h3>{title}</h3>
              <p className='py-2'>{descripion}</p>
            </div>
             
           </div>
            <div className="col-md-4 text-end">
              <img className='w-75' src={imgUrl} alt="header-photo" />
           </div>
        </div>
       </div>
    </div>
  )
}
