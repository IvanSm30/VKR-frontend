import React, { useState } from 'react';
import { DeleteOutlined, DownloadOutlined, FileTextOutlined, SendOutlined } from '@ant-design/icons';
import { Card, Flex, Modal, Pagination } from 'antd';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import * as XLSX from 'xlsx';
import { formatDateTime } from 'src/utils';

const DocumentsList = () => {
    const dispatch = useAppDispatch();
    const files = useAppSelector((state) => state.files.filteredFiles);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentFile, setCurrentFile] = useState<string | null>(null);
    const [sheets, setSheets] = useState<any[]>([]); // State to hold all sheets
    const [selectedSheetIndex, setSelectedSheetIndex] = useState(0); // Index of the currently selected sheet
    const [tableData, setTableData] = useState<any[]>([]); // State to hold table data for the selected sheet
    const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
    const rowsPerPage = 10; // Number of rows per page

    const showModal = async (file: string) => {
        setCurrentFile(file.toLowerCase());
        setIsModalOpen(true);
        if (file.endsWith('.xls') || file.endsWith('.xlsx')) {
            await loadExcelFile(file);
        } else {
            setSheets([]); // Clear sheets if not an Excel file
        }
    };

    const loadExcelFile = async (file: string) => {
        const response = await fetch(`http://localhost:8000/uploads/${file}`);
        const data = await response.arrayBuffer();
        const workbook = XLSX.read(data, { type: 'array' });
        const allSheets = workbook.SheetNames.map(sheetName => ({
            name: sheetName,
            data: XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 })
        }));
        setSheets(allSheets);
        setTableData(allSheets[0]?.data || []); // Set data for the first sheet
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setCurrentFile(null);
        setSheets([]); // Clear sheets on modal close
        setTableData([]);
    };

    const handleDelete = async (file_path: string) => {
        fetch(`/api/delete_file/${file_path}`, {
            method: "DELETE"
        })
            .then((res) => res.json())
            .then(() => dispatch({ type: "files/deleteFile", payload: file_path }))
    };

    const sendFile = () => {
        // Implement send file functionality
    };

    const handleSheetChange = (index: number) => {
        setSelectedSheetIndex(index);
        setTableData(sheets[index]?.data || []);
        setCurrentPage(1); // Reset to first page when changing sheets
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Calculate the current rows to display based on pagination
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = tableData.slice(indexOfFirstRow, indexOfLastRow);

    return (
        <>
            <div>
                <p style={{ textAlign: "center", color: "gray" }}>Найдено результатов: {files.length}</p>
                {files?.map(file => (
                    <Flex key={`${file.id}-${file.title}`} vertical={true} justify="center" align="center">
                        <Card actions={[
                            <FileTextOutlined key="edit" onClick={() => showModal(file.title)} />,
                            <DownloadOutlined key="download" />,
                            <SendOutlined key="send" onClick={() => sendFile()} />,
                            <DeleteOutlined key="delete" onClick={() => handleDelete(file.title)} />,
                        ]} style={{ width: '100%', maxWidth: 750, marginBottom: 10 }}>
                            <Card.Meta title={file.title} />
                            <Card.Meta description={`Дата создания: ${formatDateTime(file.date_created)}`} style={{ fontSize: 12, color: '#666', textAlign: 'right', marginTop: 20 }} />
                        </Card>
                    </Flex>
                ))}
            </div>
            <Modal
                title=""
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width="100%"
                style={{ top: 0 }}
            >
                {currentFile && (currentFile.endsWith('.pdf') || currentFile.endsWith('.png') || currentFile.endsWith('.heic') || currentFile.endsWith('.jpeg') || currentFile.endsWith('.txt')) && (
                    <iframe
                        src={`http://localhost:8000/uploads/${currentFile}`}
                        style={{
                            width: '100%',
                            height: '100vh',
                            border: 'none'
                        }}
                    />
                )}
                {currentFile && (currentFile.endsWith('.docx') || currentFile.endsWith('.doc')) && (
                    <div>Doc viewer</div>
                )}
                {currentFile && (currentFile.endsWith('.xls') || currentFile.endsWith('.xlsx'))
                    && (
                        <div>
                            <h3>Листы:</h3>
                            <div style={{ marginBottom: '20px' }}>
                                {sheets.map((sheet, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleSheetChange(index)}
                                        style={{
                                            marginRight: '10px',
                                            padding: '5px 10px',
                                            backgroundColor: selectedSheetIndex === index ? '#1890ff' : '#f0f0f0',
                                            color: selectedSheetIndex === index ? 'white' : 'black',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {sheet.name}
                                    </button>
                                ))}
                            </div>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                                    <thead>
                                        <tr>
                                            {tableData[0]?.map((header: string, index: number) => (
                                                <th key={index} style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentRows.map((row, rowIndex) => (
                                            <tr key={rowIndex}>
                                                {row.map((cell: string, cellIndex: number) => (
                                                    <td key={cellIndex} style={{ border: '1px solid #ddd', padding: '8px' }}>
                                                        {cell}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <Pagination
                                current={currentPage}
                                pageSize={rowsPerPage}
                                total={tableData.length}
                                onChange={handlePageChange}
                                style={{ marginTop: '20px', textAlign: 'center' }}
                            />
                        </div>
                    )}
            </Modal>
        </>
    );
};

export default DocumentsList;
