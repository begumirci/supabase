import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Register, Login , User} from './App.jsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path:'/',
    element:<App />,
    children:[
      {
        index:true,
        element:<User />
      },
      {
        path:'/register',
        element:<Register />
      },
      {
        path:'/login',
        element:<Login />
      }
    
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router = {router} />
)
