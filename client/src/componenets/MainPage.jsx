import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Main() {
  const navigate = useNavigate();
  useEffect(()=>{
    if(localStorage.getItem('token')!==null){
      navigate("/home");
    }
  })
  return (
    <div className='cont'>
      <div className='dualside'>
        <div className='left'>
          ChatterBox
        </div>
        <div className='right'>
          <div><u>Private Chatting App</u></div>
          <ul>
            <li>Signup using Email-id.</li>
            <li>Login with same email.</li>
            <li>Enter email of your friend.</li>
            <li>Start Chatting.</li>
          </ul>
          <Link className='chatbtn' to='/login'>Let's Chat</Link>
        </div>
      </div>
    </div>
  )
}
