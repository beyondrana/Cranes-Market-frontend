import React from 'react'
import { Link } from 'react-router-dom'
import Button from './Button'

const Header = () => {
  return (
    <div>
        <Link to={'/login'}><Button>Log In</Button></Link>
        <br />
        <Link to={'/signup'}><Button>Sign Up</Button></Link>
    </div>
  )
}

export default Header