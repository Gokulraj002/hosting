import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import {
  FaUsers,
  FaToggleOn,
  FaThLarge,
  FaMoneyBill,
  FaFilePdf,
  FaToggleOff,
} from "react-icons/fa";

const Dashboard = () => {
  const [studentsCount, setStudentsCount] = useState(0);
  const [inactiveStudentsCount, setInactiveStudentsCount] = useState(0);

  const total = studentsCount + inactiveStudentsCount;

  useEffect(() => {
    fetchStudentsCount();
  }, []);

  const fetchStudentsCount = async () => {
    try {
      // Fetch count from the first endpoint
      const studentsResponse = await axios.get(
        "http://localhost:5000/api/students"
      );
      const studentsCount = studentsResponse.data.length;
      setStudentsCount(studentsCount);
      console.log(`Received ${studentsCount} active student details.`);

      // Fetch count from the second endpoint
      const inactiveStudentsResponse = await axios.get(
        "http://localhost:5000/api/active/deleted"
      );
      const inactiveStudentsCount = inactiveStudentsResponse.data.length;
      setInactiveStudentsCount(inactiveStudentsCount);
      console.log(
        `Received ${inactiveStudentsCount} inactive student details.`
      );
    } catch (error) {
      console.error("Error fetching student details:", error);
    }
  };

  return (
    <>
      <div className="container">
        <div className="  bg-white row shadow">
          <h2 className="border_color ms-md-2 my-3 pb-3">Dashboard</h2>

          <div className="col-12 col-md-4 mb-4">
            <NavLink to="/" className="text-decoration-none ">
              <div className="mx-1 one shadow rounded text-center py-3">
                <FaUsers className="w-100 display-1 text-light " />
                <div className="text-white dash mt-1">
                  <p>Total Student : {total}</p>
                  <p>MANAGE STUDENTS</p>
                </div>
              </div>
            </NavLink>
          </div>

          <div className="col-12 col-md-4 mb-4">
            <NavLink to="/Fees" className="text-decoration-none">
              <div className="mx-1 bg-success shadow rounded text-center py-3">
                <FaMoneyBill className="w-100 display-1 text-light" />
                <div className="text-white dash mt-1">
                  <p>Total Earnings : rs.80965</p>
                  <p>Collect Fees</p>
                </div>
              </div>
            </NavLink>
          </div>

          <div className="col-12 col-md-4 mb-4">
            <NavLink to="/Report" className="text-decoration-none">
              <div className="mx-1 bg-danger shadow rounded text-center py-3">
                <FaThLarge className="w-100 display-1 text-light" />
                <div className="text-white dash mt-1">
                  <p>Total Pending : RS-88921</p>
                  <p>Collect Fees</p>
                </div>
              </div>
            </NavLink>
          </div>

          <div className="col-12 col-md-4 mb-4">
            <NavLink to="/Student" className="text-decoration-none">
              <div className="mx-1 four bg-opacity-75 shadow rounded text-center py-3">
                <FaToggleOn className="w-100 display-1 text-light" />
                <p className="text-white dash mt-1">
                  Active Students :{studentsCount}
                </p>
              </div>
            </NavLink>
          </div>

          <div className="col-12 col-md-4 mb-4">
            <NavLink to="/Report" className="text-decoration-none">
              <div className="mx-1 bg-dark bg-opacity-75 shadow rounded text-center py-3">
                <FaFilePdf className="w-100 display-1 text-light" />
                <p className="text-white dash mt-1">View Reports</p>
              </div>
            </NavLink>
          </div>

          <div className="col-12 col-md-4 mb-4">
            <NavLink to="/In-Active" className="text-decoration-none">
              <div className="mx-1 six shadow rounded text-center py-3">
                <FaToggleOff className="w-100 display-1 text-light" />
                <p className="text-white dash mt-1">
                  In-Active Students : {inactiveStudentsCount}
                </p>
              </div>
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
