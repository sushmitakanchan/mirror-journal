import React from 'react'
import { Link } from 'react-router-dom'
import { Mails } from 'lucide-react';

const Archives = () => {
  return (
    <div className='mx-50'>
      <div className="container py-4">
              <Link to="/dashboard" className="text-md text-orange-600 hover:text-orange-700 cursor-pointer">
                ← Back to Dashboard
              </Link>
      </div>
      <h1 className="text-5xl md:text-6xl gradient-title">Look back at your archives <Mails className='size-8  text-orange-500 inline-block'/> </h1>
    </div>
  )
}

export default Archives
