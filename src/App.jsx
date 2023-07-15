import { BrowserRouter } from 'react-router-dom'
import SecuredPage from '../pages/SecuredPage'
import Security from '../pages/Security'
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-react'

function App () {
  return (
    <BrowserRouter>
      <ClerkProvider publishableKey={import.meta.env.VITE_PUBLISHABLE_KEY}>
        <SignedOut>
          <Security />
        </SignedOut>
        <SignedIn>
          <SecuredPage />
        </SignedIn>
      </ClerkProvider>
    </BrowserRouter>
  )
}

export default App
