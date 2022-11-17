import React from 'react'
import LoginForm from '../components/login/LoginForm'

const Login = (props) => {
  let setMail= props.setMail
  
  return (
    <LoginForm setMail={setMail}/>
    
  )
}

export default Login