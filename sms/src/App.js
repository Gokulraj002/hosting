import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./Components/compo.css";
import "./Menus/sidebar.css";
import "./Components/Student_manage_form/Addstuform.css";

import Menu from "./Menus/Menu";
import Dashboard from "./Components/Dashboard";
import Account from "./Components/Account";
import Stuman from "./Components/Student_manage_form/Stumanage";
import Grade from "./Components/Grademanage/Grade";
import Inactive from "./Components/Inactive/Inactive";
import Fees from "./Components/Fees/Fees";
import Report from "./Components/Report/Report";

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Menu />}>
          <Route index element={<Dashboard />} />
          <Route path="/Student" element={<Stuman />} />
          <Route path="/In-Active" element={<Inactive />} />
          <Route path="/Grade" element={<Grade />} />
          <Route path="/Fees" element={<Fees />} />
          <Route path="/Report" element={<Report />} />
          <Route path="/Account" element={<Account />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
