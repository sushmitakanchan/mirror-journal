import React from 'react'
import { Link } from 'react-router-dom'
import { Mails } from 'lucide-react';
import { useEntries } from '@/context/EntriesContext';

const Archives = () => {
  const {entries} = useEntries()
  return (
    <div className='mx-50'>
      <div className="container py-4">
              <Link to="/dashboard" className="text-md text-orange-600 hover:text-orange-700 cursor-pointer">
                ← Back to Dashboard
              </Link>
      </div>
      <h1 className="text-5xl md:text-6xl gradient-title">Look back at your archives <Mails className='size-8  text-orange-500 inline-block'/> </h1>

      <ul className='flex flex-col gap-2 mt-5'>
      {entries.length > 0 ? entries.map((e, index)=>(
        <div className='bg-gradient-to-br from-white/100 to-white/50 backdrop-blur-md rounded-xl shadow-lg border border-pink-300 p-3 max-w-3/4 h-35' key={index}>
          <li className='flex flex-col items-start gap-2 ml-5'>
            <h1 className='font-extrabold text-2xl'>{e.title}</h1>
            <p>{e.mood}</p>
            <p>{e.content}</p>
          </li>
        </div>
      )):<h3 className='text-center text-gray-600 mt-10'>No enteries found.</h3>}
      </ul>
    </div>
  )
}

export default Archives
