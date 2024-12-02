import React, { createContext, useContext, useState, useEffect } from "react";
import LoadingSpinner from "../components/LoadingSpinner"; // Import the loading spinner
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const[presentUserDetails,setPresentUserDetails] = useState({})
  const [presentUser, setPresentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminId, setAdminId] = useState("6732177dde08660a677d0d03")
  
useEffect(()=>{
setLoading(false)
if(  localStorage.getItem('user') &&  localStorage.getItem('token')){
  const item  = localStorage.getItem('user')
  const obj = JSON.parse(item);
  axios.post(`https://autopricesystem.onrender.com/user/getUserDetails`,{
    userId:obj._id
}).then((res)=>{setPresentUser(res.data._id)
  setPresentUserDetails(res.data)})
}
},[])


const SetUserDetails = (user_obj)=>{setPresentUserDetails(user_obj);localStorage.setItem('user',JSON.stringify(user_obj))}
const login = (user_id)=> {setPresentUser(user_id)}
const logout = () => {setPresentUser(null);localStorage.removeItem('user');localStorage.removeItem('token')}
  return (
    <AuthContext.Provider value={{ presentUser,login, adminId, logout,presentUserDetails,SetUserDetails }}>
      {loading ? <LoadingSpinner /> : children}
    </AuthContext.Provider>
  );
};
