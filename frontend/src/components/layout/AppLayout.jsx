import React from 'react'
import Header from './Header'
import Footer from './Footer'
import { Outlet } from 'react-router-dom'
// import bgImg from '../../assets/bgImg.jpg'
// style={{ backgroundImage: `url(${bgImg})` }}
import { useTheme } from "../../context/ThemesContext"; // if using context

const AppLayout = () => {
  const { theme } = useTheme(); // theme can be "light" or "dark"
  const bgImg = "/bgImg.jpg"; // Place bgImg.jpg in your public folder

  return (
    <div className="w-screen min-h-screen bg-cover bg-center bg-no-repeat dark:bg-neutral-800"
    style={theme === "light" ? { backgroundImage: `url(${bgImg})` } : {}}>
      <Header/>
      {/* <div className='flex justify-center pt-5'> */}
      <Outlet/>
      {/* </div> */}
      <Footer/>
    </div>
  )
}

export default AppLayout
