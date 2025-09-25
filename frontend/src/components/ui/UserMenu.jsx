import { UserButton } from '@clerk/clerk-react'
import { ChartNoAxesGantt } from 'lucide-react'
import React from 'react'

const UserMenu = () => {
  return (
    <div>
      <UserButton
      appearance={{
        elements:{
            avatarBox:"w-10 h-10",
        },
      }}
      >
        <UserButton.MenuItems>
        <UserButton.Link
        label='Dashboard'
        labelIcon={<ChartNoAxesGantt size={15}/>}
        href='/dashboard'
        />
        <UserButton.Action label='manageAccount'/>
        </UserButton.MenuItems>
      </UserButton>
    </div>
  )
}

export default UserMenu
