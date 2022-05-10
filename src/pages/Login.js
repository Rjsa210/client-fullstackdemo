import React, {useState, useContext} from 'react';
import axios from "axios";
import {useNavigate } from "react-router-dom"

//import AuthContext to access Auth state
import {AuthContext} from "../helpers/AuthContext"



function Login() {
// pull setAuthState from AuthContext so it can be called from this page
  const { setAuthState } = useContext(AuthContext)

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  const navigate = useNavigate();

  const login = () => {
    const data = {
      username: username,
      password: password
    }

    // axios.post("http://localhost:3001/auth/login", data)
    axios.post("https://full-stack-demo-api-rtj.herokuapp.com/auth/login", data)
      .then((response) => {
        
        if (response.data.error) {
          alert(`Error: ${response.data.error}`)
        } else {
          // retrieve JWT sent from back end and save in storage
          // in deployed applications save to cookies, storing in session or is not secure
          localStorage.setItem("accessToken", response.data.accessToken);
          setAuthState({ 
            username: response.data.username,
            id: response.data.id,
            status: true
          })
          navigate("/");
        }
        })
  };

  return (
    <div className="loginContainer">
      {/* updates state anytime form fields are changed */}
      <label>Username:</label>
      <input type="text" onChange={(event) => {setUsername(event.target.value)}} />

      <label>Password:</label>
      <input type="password" onChange={(event) => {setPassword(event.target.value)}}/>
      <button onClick={login}> Login </button>
    </div>
  )
}

export default Login