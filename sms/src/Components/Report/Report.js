import React from "react";
import Reporttable from "./Reporttable";

const Report = () => {
  return (
    <div className="container">
      <div className="  bg-white row shadow">
        <h2 className="border_color ms-md-2 my-3 pb-3">View Reports</h2>

        <Reporttable />
      </div>
    </div>
  );
};

export default Report;
