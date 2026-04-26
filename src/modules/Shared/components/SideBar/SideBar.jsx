import React from 'react'
import { useNavigate } from 'react-router-dom';

export default function SideBar() {
  const navigate=useNavigate()
  const logout=()=>{
  
   localStorage.removeItem('token');
   navigate('/login')
  }
  return (
    <div className='bg-info'>
      <h2>SideBar</h2>
      <button className='btn btn-primary' onClick={()=>logout()}>logout</button>
    </div>
  )
}
