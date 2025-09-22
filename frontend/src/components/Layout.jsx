import React from 'react'
import { useNavigate } from 'react-router-dom';
import bgImg from '../assets/bgImg.jpg'

const Layout = () => {
  const navigate = useNavigate();
  return (
    <div className='flex gap-2 w-screen h-screen bg-cover bg-center bg-no-repeat justify-center items-center' style={{ backgroundImage: `url(${bgImg})` }}>
      <div className='text-2xl bg-amber-200 text-black p-3' onClick={()=>navigate('/signup')}>Signup</div>
      <div className='text-2xl bg-amber-200 text-black p-3' onClick={()=>navigate('/login')}>Login</div>
      <div className='text-2xl bg-amber-200 text-black p-3' onClick={()=>navigate('/history')}>History</div>
      <div className='text-2xl bg-amber-200 text-black p-3' onClick={()=>navigate('/newEntry')}>NewEntry</div>
      <div className='text-2xl bg-amber-200 text-black p-3' onClick={()=>navigate('/entryView')}>EntryView</div>
    </div>
  )
}

export default Layout
