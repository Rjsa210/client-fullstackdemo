import './App.css';
import axios from "axios";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Link, Route, Routes, Switch } from "react-router-dom";


// import pages
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Post from './pages/Post';
import Login from './pages/Login';
import Registration from './pages/Registration';
import PageNotFound from './pages/PageNotFound';
import Profile from './pages/Profile';
import ChangePassword from './pages/ChangePassword';


// import contexts
import { AuthContext } from "./helpers/AuthContext"

function App() {
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false
  });

  /* on page load check for valid accessToken via request using auth middleware. if not valid, don't set authState or maintain as false, 
  otherwise if valid, use the user object delivered from the request, via the payload of the json webtoken request*/

  useEffect(() => {
    axios.get("http://localhost:3001/auth/validate", {
      headers: {
        accessToken: localStorage.getItem("accessToken")
      }
    })
      .then((response) => {
        if (response.data.error) {

          setAuthState({ ...authState, status: false })
        } else {
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            status: true
          })
        }
      });

  }, [])


  // logout removes token from localStorage, and sets auth state to false forcing a refresh
  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({
      username: "",
      id: 0,
      status: false
    });
  }

  return (
    <div className="App">
      {/* allows all child elements to access authState and setAuthState via context */}
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <div className="navbar">
           
            {/* if no access token, display only login and register otherwise show page links and logout button */}
            {!authState.status ? (
              <>
                <Link to="/login">Login</Link>
                <Link to="/registration">Sign-Up</Link>
              </>
            ) : (
            <>
              <Link to="/">Home Page</Link>
              <Link to="/createpost">Create New Post</Link>
              <button onClick={logout}>
                Logout
              </button>
            </>
          )}

            <h1>{authState.username}</h1>
          </div>


          {/* react-router-dom V6 uses <routes /> instead of switch. */}
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/createpost" exact element={<CreatePost />} />
            <Route path="/post/:id" exact element={<Post />} />
            <Route path="/login" exact element={<Login />} />
            <Route path="/registration" exact element={<Registration />} />
            <Route path="/profile/:id" exact element={<Profile />} />
            <Route path="/changepassword" exact element={<ChangePassword /> } />

            {/* all other routes lead to page not found */}
            <Route path="*" exact element={<PageNotFound />} />


          </Routes>

        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
