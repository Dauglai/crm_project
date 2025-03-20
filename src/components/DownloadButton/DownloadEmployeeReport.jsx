import React from "react";

const DownloadEmployeeReport = ({ profileId }) => {
    const handleDownload = () => {
        window.location.href = `http://localhost:8000/analytics/download/${profileId}/`;
    };

    return (
        <button onClick={handleDownload} className="download-btn">
            📥 Скачать Excel-отчет
        </button>
    );
};

export default DownloadEmployeeReport;
