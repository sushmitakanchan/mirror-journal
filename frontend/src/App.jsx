import {createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout'
import Signup from './components/Signup';
import Login from './components/Login';
import History from './components/History';
import NewEntry from './components/NewEntry';
import EntryView from './components/EntryView';
import AppLayout from './components/layout/AppLayout';


  const router = createBrowserRouter([
    {
      path:"/",
      element:<AppLayout />,
      children:[
        {
          path:"/signup",
          element:<Signup/>
        },

        {
          path:"/login",
          element:<Login/>
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
      ]
    },
  ])

  function App(){
    return (
      <RouterProvider router={router}/>
    )
  }



export default App
