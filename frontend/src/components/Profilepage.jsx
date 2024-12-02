import React, { useState, useEffect } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, storage } from "../firebase";
import defaultProfilePic from "../Images/p8.png";
import {
  ProfileContainer,
  StyledProfileName,
  ProfileHeader,
  ProfileImageContainer,
  ProfileImage,
  EditOverlay,
  HiddenFileInput,
  ProfileDetails,
  ProfileName,
  GridContainer,
  GridItem,
} from "../StyledComponents/ProfilePageStyles";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
const ProfilePage = () => {
  const {presentUserDetails,presentUser,adminId} = useAuth()
  const [email, setEmail] = useState("");
  const [name, setName] = useState(""); // Added state to hold the user's name
  const [profilePic, setProfilePic] = useState(defaultProfilePic);
  const navigate = useNavigate()
  const {cartItems} = useCart()
  useEffect(() => {
 
    if (presentUser) {
      // Fetch the email and name from Firebase Auth
      setEmail(presentUserDetails.email);
      setName(presentUserDetails.name);

      // Fetch the profile picture from Firebase Storage
      const profilePicRef = ref(storage, `profilePics.jpg`);
      getDownloadURL(profilePicRef)
        .then((url) => {
          setProfilePic(url);
        })
        .catch((error) => {
          console.error("Error fetching profile picture:", error);
          setProfilePic(defaultProfilePic);
        });
    } else {
      // Fallback for not authenticated users
      setEmail("Add Email");
      setName("Add your name");
      setProfilePic(defaultProfilePic);
    }
  }, []);

  const handleProfilePicChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfilePic(imageUrl);

      const profilePicRef = ref(
        storage,
        `profilePics/${auth.currentUser.uid}.jpg`
      );
      try {
        await uploadBytes(profilePicRef, file);
        console.log("Profile picture uploaded successfully");
      } catch (error) {
        console.error("Error uploading profile picture:", error);
      }
    }
  };

  return (
    <ProfileContainer>
      <StyledProfileName>{presentUser==adminId ?'Admin Profile' : 'Your Account'}</StyledProfileName>
      <ProfileHeader>
        <ProfileImageContainer>
          <ProfileImage src={profilePic} alt="Profile" />
          <EditOverlay>
            Edit
            <HiddenFileInput type="file" onChange={handleProfilePicChange} />
          </EditOverlay>
        </ProfileImageContainer>
        <ProfileDetails>
        {presentUser==adminId && <ProfileName style={{fontSize:18,textDecoration:'underline',color:'skyblue'}}>Admin ID: {presentUserDetails._id}</ProfileName>}
          <ProfileName>Name: {name}</ProfileName> {/* Display user name */}
          <ProfileName>Email: {email}</ProfileName> {/* Display user email */}
          <ProfileName>Contact: {presentUserDetails.mobile}</ProfileName> {/* Display user email */}
      
        </ProfileDetails>
      </ProfileHeader>

     {presentUser!=adminId&& <GridContainer>
        <GridItem onClick={()=>navigate("/orders")}>
          <h3>Your Orders</h3>
          <p>{presentUserDetails.purchase_history.length} Products purchased</p>
        </GridItem>
        <GridItem>
          <h3>Your Address</h3>
          <p>{presentUserDetails.address}</p>
        </GridItem>
        
        <GridItem>
          <h3>Purchase History</h3>
          <p>
  {Math.abs(
    Math.ceil(
      (new Date(
        Math.max(
          ...presentUserDetails.purchase_history
            .map(item => new Date(item.date))
            .filter(date => !isNaN(date))  // Filter out invalid dates
        )
      ) - new Date()) / (1000 * 60 * 60 * 24)
    )
  )} days since last purchase!
</p>


        </GridItem>
        <GridItem>
          <h3>Your Cart</h3>
          <p>{cartItems.length} Products in Cart</p>
        </GridItem>
        
      </GridContainer>}
    </ProfileContainer>
  );
};

export default ProfilePage;
