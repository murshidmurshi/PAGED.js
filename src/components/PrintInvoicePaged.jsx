import React, { useEffect } from "react";
import "./print-invoice-paged.css";
import InvoiceHeader from "./InvoiceHeader";
import InvoiceFooter from "./InvoiceFooter";

const PrintInvoicePaged = () => {
  
  const handlePrint = () => {
    const existingScript = document.querySelector(
      'script[src*="paged.polyfill.js"]'
    );
    if (existingScript) existingScript.remove();
    const script = document.createElement("script");
    script.src = "https://unpkg.com/pagedjs/dist/paged.polyfill.js";
    script.async = true;

    script.onload = () => {
      let didPrint = false;

      const onPagedRendered = () => {
        if (didPrint) return;
        didPrint = true;
        setTimeout(() => {
          window.print();
        }, 100);
        document.removeEventListener("pagedjs:rendered", onPagedRendered);
      };

      // Event listener
      document.addEventListener("pagedjs:rendered", onPagedRendered);

      // ⏱️ Fallback timeout: in case event doesn't fire
      setTimeout(() => {
        if (!didPrint) {
          window.print();
          document.removeEventListener("pagedjs:rendered", onPagedRendered);
        }
      }, 1000); // fallback print in 3 seconds
    };

    document.body.appendChild(script);
  };

  return (
    <div className="pagedjs-print-content">
      <div className="print-button-container">
        <button onClick={handlePrint} className="print-button">
          Print
        </button>
      </div>

      <InvoiceHeader />
      <InvoiceFooter />

      <main className="pagedjs-body">
        <h3>DELIVERY NOTE</h3>
        <div className="grid-info">
          <p>
            <strong>Customer Name:</strong> Example Company Ltd.
          </p>
          <p>
            <strong>Attention:</strong> Mr. John Doe
          </p>
          <p>
            <strong>PO Number:</strong> PO-123456
          </p>
          <p>
            <strong>Delivery Date:</strong> 22 Jul 2025
          </p>
          <p>
            <strong>Delivery Number:</strong> DN-456789
          </p>
          <p>
            <strong>Quotation Number:</strong> QT-789012
          </p>
        </div>

        <table className="invoice-table">
          <thead>
            <tr>
              <th>S.No.</th>
              <th>Description</th>
              <th>UOM</th>
              <th>Qty</th>
              <th>Delivered</th>
              <th>Delivering</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(25).keys()].map((i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>Product description for item {i + 1}</td>
                <td>PCS</td>
                <td>100</td>
                <td>50</td>
                <td>30</td>
                <td>20</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="sign-section">
          <p>
            <strong>Prepared By:</strong> Jane Smith
          </p>
          <p>
            <strong>Delivered By:</strong> Mike Johnson
          </p>
          <p>
            <strong>Received By:</strong> ___________________
          </p>
        </div>
      </main>
    </div>
  );
};

export default PrintInvoicePaged;
