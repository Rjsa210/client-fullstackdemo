import React, { useState } from 'react';
import axios from 'axios';

export default function ChangePassword() {

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");


  const changePassword = () => {
    // axios.put(`http://localhost:3001/auth/changepassword`, {
    axios.put(`https://full-stack-demo-api-rtj.herokuapp.com/auth/changepassword`, {
      oldPassword: oldPassword,
      newPassword: newPassword
    }, {
      // send headers for validateToken middleware
      headers:
      {
        accessToken: localStorage.getItem("accessToken")
      }
    })
    .then((response) => {
      if (response.data.error) {
        alert(response.data.error)
      }
    })
  }
  
  return (
    <div>
      <h1>ChangePassword</h1>

      <label>Current password:</label>
      <input type="text" placeholder="Current Password" onChange={(event) => setOldPassword(event.target.value)}></input>

      <label>New Password</label>
      <input type="text" placeholder="New Password" onChange={(event) => setNewPassword(event.target.value)}></input>

      <button onClick={changePassword}>Submit</button>
    </div>
  )
}
