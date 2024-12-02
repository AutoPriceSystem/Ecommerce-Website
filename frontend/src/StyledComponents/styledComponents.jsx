import styled from "styled-components";
import { FaSearch } from "react-icons/fa";

export const Nav = styled.nav`
  background: #fff;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;  /* Reduced padding for better spacing */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;  /* Ensure padding doesn't affect layout */
  z-index: 100;
`;

export const LogoImage = styled.img`
  width: 140px; /* Slightly reduced the size for better fit */
  height: auto;
`;

export const Logo = styled.h1`
  display: flex;
  align-items: center;
  gap: 15px;
`;

export const NavLinks = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 60px; /* Added gap to space out links */
  font-weight: 520;

  a {
    position: relative;
    text-decoration: none;
    color: #333;
    font-size: 25px; /* Adjusted to fit more links */
    transition: color 0.3s ease, transform 0.3s ease;

    &:hover {
      color: #6200ea;
      transform: scale(1.05); /* Reduced hover scaling */
    }

    &::after {
      content: "";
      position: absolute;
      width: 0;
      height: 2px;
      bottom: -4px;
      left: 0;
      background-color: #6200ea;
      transition: width 0.3s ease;
    }

    &:hover::after {
      width: 100%;
    }
  }

  @media (max-width: 768px) {
    display: none; /* Hide navigation links on mobile */
  }
`;

export const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background-color: #f1f1f1;
  padding: 10px 15px;
  border-radius: 25px;
  transition: background-color 0.3s ease;
  width: 60%; /* Keep search bar as wide as possible */
  max-width: 590px;  /* Adjusted max-width */

  input {
    border: none;
    background: transparent;
    outline: none;
    margin-left: 10px;
    padding: 8px;
    font-size: 16px;
    color: #333;
    flex: 1;
  }

  &:focus-within {
    background-color: #e0e0e0;
  }

  @media (max-width: 768px) {
    display: none; /* Hide search bar on mobile */
  }
`;

export const MobileIcon = styled(FaSearch)`
  display: none;
  font-size: 24px;
  color: #333;

  @media (max-width: 768px) {
    display: block; /* Show icon on mobile */
  }
`;

export const Icons = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 50px; /* Increased gap for more spacing between icons */
  
  .icon {
    font-size: 28px;
    color: #4a4a4a;
    cursor: pointer;
    position: relative;
    transition: color 0.3s ease, transform 0.3s ease;

    &:hover {
      color: #6200ea;
      transform: scale(1.1);
    }
  }

  @media (max-width: 768px) {
    .cart-dropdown,
    .profile-dropdown {
      display: none; /* Hide cart and profile icons on mobile */
    }
  }
`;

export const MenuIcon = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block; /* Show menu icon on mobile */
    font-size: 28px;
    cursor: pointer;
    color: #333;
  }
`;

export const Sidebar = styled.div`
  position: fixed;
  top: ${({ isOpen }) => (isOpen ? "0" : "-100%")};
  left: 0;
  width: 100%;
  height: 30%;
  background: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  transition: top 0.3s ease;
  z-index: 200;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  a {
    display: block;
    padding: 10px 0;
    text-decoration: none;
    color: #333;
    font-size: 18px;

    &:hover {
      color: #6200ea;
    }
  }
`;


export const FiltersContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin: 0 20px;
  
  select {
    padding: 5px 10px;
    border-radius: 4px;
    border: 1px solid #ddd;
    background-color: #f9f9f9;
    font-size: 14px;
    cursor: pointer;

    &:focus {
      outline: none;
      border-color: #6200ea;
    }
  }

  label {
    font-size: 14px;
    font-weight: bold;
    margin-right: 5px;
  }
`;

export const FilterButtonContainer = styled.div`
  position: relative; /* Ensure the dropdown is positioned relative to the button */
  margin-left: 10px;

  button {
    background-color: #6200ea;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;

    &:hover {
      background-color: #985eff;
    }
  }
`;

export const FilterDropdownContainer = styled.div`
  position: absolute;
  top: 100%; /* Position just below the button */
  right: 0; /* Align to the right edge of the button */
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  padding: 20px;
  z-index: 100;

  h3 {
    margin-bottom: 10px;
  }

  div {
    margin-bottom: 15px;

    label {
      margin-right: 10px;
      font-weight: bold;
    }

    select {
      padding: 5px;
      border-radius: 4px;
      border: 1px solid #ccc;
    }
  }

  button {
    background-color: #6200ea;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background-color: #985eff;
    }
  }
`;

export const FiltersOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 99;
`;