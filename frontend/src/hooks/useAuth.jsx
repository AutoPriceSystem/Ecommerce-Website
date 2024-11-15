import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

const useAuthFunctions = () => {
  const [data, setData] = useState({ email: "", password: "", name:"", mobile:"", address:"" });
  const navigate = useNavigate();
  const {  login,logout,presentUser,SetUserDetails } = useAuth();
  const changeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };


  const signIn = async () => {
    const { email, password,mobile } = data;
try{
      await signInWithEmailAndPassword(auth, email, password)
}
      catch (error) {
       
      return error.code
    }
try{
      await axios.post("http://localhost:5000/api/user/login",{
        email: email,
        mobile: mobile,
        }).then(async(res)=>{  localStorage.setItem('user',res.data.userId);
          await login(res.data.userId);

          })
        }
          catch (err) {
       
     return err.response.data.message
    }
    try{
      
      await axios.post(`http://localhost:5000/user/getUserDetails`,{
        userId:presentUser
      }).then((res)=> {console.log(res.data);SetUserDetails(res.data);navigate("/") })
    }catch(err){
      return err.response.data.message
    }
  };

  const signUp = async () => {
    const { email, password, name , mobile, address } = data;

    try{
      await axios.post("http://localhost:5000/api/user/register",{
      name : name,
      email: email,
      mobile: mobile,
      address: address
      })

    } catch (err) {
      return  err.response.data.message
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password).then(async()=>{
        await signOut(auth);
        navigate("/login"); // Redirect to login page after sign up
      })
    }catch(err){
      return err.code
    }


  };

  const goToSignUp = () => {
    navigate("/signup");
  };

  const goToLogin = () => {
    navigate("/login");
  };
  const signout=()=>{
    signOut(auth)
    logout()
  }
  return {
    data,
    changeHandler,
    signIn,
    signUp,
    signout,
    goToSignUp,
    goToLogin,
  };
};

export default useAuthFunctions;
