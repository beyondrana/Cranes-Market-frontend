import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Layout from './Layout/Layout'
import Login from './pages/Login'
import Signup from './pages/Signup'

const App = () => {
  return (
    <Layout>

    <Routes>
      <Route path='/' element={<Header/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/signup' element={<Signup/>}/>
    </Routes>
    
    </Layout>
    
  )
}

export default App