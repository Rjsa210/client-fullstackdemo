import React, { useEffect, useState, useContext } from 'react';

import { useParams, useNavigate } from 'react-router-dom';
import axios from "axios";

//import authContext for auth and validation
import { AuthContext } from "../helpers/AuthContext"
import ChangePassword from './ChangePassword';

export default function Profile() {

  let { id } = useParams();
  let navigate = useNavigate();
  const { authState } = useContext(AuthContext)

  const [username, setUsername] = useState("");
  const [userPosts, setUserPosts] = useState([]);


  // on page load set current username state via axios call

  useEffect(() => {
    axios.get(`http://localhost:3001/auth/basicInfo/${id}`)
      .then((response) => {
        setUsername(response.data.username)
      })

    axios.get(`http://localhost:3001/posts/user/${id}`)
      .then((response) => {
        setUserPosts(response.data);
      })

  }, [])


  return (
    <div className="profilePageContainer">
      <div className="basicinfo">
        <h1> Username: {username} </h1>
        {authState.username === username && (
          <button onClick={() => {navigate("/changePassword")}}> Change my password</button>
        )}
      </div>
      <div className="listOfPosts">
        {userPosts.map((value, key) => {
          return (
            <div className="post" key={key} >
              <div className="title">{value.title}</div>
              <div className="body" onClick={() => { navigate(`/post/${value.id}`) }}>{value.postText}</div>
              <div className="footer">
                <div className="username"> {value.username} </div>
                <div className="buttons">
                  {/* Classname if the likedPostState contains the current post id then that means it is already liked */}

                  {/* <ThumbUpIcon className="unlikeBttn" onClick={() => { likePost(value.id) }} /> */}
                  {/* <button onClick={() => {likePost(value.id)}}>Like</button> */}
                  {/* <label>{value.Likes.length}</label> */}
                </div>
              </div>
            </div>
          )
        })}
      </div>



    </div>
  )
}
