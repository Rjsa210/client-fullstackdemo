import React, { useContext, useEffect, useState } from 'react';

import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';

//import authContext for auth and validation
import { AuthContext } from "../helpers/AuthContext"




function Post() {
  //pulls :id from url via useParams hook
  let { id } = useParams();
  let navigate = useNavigate();

  const [postObject, setPostObject] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const { authState } = useContext(AuthContext)

  useEffect(() => {
    // axios.get(`http://localhost:3001/posts/${id}`)
    axios.get(`https://full-stack-demo-api-rtj.herokuapp.com/posts/${id}`)
      .then((response) => {
        setPostObject(response.data);
      });

    // axios.get(`http://localhost:3001/comments/${id}`)
    axios.get(`https://full-stack-demo-api-rtj.herokuapp.com/comments/${id}`)
      .then((response) => {
        setComments(response.data)
      })

  }, [])


  // get comments forces a refresh, preventing creation of comment with undefined ID.
  const getComments = () => {
    // axios.get(`http://localhost:3001/comments/${id}`)
    axios.get(`https://full-stack-demo-api-rtj.herokuapp.com/comments/${id}`)
      .then((response) => {
        setComments(response.data)
      })
  }

  const addComment = () => {
    // axios.post("http://localhost:3001/comments/", {
      axios.post("https://full-stack-demo-api-rtj.herokuapp.com/comments/", {
      commentBody: newComment,
      postId: id
    },
      {
        headers: {
          // send access token as a header to validate web token
          // when storing to cookies this will be handled differently
          accessToken: localStorage.getItem("accessToken"),
        }
      })
      .then((response) => {
        if (response.data.error) {
          console.log(response.data.error)
        } else {
          console.log(response.data)
          const commentToAdd = {
            commentBody: newComment,
            //username is sent with response after being pulled from auth middlware
            username: response.data.username,
            id: response.data.id
          }
          setComments([...comments, commentToAdd])
          setNewComment("")
        }
      })
      .then(getComments);
  };


  // send delete request to axios 
  const deleteComment = (id) => {
    // axios.delete(`http://localhost:3001/comments/${id}`, {
      axios.delete(`https://full-stack-demo-api-rtj.herokuapp.com/comments/${id}`, {
      // send headers for validateToken middleware
      headers:
      {
        accessToken: localStorage.getItem("accessToken")
      }
    })
      .then(() => {
        setComments(comments.filter((comment) => {
          return comment.id !== id;
        }))
      })
  }

  const deletePost = (id) => {
    // axios.delete(`http://localhost:3001/posts/${id}`, {
      axios.delete(`https://full-stack-demo-api-rtj.herokuapp.com/posts/${id}`, {
      headers: {
        accessToken: localStorage.getItem("accessToken")
      }
    })
      .then(() => {
        navigate("/")
      })
  }

  const editPost = (option) => {
    if (option === "title") {
      // edit title... 
      //send headers because validating via middleware. 
      //post ID is already passed via use params. 
      //connects to post PUT route /title
      let newTitle = prompt("Enter new title.")
      // axios.put(`http://localhost:3001/posts/title`, { newTitle: newTitle, id: id }, {
        axios.put(`https://full-stack-demo-api-rtj.herokuapp.com/posts/title`, { newTitle: newTitle, id: id }, {
        headers:
        {
          accessToken: localStorage.getItem("accessToken")
        }
      })
      //set postObject state to force refresh
      setPostObject({ ...postObject, title: newTitle})
    } else {
      // edit body
      //send headers because validating via middleware. 
      //post ID is already passed via use params. 
      //connects to post PUT route /body
      let newBody = prompt("Enter new comment body.")
      // axios.put(`http://localhost:3001/posts/body`, { newText: newBody, id: id }, {
        axios.put(`https://full-stack-demo-api-rtj.herokuapp.com/posts/body`, { newText: newBody, id: id }, {
        headers: 
        {
          accessToken: localStorage.getItem("accessToken")
        }
      });
      //set postObject state to force refresh
      setPostObject({ ...postObject, postText: newBody})
    }
  }

  return (

    <div className="postPage">
      <div className="leftSide">
        <div className="post" id="individual">
          {/* if the logged in user from auth state is the same as the user that created post: on click, edit title, edit body, or delete post */}
          <div className="title">{postObject.title} {authState.username === postObject.username && (<EditIcon fontSize="large" onClick={() => editPost("title")} />)}</div>
          <div className="body">{postObject.postText} {authState.username === postObject.username && (<EditIcon fontSize="large" onClick={() => editPost("body")} />)}</div>
          <div className="footer">{postObject.username} {authState.username === postObject.username && (<DeleteForeverIcon fontSize="large" color="warning" onClick={() => { deletePost(postObject.id) }} />)} </div>
        </div>
      </div>

      <div className="rightSide">
        <div className="addCommentContainer">
          <input type="text" placeholder="comment..." autoComplete="off" onChange={(event) => setNewComment(event.target.value)} value={newComment}></input>
          <button onClick={addComment}> Add Comment </button>
        </div>
        <div className="listOfComments">
          {comments.map((comment, key) => {
            return (
              <div className="comment" key={key}>
                {comment.commentBody}
                <label>
                  By: {comment.username}
                  Id: {comment.id}
                </label>
                {
                  authState.username === comment.username && <button onClick={() => { deleteComment(comment.id) }}> X </button>
                }
              </div>
            )
          })}

        </div>
      </div>

    </div>
  )
}

export default Post