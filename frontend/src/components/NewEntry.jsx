import React from 'react'
import bgImg from '../assets/bgImg.jpg'


const NewEntry = () => {
  return (
    <div className='flex w-screen h-screen bg-cover bg-center bg-no-repeat justify-center items-center -z-10' style={{ backgroundImage: `url(${bgImg})` }}>
      <form>
        <h1 className='text-5xl md:text-6xl font-extrabold bg-gradient-to-br from-orange-500 via-orange-300 to-orange-400 bg-clip-text tracking-tighter text-transparent pr-2 pb-2'>What's on your mind?</h1>
      </form>
    </div>
  )
}

export default NewEntry
