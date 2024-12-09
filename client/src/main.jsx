import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {ClerkProvider} from '@clerk/clerk-react'
import React from 'react'

const publishableKey =import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;


if(!publishableKey){
  throw new Error('Please provide a publishable key')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={publishableKey}>
    <App />
    </ClerkProvider>
  </StrictMode>,
)
