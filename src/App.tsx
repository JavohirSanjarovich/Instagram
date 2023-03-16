import React from "react";
import { Switch, Route,useHistory} from "react-router-dom";
import { useState,useEffect,Suspense } from 'react';
import { authService } from "./fbase";
import { setUser, clearUser } from './redux/_actions/user_actions'
import { useDispatch } from 'react-redux';
import Login from "./screens/LoginPage/Login";
import SignUp from "./screens/SignUpPage/SignUp";
import MyProfile from "./screens/ProfilePage/MyProfile"
import MyprofileSetting from "./screens/ProfilePage/MyProfileSetting";
import Main from "./screens/MainPage/Main"
import Profile from "./screens/ProfilePage/Profile"
import DirectMessage from "./screens/DirectMessagePage/DirectMessage";
import DetailPost from "./screens/DetailPost.page/DetailPost"; 
import Footer from "./screens/common/Footer"
import './App.css';



function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dispatch = useDispatch()
  const history  = useHistory()
  useEffect(() => {
    authService.onAuthStateChanged(user => {
      if (user) {
        dispatch(setUser(user)) 
        setTimeout(()=>{
          history.push("/");
        },0)
        setIsLoggedIn(true);
      } else {
        history.push("/login");
        setIsLoggedIn(false)
        setTimeout(()=>{
          dispatch(clearUser()) 
        },1000)
      }
    })
  }, []);
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route exact path="/" >
          {isLoggedIn && <Main />}
        </Route>
        <Route path="/login" exact>
          {!isLoggedIn && <Login />}
        </Route>
        <Route path="/signup" exact>
          {!isLoggedIn && <SignUp/>}
        </Route>
        <Route path="/myprofile" exact>
          {isLoggedIn && <MyProfile />}
        </Route>
        <Route path="/myprofile-setting" exact>
          {isLoggedIn && <MyprofileSetting />}
        </Route>
        <Route path="/profile/:id" exact>
          {isLoggedIn && <Profile />}
        </Route>
        <Route path="/direct-message" exact>
          {isLoggedIn && <DirectMessage />}
        </Route>
        <Route path="/detail-post/:id" exact>
          {isLoggedIn && <DetailPost />}
        </Route>
      </Switch>
      <Footer />
      </Suspense>
    </>
  )
}

export default App;

