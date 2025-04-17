import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Button from './Button'
import useGlobalUserObject from '../store/store';

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