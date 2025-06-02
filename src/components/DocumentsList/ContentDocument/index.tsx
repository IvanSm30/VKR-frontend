import React, { useEffect, useState } from 'react';
import { Modal, Pagination } from 'antd';
import * as XLSX from 'xlsx';
import { FileData } from '../types';

interface ContentDocumentDisplayProps {
  isModalOpen: boolean;
  currentFile: FileData | null;
  onCancel: () => void;
}

const ContentDocumentDisplay: React.FC<ContentDocumentDisplayProps> = ({
  isModalOpen,
  currentFile,
  onCancel,
}) => {
  const [sheets, setSheets] = useState<any[]>([]);
  const [selectedSheetIndex, setSelectedSheetIndex] = useState(0);
   const [tableData, setTableData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    if (currentFile && (currentFile.title.endsWith('.xls') || currentFile.title.endsWith('.xlsx'))) {
      loadExcelFile(currentFile.file_path);
    } else {
      setSheets([]);
      setTableData([]);
      setSelectedSheetIndex(0);
      setCurrentPage(1);
    }
  }, [currentFile]);

  const loadExcelFile = async (filePath: string) => {
    try {
      const response = await fetch(`http://localhost:8000/${filePath}`);
      const data = await response.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const allSheets = workbook.SheetNames.map(sheetName => ({
        name: sheetName,
        data: XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 }),
      }));
      setSheets(allSheets);
      setTableData(allSheets[0]?.data || []);
      setSelectedSheetIndex(0);
      setCurrentPage(1);
    } catch (error) {
      console.error('Ошибка загрузки Excel файла:', error);
      setSheets([]);
      setTableData([]);
    }
  };

  const handleSheetChange = (index: number) => {
    setSelectedSheetIndex(index);
    setTableData(sheets[index]?.data || []);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = tableData.slice(indexOfFirstRow, indexOfLastRow);

  return (
    <Modal
      title={currentFile?.title || ''}
      open={isModalOpen}
      onCancel={onCancel}
      footer={null}
      width="85%"
      style={{ top: 75 }}
      bodyStyle={{ height: '70vh', padding: 0, overflowY: 'auto' }}
    >
      {currentFile && (
        <>
          {(currentFile.title.toLowerCase().endsWith('.pdf') ||
            currentFile.title.toLowerCase().endsWith('.png') ||
            currentFile.title.toLowerCase().endsWith('.heic') ||
            currentFile.title.toLowerCase().endsWith('.jpeg') ||
            currentFile.title.toLowerCase().endsWith('.txt')) && (
            <iframe
              src={`http://localhost:8000/${currentFile.file_path}`}
              style={{ width: '100%', height: '100vh', border: 'none' }}
              title="file-viewer"
            />
          )}

          {(currentFile.title.toLowerCase().endsWith('.docx') ||
            currentFile.title.toLowerCase().endsWith('.doc') ||
            currentFile.title.toLowerCase().endsWith('.pptx')) && (
            <iframe
              src={`http://localhost:8000/${currentFile.file_path_convert_pdf}`}
              style={{ width: '100%', height: '100vh', border: 'none' }}
              title="file-viewer"
            />
          )}

          {(currentFile.title.toLowerCase().endsWith('.xls') || currentFile.title.endsWith('.xlsx')) && (
            <div style={{ padding: 20 }}>
              <h3>Листы:</h3>
              <div style={{ marginBottom: 20 }}>
                {sheets.map((sheet, index) => (
                  <button
                    key={index}
                    onClick={() => handleSheetChange(index)}
                    style={{
                      marginRight: 10,
                      padding: '5px 10px',
                      backgroundColor: selectedSheetIndex === index ? '#1890ff' : '#f0f0f0',
                      color: selectedSheetIndex === index ? 'white' : 'black',
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer',
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
                        <th
                          key={index}
                          style={{ border: '1px solid #ddd', padding: 8, backgroundColor: '#f2f2f2' }}
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentRows.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell: any, cellIndex: number) => (
                          <td key={cellIndex} style={{ border: '1px solid #ddd', padding: 8 }}>
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
                style={{ marginTop: 20, textAlign: 'center' }}
              />
            </div>
          )}
        </>
      )}
    </Modal>
  );
};

export default ContentDocumentDisplay;
