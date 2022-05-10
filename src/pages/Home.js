import React from 'react'
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

import { AuthContext } from "../helpers/AuthContext";
function Home() {

  const [postList, setPostList] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);

  const { authState } = useContext(AuthContext);

  //react-router-dom v6 replaces useHistory with useNavigate and changes some methods
  let navigate = useNavigate();

  useEffect(() => {

    // if (!authState.status) {
    //   navigate("./login")
    // } else {

    //check for token instead of auth state, because authstate is also rendered on page load, thus will not be ready and refreshing will redirect to login 
    if (!localStorage.getItem("accessToken")) {
      navigate("./login")
    } else {



      // axios.get("http://localhost:3001/posts",
      axios.get("https://full-stack-demo-api-rtj.herokuapp.com/posts",
        // headers must be sent with access token as it uses auth middleware
        {
          headers: {
            accessToken: localStorage.getItem("accessToken")
          }
        })
        .then((response) => {

          setPostList(response.data.postList)
          // sets likedPost state to an array containing only the postId's that are liked by the current user.
          setLikedPosts(response.data.likedPosts.map((like) => {
            return like.postId
          }))
        });

    }
  }, [])


  const likePost = (postId) => {
    // axios.post("http://localhost:3001/like", {
      axios.post("https://full-stack-demo-api-rtj.herokuapp.com/like", {
      postId: postId
    },
      {
        headers: {
          accessToken: localStorage.getItem("accessToken")
        }
      })
      .then((response) => {

        setPostList(postList.map((post) => {
          // if the selected post id matches the post id of the current index of the array (.map function)
          if (post.id === postId) {
            // and if it is currently liked
            if (response.data.liked) {
              //return the same post but add an extra index to the Likes to force a refresh
              return {
                ...post,
                Likes: [...post.Likes, 0]
              }

            } else {
              // otherwise remove one element from the Likes array to force a refresh, decreasing likes count
              const likeArray = post.Likes;
              likeArray.pop();
              return {
                ...post,
                Likes: likeArray
              }
            }


          } else {
            // if incorrect post, just return post as-is
            return post
          }
        }))
        // if the post has already been liked, filter through likedPosts and remove the current id, otherwise add current id to likedPosts
        if (likedPosts.includes(postId)) {
          setLikedPosts(likedPosts.filter((id) => {
            return id != postId;
          }))
        } else {
          setLikedPosts([...likedPosts, postId])
        }
      })
  }
  return (

    <div>

      {postList.map((value, key) => {
        return (
          <div className="post" key={key} >
            <div className="title">{value.title}</div>
            <div className="body" onClick={() => { navigate(`/post/${value.id}`) }}>{value.postText}</div>
            <div className="footer">
              <div className="username"><Link to={`/profile/${value.userId}`}> {value.username} </Link></div>
              <div className="buttons">
                {/* Classname if the likedPostState contains the current post id then that means it is already liked */}
                <ThumbUpIcon className={likedPosts.includes(value.id) ? "unlikeBttn" : "likeBttn"} onClick={() => { likePost(value.id) }} />
                {/* <ThumbUpIcon className="unlikeBttn" onClick={() => { likePost(value.id) }} /> */}
                {/* <button onClick={() => {likePost(value.id)}}>Like</button> */}
                <label>{value.Likes.length}</label>
              </div>
            </div>
          </div>
        )
      })}

    </div>



  )
}
export default Home