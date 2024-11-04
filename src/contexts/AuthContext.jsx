import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import LoadingSpinner from "../components/LoadingSpinner"; // Import the loading spinner

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [presentUser, setPresentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     console.log("Auth State Changed:", user);
  //     setPresentUser(user);
  //     setLoading(false);
  //   });

  //   return unsubscribe;
  // }, []);
useEffect(()=>{
setLoading(false)
if(localStorage.getItem('user'))
setPresentUser(localStorage.getItem('user'))
},[])
const login = (user_id)=> {setPresentUser(user_id)}
  return (
    <AuthContext.Provider value={{ presentUser,login }}>
      {loading ? <LoadingSpinner /> : children}
    </AuthContext.Provider>
  );
};
