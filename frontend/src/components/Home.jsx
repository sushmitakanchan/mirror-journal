import React from 'react'
import { Calendar } from 'lucide-react';

const Home = () => {
  return (
    <div className='relative container mx-auto px-4 pt-16 pb-16'>
      <div className='max w-6xl mx-auto text-center space-y-8'>
        <h1 className='text-5xl md:text-7xl lg:text-8xl mb-6 gradient-title'>Step into your mind. <span className='block whitespace-nowrap'>Leave your thoughts here.</span></h1>
        <p className='text-lg md:text-xl text-orange-800 mb-8'>
            Capture your journey, let AI reflect your patterns, and uncover the story inside you.</p>
            <div className='relative'>
            <div/>
            <div className='bg-white rounded-2xl p-4 max-full mx-auto'>
                <div className='border-b border-orange-100 pb-4 mb-4 flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <Calendar className='h-5 w-5 text-orange-600'/>
                    <span className='text-orange-900 font-medium'>
                        Today's entry
                    </span>
                </div>
                <div className='flex gap-2'>
                    <div className='h-3 w-3 rounded-full bg-orange-200'/>
                    <div className='h-3 w-3 rounded-full bg-orange-300'/>
                    <div className='h-3 w-3 rounded-full bg-orange-400'/>
                </div>
                </div>
            </div>
            </div>
      </div>
    </div>
  )
}

export default Home
