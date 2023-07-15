import { UserButton } from "@clerk/clerk-react"

function Navbar() {
  return (
    <nav className="p-4">
        <UserButton />
    </nav>
  )
}

export default Navbar