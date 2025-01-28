import React from 'react';
import axios from 'axios';

const ProductFileManager = () => {

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
        <div>
            <h3>Управление файлами</h3>
            <div>
                <label>
                    Импортировать продукты:
                    <input type="file" onChange={handleImport} accept=".xlsx" />
                </label>
            </div>
            <button onClick={handleExport}>Экспортировать продукты</button>
        </div>
    );
};

export default ProductFileManager;
