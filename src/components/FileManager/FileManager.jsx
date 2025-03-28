import React from 'react';
import axios from 'axios';
import "./FileManager.css";
import {useNavigate} from "react-router-dom";


const FileManager = () => {
    const navigate = useNavigate();
    const csrfToken = document.cookie
        .split('; ')
        .find((row) => row.startsWith('csrftoken'))
        ?.split('=')[1];

    const handleImport = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:8000/products/import-export/', formData, {
                headers: {
                    'X-CSRFToken': csrfToken,
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true,
            });
            alert(response.data.message);
            window.location.reload(); // Перезагрузка страницы после успешного экспорта
        } catch (error) {
            console.error(error);
            alert('Ошибка при импорте продуктов');
        }
    };

    const handleExport = async () => {
        try {
            const response = await axios.get('http://localhost:8000/products/import-export/', {
                responseType: 'blob',
                withCredentials: true,
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'products.xlsx');
            document.body.appendChild(link);
            link.click();

        } catch (error) {
            console.error(error);
            alert('Ошибка при экспорте продуктов');
        }
    };

    return (
        <div className="file-management">
            <div className="icons-container">
                <h4>Файлообмен</h4>
                <label className="icon-button">
                    <img src="/images/icons/import.svg" alt="Импорт" />
                    <input type="file" onChange={handleImport} accept=".xlsx" hidden />
                </label>
                <button className="icon-button" onClick={handleExport}>
                    <img src="/images/icons/export.svg" alt="Экспорт" />
                </button>
            </div>
        </div>
    );
};

export default FileManager;
