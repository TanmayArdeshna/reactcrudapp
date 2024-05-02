import React, { useState } from 'react';

const DownloadPDFButton = ({ currentPage, searchTerm }) => {
  const [loading, setLoading] = useState(false);

  const handleDownloadPDF = async () => {
    try {
      setLoading(true);

      // Modify the API endpoint to include the current page and search term
      const apiUrl = `http://localhost:3000/get-table-data?page=${currentPage}&searchTerm=${searchTerm}`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Extract the filename from the Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition');
      const filename = contentDisposition ? contentDisposition.split('filename=')[1] : 'employee-list.pdf';

      // Create a blob from the response
      const blob = await response.blob();
      
      // Create a link element to trigger the download
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;

      // Append the link to the document and trigger the click event
      document.body.appendChild(link);
      link.click();

      // Remove the link from the document
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button className="btn btn-dark" onClick={handleDownloadPDF} disabled={loading}>
      {loading ? 'Downloading...' : 'Download PDF'}
    </button>
  );
};

export default DownloadPDFButton;
