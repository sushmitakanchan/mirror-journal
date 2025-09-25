import React from 'react'
import Header from './Header'
import Footer from './Footer'
import { Outlet } from 'react-router-dom'
import bgImg from '../../assets/bgImg.jpg'

const AppLayout = () => {
  return (
    <div className='w-screen min-h-screen bg-cover bg-center bg-no-repeat justify-center items-center' style={{ backgroundImage: `url(${bgImg})` }}>
      <Header/>
      <div className=' flex justify-center pt-5'>
      <Outlet/>
      </div>
      <Footer/>
    </div>
  )
}

export default AppLayout
