import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './Layout/Layout'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ProductUploadForm from './components/ProductUploadForm'
import Homepage from './pages/Homepage'

const App = () => {
  
  return (
    <Layout>

    <Routes>
      <Route path='/' element={<Homepage/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/add-product' element={<ProductUploadForm/>}/>
    </Routes>
    
    </Layout>
    
  )
}

export default App