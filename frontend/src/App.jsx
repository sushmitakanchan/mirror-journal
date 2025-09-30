import {createBrowserRouter, RouterProvider } from 'react-router-dom';
import History from './components/layout/History';
import NewEntry from './components/layout/NewEntry';
import EntryView from './components/layout/EntryView';
import AppLayout from './components/layout/AppLayout';
import { SignIn, SignUp} from '@clerk/clerk-react';
import Dashboard from './components/layout/Dashboard';
import Home from './components/layout/Home';


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
          path:"/entryView",
          element:<EntryView/>
        },

                {
          path:"/history",
          element:<History/>
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
