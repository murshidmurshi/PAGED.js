import React from "react";
import "./sidebar.css";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <h2>Murshid Co.</h2>
      <nav>
        <ul>
          <li>Dashboard</li>
          <li>Invoices</li>
          <li>Reports</li>
          <li>Settings</li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
