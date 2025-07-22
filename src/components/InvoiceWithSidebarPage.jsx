import React, { useEffect } from "react";
import Sidebar from "./Sidebar"; // adjust path if in another folder
import PrintInvoicePaged from "./PrintInvoicePaged"; // the invoice component
import "./print-invoice-paged.css"; // shared styles for layout and invoice
import "./sidebar.css"; // sidebar styles

const InvoiceWithSidebarPage = () => {
  useEffect(() => {
    document.title = "Murshid Company Invoice";
  }, []);

  return (
    <div className="app-layout" style={{ display: "flex" }}>
      <Sidebar />
      <div className="main-content" style={{ flex: 1, padding: "20px" }}>
        <PrintInvoicePaged />
      </div>
    </div>
  );
};

export default InvoiceWithSidebarPage;
