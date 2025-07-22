import React from "react";

const InvoiceHeader = () => {
  return (
    <header className="pagedjs-header"
    style={{
        backgroundColor:'red'
    }}
    >
      <div className="company-details">
        <h2>AMACO ARABIA CONTRACTING COMPANY</h2>
        <p>C.R No. 2055003404 | VAT No. 310398615200003</p>
      </div>
    </header>
  );
};

export default InvoiceHeader;
