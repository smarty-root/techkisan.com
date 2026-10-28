import React from 'react';
import '../styles/ManagerNavigation.css';
import axios from 'axios';
import logo from "../assets/logo-techkisan.jpg";
import { useNavigate } from 'react-router-dom'; 
import { useState,useEffect } from 'react';
import APIEndpoints  from "./endPoints"

function ManagerNavigation({ activeSection, onNavigate }) {
  const navigate = useNavigate();
  const Endpoints= new APIEndpoints()
 const [employeeData, setEmployeeData] = useState("");
  const [unreadCount, setUnreadCount] = useState({});
  

  const handleLogout = async () => {
    try {
      const token =localStorage.getItem('token');
      if (!token) {
        console.error('Token not found');
        return;
      }
  
      
      localStorage.removeItem('token');

      navigate('/');

    } catch (err) {
      console.error('Error logging out:', err.response?.data?.message || 'Server error');
    }
  };

  const handleChangePassword = async () => {
    try {
      const token = localStorage.getItem("token"); 
      if (!token) {
        console.error('Token not found');
        return;
      }
      navigate('/change-password');

    } catch (err) {
      console.error('Error logging out:', err.response?.data?.message || 'Server error');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Token not found');
          navigate('/');
          return;
        }
  
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
  
        const response = await fetch(`${Endpoints.MANAGER_DASHBOARD}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
        });
  
        if (response.status === 200) {
          const data = await response.json();
          setEmployeeData(data.employee);
        }
      } catch (err) {
        console.error('Error decoding token or fetching data:', err);
        navigate('/');
      }
  
 
    };
  
    fetchData();
    fetchunreadcount();
    const interval = setInterval(fetchunreadcount, 2000); 
    return () => clearInterval(interval);
  }, []);

  const fetchunreadcount = async () => {
    try{
      const response=await fetch(`${Endpoints.FETCH_UNREAD_MESSAGES}/${employeeData._id}`)
      if(response.status===200){
        const data=await response.json();
        setUnreadCount(data);
      }
    }catch(err){
      console.error('Error fetching unread count:', err.message);
    }

  }
  

  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState('');

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = (section) => {
    onNavigate(section);
    setIsOpen(false);
    setOpenDropdown('');
  };

  const toggleDropdown = (section) => {
    if (openDropdown === section) {
      setOpenDropdown('');
    } else {
      setOpenDropdown(section);
    }
  };

  return (
    <nav className="navigationbar">
       <div  className="company-logo"><img src={logo} alt="Company Logo" /></div>
      <div className={`menu-icon ${isOpen ? 'open' : ''}`} onClick={toggleMenu}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>
      <ul className={`nav-links ${isOpen ? 'open' : ''}`}>
        <li>
          <a
            href="#"
            className={activeSection === 'home' ? 'active' : ''}
            onClick={() => handleLinkClick('home')}
          >
            Home
          </a>
        </li>
        
        <li className={`dropdown ${openDropdown === 'leaves' ? 'open' : ''}`}>
          <a
            href="#"
            className={activeSection === 'request' || activeSection === 'report' || activeSection === 'pending' ? 'active' : ''}
            onClick={() => toggleDropdown('leaves')}
          >
            Leaves
          </a>
          <div className="dropdown-content">
            <a href="#" onClick={() => handleLinkClick('request')}>Request</a>
            <a href="#" onClick={() => handleLinkClick('report')}>My Report</a>
            <a href="#" onClick={() => handleLinkClick('pending')}>Pending Leave</a>
          </div>
        </li>
        <li>
          <a
            href="#"
            className={activeSection === 'tasks' ? 'active' : ''}
            onClick={() => handleLinkClick('tasks')}
          >
            Tasks
          </a>
        </li>
        <li>
          <a
            href="#"
            className={activeSection === 'tickets' ? 'active' : ''}
            onClick={() => handleLinkClick('tickets')}
          >
            Tickets
          </a>
        </li>
        <li>
          <a
            href="#"
            className={activeSection === 'chat' ? 'active' : ''}
            onClick={() => handleLinkClick('chat')}
          >
            Chat {unreadCount.length > 0 ? <span className="unread-count">({unreadCount.length})</span> : "(0)"}
         
          </a>
        </li>
       
        <li className="dropdown-content">
          <a href="#" className="dropbtn">My Account <img src="assest/icons8-dropdown-30.png" width="10px" alt="" /></a>
          <div className="dropdown-content">
            <a href="#" onClick={handleChangePassword}>Change Password</a>
            <a href="#" style={{ color: "red" }} onClick={handleLogout}>Logout</a>
          </div>
        </li>
        
      </ul>
    </nav>
  );
}

export default ManagerNavigation;
