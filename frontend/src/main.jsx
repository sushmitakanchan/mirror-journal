import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ClerkProvider } from '@clerk/clerk-react'
import { EntriesProvider } from './context/EntriesContext'
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./context/ThemesContext"

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <ThemeProvider>
     <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <Toaster
        position="bottom-center"
        reverseOrder={false}
      />
      <EntriesProvider>
      <App />
      </EntriesProvider>
     </ClerkProvider>
       </ThemeProvider>
  </StrictMode>
)
