import React from "react";

const PdfView = ({ pdfUrl }) => (
  <div style={{ height: "100vh", width: "100vw" }}>
    <iframe
      src={pdfUrl}
      title="PDF Viewer"
      width="100%"
      height="100%"
      //   frameBorder="0"
    />
  </div>
);

export default PdfView;
