import React, { createContext, useContext, useState, useEffect } from "react";
import LoadingSpinner from "../components/LoadingSpinner"; // Import the loading spinner

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const[presentUserDetails,setPresentUserDetails] = useState({})
  const [presentUser, setPresentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminId, setAdminId] = useState("6732177dde08660a677d0d03")
  
useEffect(()=>{
setLoading(false)
if(localStorage.getItem('user'))
setPresentUser(localStorage.getItem('user'))
},[])

const SetUserDetails = (user_obj)=>{setPresentUserDetails(user_obj)}
const login = (user_id)=> {setPresentUser(user_id)}
const logout = () => {setPresentUser(null);localStorage.removeItem('user')}
  return (
    <AuthContext.Provider value={{ presentUser,login, adminId, logout,presentUserDetails,SetUserDetails }}>
      {loading ? <LoadingSpinner /> : children}
    </AuthContext.Provider>
  );
};
