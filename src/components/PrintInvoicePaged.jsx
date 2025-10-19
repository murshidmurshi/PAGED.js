import React, { useEffect } from "react";
import "./print-invoice-paged.css";
import InvoiceHeader from "./InvoiceHeader";
import InvoiceFooter from "./InvoiceFooter";

const PrintInvoicePaged = () => {

    const handlePrint2 = () => {
    const existingScript = document.querySelector('script[src*="paged.polyfill.js"]')
    if (existingScript) existingScript.remove()

    const headerHeightMM = 100
    const footerHeightMM = 30
    const pageHeightMM = 297
    const availableContentMM = pageHeightMM - headerHeightMM - footerHeightMM

    console.log(`📐 PAGE LAYOUT CONFIGURATION`)
    console.log(`Page Height: ${pageHeightMM}mm`)
    console.log(`Header Height: ${headerHeightMM}mm`)
    console.log(`Footer Height: ${footerHeightMM}mm`)
    console.log(`Available Content: ${availableContentMM}mm`)

    // Inject dynamic CSS
    const injectDynamicPageStyles = () => {
      const existingStyle = document.getElementById('dynamic-page-styles')
      if (existingStyle) existingStyle.remove()

      const styleElement = document.createElement('style')
      styleElement.id = 'dynamic-page-styles'
      styleElement.textContent = `
        @page {
          size: A4;
          margin: ${headerHeightMM}mm 0mm ${footerHeightMM}mm 0mm;
          @top-center { content: element(pagedjs-header); }
          @bottom-center { content: element(pagedjs-footer); }
        }
        .pagedjs-header, .pagedjs-footer {
          box-sizing: border-box;
          overflow: hidden;
          background-color: white;
        }
        .pagedjs-header { height: ${headerHeightMM}mm; }
        .pagedjs-footer { height: ${footerHeightMM}mm; }
        .pagedjs-body { padding: 0.5rem 1rem !important; }
        .pagedjs_page_content { overflow: hidden; box-sizing: border-box; }
      `
      document.head.appendChild(styleElement)
      console.log(`✅ Dynamic CSS injected`)
    }

    injectDynamicPageStyles()

    let globalBlankPages = []

    // Paged.js configuration
    window.PagedConfig = {
      auto: false,
      before: async () => {
        if (window.Paged && window.Paged.Handler) {
          class CustomHandler extends window.Paged.Handler {
            constructor(chunker, polisher, caller) {
              super(chunker, polisher, caller)
              this.blankPageIndices = []
              this.pageStats = []
            }

            afterPageLayout(pageElement, page) {
              const bodyContent = pageElement.querySelector('.pagedjs_page_content')
              const textLength = bodyContent?.textContent.trim().length || 0
              const invoiceRows =
                bodyContent?.querySelectorAll('.invoice-table tbody tr').length || 0

              // Default has content if text or invoice rows
              let hasContent = textLength > 50 || invoiceRows > 0

              // Special rule: first page with invoiceRows = 0 => mark blank
              if (page.position === 0 && invoiceRows === 0) {
                hasContent = false
              }

              // Log page details
              console.log(`\n📄 Page ${page.position} Analysis:`)
              console.log(`   Text Length: ${textLength}`)
              console.log(`   Invoice Rows: ${invoiceRows}`)
              console.log(`   Has Content: ${hasContent ? '✅ YES' : '❌ NO'}`)

              if (!hasContent) {
                pageElement.setAttribute('data-blank-page', 'true')
                pageElement.setAttribute('data-page-position', page.position)
                this.blankPageIndices.push(page.position)
                console.log(`   ⚠️ Marked as blank page`)
              }

              this.pageStats.push({
                page: page.position,
                hasContent,
                textLength,
                invoiceRows,
              })
            }

            afterRendered(pages) {
              console.log(`\n📊 TOTAL PAGES: ${pages.length}`)
              console.log(`🔴 Blank Pages to Remove: ${this.blankPageIndices}`)

              globalBlankPages = [...this.blankPageIndices]

              const allPages = document.querySelectorAll('.pagedjs_page')
              allPages.forEach((pageEl) => {
                const pagePos = parseInt(pageEl.getAttribute('data-page-position'))
                const isBlank = globalBlankPages.includes(pagePos)

                if (isBlank) {
                  console.log(`🗑️ Removing blank page: ${pagePos}`)
                  pageEl.remove()
                } else {
                  console.log(`✅ Keeping page: ${pagePos}`)
                }
              })
            }
          }

          window.Paged.registerHandlers(CustomHandler)
        }
      },
    }

    // Load Paged.js
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/pagedjs/dist/paged.polyfill.js'
    script.onload = () => {
      console.log(`✅ Paged.js loaded`)

      let didPrint = false
      const originalTitle = document.title
      const printTitle = 'Invoice_Print'

      const onPagedRendered = () => {
        if (didPrint) return
        didPrint = true

        document.title = printTitle
        setTimeout(() => window.print(), 500)

        window.onafterprint = () => {
          document.title = originalTitle
          window.location.reload()
        }

        document.removeEventListener('pagedjs:rendered', onPagedRendered)
      }

      document.addEventListener('pagedjs:rendered', onPagedRendered)

      setTimeout(() => {
        if (window.PagedPolyfill) window.PagedPolyfill.preview()
      }, 100)
    }

    script.onerror = () => console.error(`❌ Failed to load Paged.js`)
    document.body.appendChild(script)
  }
  
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
