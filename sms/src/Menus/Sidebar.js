import React from "react";
import { Link, useLocation } from "react-router-dom";
import adminImage from '..//images/admin-p.png';


import { FaHome, FaUsers, FaToggleOff, FaThLarge, FaMoneyBill, FaFilePdf, FaCogs, FaSignOutAlt } from 'react-icons/fa'; // Import icons from Font Awesome

const Sidebar = () => {
  const location = useLocation();

  return (
   
    <nav id="width" className="bgcl position-fixed left-0 top-0  ">
      <div className="text-white text-center mb-3">
      <Link
          to="/"
          className='list-group-item font bgclr1'>
        DALZTEK CORP
        </Link>
      </div>
       <div className="mb-4 text-center">
       <img src={adminImage} alt="Administrator" className=" mb-2" />

      <p className="text-white text-lg line"> 
      
      Administrator</p>
      </div>
      <div className="list-group size">
        <Link
          to="/"
          className={`list-group-item   bgclr ${location.pathname === '/' ? 'actives' : ''}`}
        >
          <FaHome className="mb-1" /> Dashboard
        </Link>
        <Link
          to="/Student"
          className={`list-group-item  bgclr ${location.pathname === '/Student' ? 'actives' : ''}`}
        >
          <FaUsers className="mb-1"/> Student Management
        </Link>
        <Link
          to="/In-Active"
          className={`list-group-item  bgclr ${location.pathname === '/In-Active' ? 'actives' : ''}`}
        >
          <FaToggleOff className="mb-1"/> In-Active Students
        </Link>
        <Link
          to="/Grade"
          className={`list-group-item  bgclr ${location.pathname === '/Grade' ? 'actives' : ''}`}
        >
          <FaThLarge className="mb-1"/> Grade Levels
        </Link>
        <Link
          to="/Fees"
          className={`list-group-item  bgclr ${location.pathname === '/Fees' ? 'actives' : ''}`}
        >
          <FaMoneyBill className="mb-1"/> Fees Section
        </Link>
        <Link
          to="/Report"
          className={`list-group-item  bgclr ${location.pathname === '/Report' ? 'actives' : ''}`}
        >
          <FaFilePdf className="mb-1"/> Report Section
        </Link>
        <Link
          to="/Account"
          className={`list-group-item  bgclr ${location.pathname === '/Account' ? 'actives' : ''}`}
        >
          <FaCogs className="mb-1"/> Account Setting
        </Link>
        <Link
          to="/Logout"
          className={`list-group-item  bgclr ${location.pathname === '/Logout' ? 'actives' : ''}`}
        >
          <FaSignOutAlt className="mb-1"/> Logout
        </Link>
      </div>
      
    </nav>
  );
};

export default Sidebar;
    