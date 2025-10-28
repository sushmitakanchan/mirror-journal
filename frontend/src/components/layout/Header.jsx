import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../../assets/logo.png'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { Button } from "@/components/ui/button"
import { FolderOpen, SquarePen } from 'lucide-react';
import UserMenu from '../ui/UserMenu';
import ModeToggle from './ToggleButton';

const Header = () => {
  return (
    <header className='container mx-auto'>
    <nav className='py-2 px-4 flex justify-between items-center'>
    <Link href='/'>
    <img src={logo} alt='logo' width={200} height={60} className='h-30 w-auto object-contain'/>
    </Link>
    <div className='flex items-center gap-4 text-black'>
      <SignedIn>
      <Link to='/dashboard#collections'>
      <Button variant="white" className="flex items-center gap-2">
        <FolderOpen size={18}/>
        <span className='hidden md:inline'>Collections</span>
        </Button>
      </Link>
      </SignedIn>

      <Link to='/newEntry'>
      <Button variant="journal" className="flex items-center gap-2">
        <SquarePen size={18}/>
        <span className='hidden md:inline'>Write New</span>
        </Button>
      </Link>
      <ModeToggle/>
      <SignedOut>
        <SignInButton forceRedirectUrl="/dashboard">
          <Button variant="outline" className='mr-10 dark:bg-amber-100'>Login</Button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <UserMenu/>
      </SignedIn>
    </div>
  </nav>
  </header>
  )
}

export default Header
