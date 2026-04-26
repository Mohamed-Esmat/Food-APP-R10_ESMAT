import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import AuthLayout from './modules/Shared/components/AuthLayout/AuthLayout'
import NotFound from './modules/Shared/components/NotFound/NotFound'
import Login from './modules/Authentication/components/Login/Login'
import Register from './modules/Authentication/components/Register/Register'
import VerfiyAccount from './modules/Authentication/components/VerfiyAccount/VerfiyAccount'
import ForgetPass from './modules/Authentication/components/ForgetPass/ForgetPass'
import ResetPass from './modules/Authentication/components/ResetPass/ResetPass'
import MasterLayout from './modules/Shared/components/MasterLayout/MasterLayout'
import Dashboard from './modules/Dashboard/components/Dashboard/Dashboard'
import RecipesList from './modules/Recipes/components/RecipesList/RecipesList'
import RecipeData from './modules/Recipes/components/RecipeData/RecipeData'
import CategoriesList from './modules/Categories/components/CategoriesList/CategoriesList'
import CategoryData from './modules/Categories/components/CategoryData/CategoryData'
import UsersList from './modules/Users/components/UsersList/UsersList'
import FavList from './modules/Favourites/components/FavList/FavList'
import { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import ProtectedRoute from './modules/Shared/components/ProtectedRoute/ProtectedRoute'

function App() {
  //move then improve
  //lifting state up 
  //poc proof of concept

  const [loginData, setLoginData] = useState(null);

  const saveLoginData = ()=>{
    let  encodedToken = localStorage.getItem('token');
    let  decodedToken= jwtDecode(encodedToken);
    setLoginData(decodedToken);
  }

  useEffect(() => {
     
    if(localStorage.getItem('token'))
       saveLoginData()
  
  }, [])
  

    const routes = createBrowserRouter(
      [
        {
            path:"",
            element:<AuthLayout/>,
            errorElement:<NotFound/>,
            children:[
              {index:true,element:<Login saveLoginData={saveLoginData}/>},
              {path:'login',element:<Login saveLoginData={saveLoginData}/>},
              {path:'register',element:<Register/>},
              {path:'verify-account',element:<VerfiyAccount/>},
              {path:'forget-pass',element:<ForgetPass/>},
              {path:'reset-pass',element:<ResetPass/>},
            ]
        },
        {
            path:"dashboard",
            element:<ProtectedRoute loginData={loginData}><MasterLayout loginData={loginData}/></ProtectedRoute>,
            errorElement:<NotFound/>,
            children:[
              {index:true,element:<Dashboard/>},
              {path:'',element:<Dashboard/>},
              {path:'recipes',element:<RecipesList/>},
              {path:'recipe-data',element:<RecipeData/>},
              {path:'categories',element:<CategoriesList/>},
              {path:'users',element:<UsersList/>},
              {path:'favourites',element:<FavList/>},
            ]
        },
      ]
    )
    return (
      <>
        <RouterProvider router={routes}></RouterProvider>
      </>
    )
}

export default App
