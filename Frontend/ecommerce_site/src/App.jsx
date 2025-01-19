import './App.css'
// eslint-disable-next-line 
import React from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import {LoginPage, SignupPage} from "./Routes/routes.js";

const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/login' element={<LoginPage/>}/>
      <Route path='/signup' element={<SignupPage/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App
