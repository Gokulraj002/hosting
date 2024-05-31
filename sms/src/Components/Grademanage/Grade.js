import React, { useState } from "react";
import { FaPlus, FaArrowLeft } from "react-icons/fa";

import GradeTable from "./Gradetable";
import GradeForm from "./Gradeform";

const Grade = () => {
  const [showForm, setShowForm] = useState(false);

  const handleAddStudentClick = () => {
    setShowForm(true);
  };

  const handleGoBackClick = () => {
    setShowForm(false);
  };

  return (
    <div className="container">
      <div className="bg-white row shadow">
        {showForm ? (
          <div>
            <div className="border_color ms-md-2 mt-3 pb-3 ">
              <h2>
                <span className="fontweight">Manage Student</span>
                <span
                  className="float-end change mt-2 bg-opacity-75 p-2 text-bg-success"
                  onClick={handleGoBackClick}
                  style={{ cursor: "pointer" }}
                >
                  <FaArrowLeft /> Go Back
                </span>
              </h2>
            </div>
            <GradeForm />
          </div>
        ) : (
          <div className="card border-0">
            <div className="border_color ms-md-2 my-3 pb-2 float-start">
              <h2>
                <span className="fontweight">Manage Students</span>
                <span
                  className="float-end change mt-2 bg-opacity-75 p-2 text-bg-danger"
                  onClick={handleAddStudentClick}
                  style={{ cursor: "pointer" }}
                >
                  <FaPlus /> Add New Grade
                </span>
              </h2>
            </div>
            <div className="card-header border  ">Manage Grade Level</div>
            <div className="card-body border mb-5 ">
              <GradeTable />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Grade;
