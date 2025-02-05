import './App.css'
// eslint-disable-next-line 
import React from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import {LoginPage, SignupPage, Home, CreateProduct, MyProducts} from "./Routes/routes.js";

const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/login' element={<LoginPage/>}/>
      <Route path='/signup' element={<SignupPage/>}/>
      <Route path='/create-product' element={<CreateProduct/>}/>
      <Route path="/myproducts" element={<MyProducts/>} />
      <Route path="/edit-product/:id" element={<CreateProduct />} />

    </Routes>
    </BrowserRouter>
  )
}



export default App
