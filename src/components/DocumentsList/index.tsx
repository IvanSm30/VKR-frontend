import React, { useState } from 'react';
import { DeleteOutlined, DownloadOutlined, FileTextOutlined, SendOutlined } from '@ant-design/icons';
import { Card, Flex, Modal } from 'antd';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import SearchControls from '../SearchControls';

const DocumentsList = () => {
    const dispatch = useAppDispatch();
    const files = useAppSelector((state) => state.files.filteredFiles);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentFile, setCurrentFile] = useState<string | null>(null);

    const showModal = (file: string) => {
        setCurrentFile(file);
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setCurrentFile(null);
    };

    const handleDelete = async (file_path: string) => {
        const response = await fetch(`/api/delete_file/${file_path}`, {
            method: "DELETE"
        });
        if (response.ok) {
            dispatch({ type: "files/deleteFile", payload: file_path });
        }
    };

    const sendFile = () => {

    };

    return (
        <div>
            <SearchControls />
            <div>
                <p style={{ textAlign: "center", color: "gray" }}>Найдено результатов: {files.length}</p>
                <ul>
                    {files?.map(file => (
                        <Flex key={file.id}>
                            <Card actions={[
                                <FileTextOutlined key="edit" onClick={() => showModal(file.file_path)} />,
                                <DownloadOutlined key="download" />,
                                <SendOutlined key="send" onClick={() => sendFile()} />,
                                <DeleteOutlined key="delete" onClick={() => handleDelete(file.file_path)} />,
                            ]} style={{ minWidth: 600 }}>
                                <Card.Meta title={file.title} />
                            </Card>
                        </Flex>
                    ))}
                </ul>
            </div>
            <Modal title="" open={isModalOpen} onCancel={handleCancel} footer={null}>
                {currentFile && <iframe src={`http://localhost:8000/${currentFile}`} />}
            </Modal>
        </div>
    );
};

export default DocumentsList;
