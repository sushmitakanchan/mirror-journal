import React from 'react'
import Header from './Header'
import Footer from './Footer'
import { Outlet } from 'react-router-dom'
import bgImg from '../../assets/bgImg.jpg'

const AppLayout = () => {
  return (
    <div className='w-screen h-screen bg-cover bg-center bg-no-repeat justify-center items-center' style={{ backgroundImage: `url(${bgImg})` }}>
      <Header/>
      <Outlet/>
      <Footer/>
    </div>
  )
}

export default AppLayout
