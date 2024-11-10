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
  const {  login } = useAuth();
  const changeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  console.log("'-----------", data);

  const signIn = async () => {
    const { email, password,mobile } = data;
    try {
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      await axios.post("http://localhost:5000/api/user/login",{
        email: email,
        mobile: mobile,
        }).then((res)=>{  localStorage.setItem('user',res.data.userId);
          login(res.data.userId);
            navigate("/") //redirect to home page 
          })

    } catch (err) {
      console.error("Error signing in:", err.message);
    }
  };

  const signUp = async () => {
    const { email, password, name , mobile, address } = data;
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await axios.post("http://localhost:5000/api/user/register",{
      name : name,
      email: email,
      mobile: mobile,
      address: address
      }).then(async()=>{
        console.log("User signed up");
        await signOut(auth);
        navigate("/login"); // Redirect to login page after sign up
      })

    } catch (err) {
      console.error("Error signing up:", err.message);
    }
  };

  const goToSignUp = () => {
    navigate("/signup");
  };

  const goToLogin = () => {
    navigate("/login");
  };

  return {
    data,
    changeHandler,
    signIn,
    signUp,
    goToSignUp,
    goToLogin,
  };
};

export default useAuthFunctions;
