import React, { useContext, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage} from "formik";
import * as Yup from "yup";
import axios from "axios";

import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../helpers/AuthContext";
 
function CreatePost() {

  const { authState } = useContext(AuthContext);


  const initialValues = {
    title: "",
    postText: ""
  };

  const onSubmit = (data) => {
    //Username will be sent from back end via validateToken Middlware
    axios.post("http://localhost:3001/posts", data, {
      headers: {
        accessToken: localStorage.getItem("accessToken")
      }
    })
    .then((response) => {
      console.log(`${response.data.title} submitted!`);
      navigate("/");
    });
  }

  let navigate = useNavigate();

  useEffect(() => {
    // check if logged in on page load via authContext
    // if (!authState.status) {
    //   navigate("/login")
    // }

    //check for token instead of auth state, because authstate is also rendered on page load, thus will not be ready and refreshing will redirect to login 
    if (!localStorage.getItem("accessToken")) {
      navigate("./login")
    }

  }, [])
  

     // Yup module for validation. define what data should look like on submission via .shape method
  const validationSchema = Yup.object().shape({
     //enter error string as argument in .required method
    title: Yup.string().required("You cannot submit a post without a title"),
    postText: Yup.string().required()
    
  })


    return (
      
      <div className="createPostContainer">
        <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema} >
  
          <Form className="formContainer">
  
            <label>Title:</label>
            {/* <ErrorMessage> tells where to display error message, links it to a form element via "name" and specifies what kind of HTML component to display "span" */}
            <ErrorMessage name="title" component="span" />
            <Field id="inputCreatePost" name="title" placeholder="e.g. Post Title"/>
  
            <label>Post:</label>
            <ErrorMessage name="postText" component="span" />
            <Field id="inputCreatePost" name="postText" placeholder="e.g. Have you tried chocolate?!"/>
  
            <button type="submit"> Create Post</button>
  
          </Form>
  
        </Formik>
        </div>
    )
}

export default CreatePost