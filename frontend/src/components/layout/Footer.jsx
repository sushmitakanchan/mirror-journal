import React from 'react'
import write from '../../assets/write.png'
import reflect from '../../assets/reflect.png'
import rewire from '../../assets/rewire.png'
import arrow from '../../assets/right-arrow.png'

const Footer = () => {
  return (
    <footer className='py-12 bg-orange-200 mt-20'>
    <div className='mx-auto px-4 text-center text-gray-900'>
      <div className='gradient-title-text text-2xl'>
        <div>Say What You Feel.</div>
        <div>See What’s Real.</div>
      </div>
      <div className='flex justify-center gap-20 mt-10'>
        <div>
            <img src={write} alt="" className='rounded-3xl h-20 w-22'/>
            <h1 className='text-black font-extrabold'>WRITE</h1>
        </div>
        <div>
        <img src={reflect} alt="" className='w-21 rounded-3xl h-20'/>
        <h1 className='text-black font-extrabold'>REFLECT</h1>
        </div>
        <div>
        <img src={rewire} alt="" className='rounded-3xl h-20 w-22'/>
        <h1 className='text-black font-extrabold'>REWIRE</h1>
        </div>
      </div>
    </div>
    </footer>
  )
}

export default Footer
