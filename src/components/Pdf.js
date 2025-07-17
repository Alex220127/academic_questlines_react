// PdfActivity.js
import React from 'react';
import '../styles/Pdf.css'; // Importa o arquivo CSS

function PdfActivity({ activityTitle, pdfUrl }) {
  return (
    <div className="pdf-activity-container">
      <div className="pdf-viewer-wrapper">
        {pdfUrl ? (
          <iframe
            src={pdfUrl}
            title={activityTitle || "Documento PDF"}
            className="pdf-viewer"
            frameBorder="0"
            allowFullScreen
          >
            Seu navegador não suporta a visualização de PDFs.
            <a href={pdfUrl} target="_blank" rel="noopener noreferrer">Clique aqui para baixar o PDF.</a>
          </iframe>
        ) : (
          <p className="no-pdf-message">Nenhum PDF disponível para visualização.</p>
        )}
      </div>
    </div>
  );
}

export default PdfActivity;
