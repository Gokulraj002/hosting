// Layout.js
import React from "react";
import Sidebar from "./Sidebar";
import { Outlet} from "react-router-dom";



const Menu = () => {
  return (
    // <div className="wi w-100">
    <div className="container-fluid" id="wi">

        <div className="row">
          <div className=" col-12 col-md-0 cols">
                
      <Sidebar />
      </div>
      <div className="col-12 col-md-0 colss">
   
      <div className=" bg-light pb-5 " >
        <div className=" py-3 mb-4 text-center w-100 logos">
          <h2 className=" text-success">Student Management System </h2>
          </div>
          <div className="ms-md-5 me-md-4">
          <Outlet />
          </div>
      </div>
      </div>
      </div>
      </div>
    // </div>
  );
};

export default Menu;
