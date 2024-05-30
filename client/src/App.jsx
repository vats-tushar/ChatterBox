import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css'
import MainPage from './componenets/MainPage';
import Login from './componenets/Login';
import Signup from './componenets/Signup';
import Home from './componenets/Home';
function App() {
  
  return(
    <Router>
      <Routes>
        <Route exact path='/' element={<MainPage/>}></Route>
        <Route exact path='/login' element={<Login/>}></Route>
        <Route exact path='/signup' element={<Signup/>}></Route>
        <Route exact path='/home' element={<Home/>}></Route>
      </Routes>
    </Router>
  )
}

export default App
