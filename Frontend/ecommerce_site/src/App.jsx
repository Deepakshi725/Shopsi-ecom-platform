import './App.css'
// eslint-disable-next-line 
import React from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import {LoginPage, SignupPage, Home, CreateProduct, MyProducts, Cart, ProductDetails} from "./Routes/routes.js";

const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/login' element={<LoginPage/>}/>
      <Route path='/signup' element={<SignupPage/>}/>
      <Route path='/create-product' element={<CreateProduct/>}/>
      <Route path="/myproducts" element={<MyProducts/>} />
      {/* For edit product by id */}
      <Route path="/create-product/:id" element={<CreateProduct />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/product/:id" element={<ProductDetails />} />

    </Routes>
    </BrowserRouter>
  )
}



export default App
