import { SignIn } from '@clerk/clerk-react'

function Security() {
  return (
    <div className='w-full h-[100vh] flex flex-col justify-center items-center'>
        <SignIn />
    </div>
  )
}

export default Security