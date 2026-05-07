import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import logo from '../../../../assets/images/3.png'
import { AuthContext } from '../../../../context/AuthContext';
export default function SideBar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const {loginData} = useContext(AuthContext);

  const toggleCollapse =()=>{
    setIsCollapsed(!isCollapsed)
  }
  const navigate=useNavigate()
  const logout=()=>{
  
   localStorage.removeItem('token');
   navigate('/login')
  }
  return (
    <div className='sidebar-container'>
      <Sidebar collapsed={isCollapsed}>
        <div onClick={()=>toggleCollapse()} className=' text-center my-4'>
                  <img className='img-fluid' src={logo} alt="" />
        </div> 
        <Menu>
          <MenuItem icon={<i className='fa fa-home'></i>} component={<Link to="/dashboard" />}> Home </MenuItem>
          {loginData?.userGroup != 'SystemUser'?  
                    <MenuItem icon={<i className='fa fa-users'></i>} component={<Link to="/dashboard/users" />}> Users </MenuItem>
          :<></>}
          <MenuItem icon={<i className='fa fa-home'></i>} component={<Link to="/dashboard/recipes" />}> Recipes </MenuItem>
          {loginData?.userGroup != 'SystemUser'? 
          <MenuItem icon={<i className='fa fa-home'></i>} component={<Link to="/dashboard/categories" />}> Categories </MenuItem>:
          <></>
}
          {loginData?.userGroup == 'SystemUser'? 
          <MenuItem icon={<i className='fa fa-home'></i>} component={<Link to="/dashboard/favourites" />}> Favourites </MenuItem>:
          <></>
}
          <MenuItem icon={<i className='fa fa-key'></i>}> Change Password </MenuItem>

          <MenuItem onClick={()=>logout()} icon={<i className='fa fa-sign-out'></i>}>  logout</MenuItem>
        </Menu>
      </Sidebar>
    </div>
  )
}
