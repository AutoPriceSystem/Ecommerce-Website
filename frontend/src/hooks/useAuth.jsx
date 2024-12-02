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
  const {  login,logout,adminId,SetUserDetails } = useAuth();
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
      await axios.post("https://autopricesystem.onrender.com/api/user/login",{
        email: email,
        mobile: mobile,
        }).then(async(result)=>{localStorage.setItem('token',result.data.token);await axios.post(`https://autopricesystem.onrender.com/user/getUserDetails`,{
          userId:result.data.userId
}).then((res)=> {SetUserDetails(res.data);login(res.data._id);if(res.data._id!=adminId){navigate("/")}else {navigate("/admin")} })})
        }
          catch (err) {
       if(err.response)
      return err.response.data.message
    else
    return err.message
    }
    try{
      
      
    }catch(err){
      if(err.response)
        return err.response.data.message
      else
      return err.message
    }
  };

  const signUp = async () => {
    const { email, password, name , mobile, address } = data;

    try{
      await axios.post("https://autopricesystem.onrender.com/api/user/register",{
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
