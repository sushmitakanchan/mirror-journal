import {createBrowserRouter, RouterProvider } from 'react-router-dom';
import NewEntry from './components/layout/NewEntry';
import ReflectView from './components/layout/ReflectView';
import AppLayout from './components/layout/AppLayout';
import { SignIn, SignUp} from '@clerk/clerk-react';
import Dashboard from './components/layout/Dashboard';
import Home from './components/layout/Home';
import Archives from './components/layout/Archives';




  const router = createBrowserRouter([
    {
      path:"/",
      element:<AppLayout />,
      children:[
            {
          path:"/",
          element:<Home/>
        },
        {
          path:"/signup",
          element:<SignUp/>
        },

        {
          path:"/signin",
          element:<SignIn/>
        },

        {
          path:"/newEntry",
          element:<NewEntry/>
        },
        
        {
          path:"/update-entry/:id",
          element:<NewEntry isEditMode={true}/>
        },

        {
          path:"/reflect",
          element:<ReflectView/>
        },

                {
          path:"/archives",
          element:<Archives/>
        },
                        {
          path:"/dashboard",
          element:<Dashboard/>
        },
        {
          path:"/home",
          element:<Home/>
        }
      ]
    },
  ])

  function App(){
    return (
      <RouterProvider router={router}/>
    )
  }



export default App
