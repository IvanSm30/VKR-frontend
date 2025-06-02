import React, { useEffect, useState } from 'react';
import { DeleteOutlined, DownloadOutlined, EditOutlined, FileTextOutlined, SendOutlined } from '@ant-design/icons';
import { Card, Flex, message, Tag } from 'antd';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { formatDateTime } from 'src/utils';
import { FileData } from './types';
import ModalSendFileComp from '../ModalSendFileComp';
import useAuthRedirect from 'src/additional/authCheck';
import ContentDocumentDisplay from './ContentDocument';
import PendingDocumentsWrapper from './PendingDocument/wrapper';
import EditCategoriesComponent from './EditCategories';

const DocumentsList = () => {
  useAuthRedirect();

  const dispatch = useAppDispatch();
  const files = useAppSelector(state => state.files.filteredFiles);
  const user = useAppSelector(state => state.user.user);

  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalEditCategoriesOpen, setIsModalEditCategoriesOpen] = useState(false);
  const [isModalSendFileOpen, setIsModalSendFileOpen] = useState(false);
  const [currentFile, setCurrentFile] = useState<FileData | null>(null);
  const [messageApi, contextHolder] = message.useMessage();

  const fetchFiles = async () => {
    try {
      const response = await fetch('/api/get_files');
      const data = await response.json();
      if (Array.isArray(data)) {
        data.forEach(file => {
          if (file.status === 'approve') {
            dispatch({ type: 'files/addFile', payload: file });
          } else if (file.status === 'pending') {
            dispatch({ type: 'files/setPendingFile', payload: file });
          }
        });
      }
    } catch (error) {
      console.error('Ошибка при загрузке файлов:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/get_users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Ошибка при загрузке файлов:', error);
    }
  }

  useEffect(() => {
    fetchFiles();
    fetchUsers();
  }, []);

  const showModal = (file: FileData) => {
    setCurrentFile(file);
    setIsModalOpen(true);
  };

  const showModalEditCategories = (file: FileData) => {
    setCurrentFile(file);
    setIsModalEditCategoriesOpen(true);
  };

  const hideModalEditCategories = () => {
    setIsModalEditCategoriesOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setCurrentFile(null);
  };

  const handleDelete = async (file_id: number) => {
    const isConfirmed = window.confirm('Вы уверены, что хотите удалить этот файл?');
    if (!isConfirmed) {
      return;
    }

    try {
      await fetch(`/api/delete_file/${file_id}`, { method: 'DELETE' });
      dispatch({ type: 'files/deleteFile', payload: file_id });
      messageApi.success('Файл удален успешно!');
    } catch (error) {
      console.error('Ошибка при удалении файла:', error);
      messageApi.error(`Ошибка при удалении файла: ${error}`);
    }
  };

  const sendFile = (file: FileData) => {
    setCurrentFile(file);
    setIsModalSendFileOpen(true);
  };

  const downloadFile = async (file: FileData) => {
    const url = `/api/download/${file.id}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.statusText}`);
      }

      const blob = await response.blob();

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = file.title;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(downloadUrl);

      messageApi.success('Файл успешно скачан');
    } catch (error) {
      console.error('Ошибка при скачивании файла:', error);
      messageApi.error('Не удалось скачать файл. Попробуйте позже.');
    }
  };

  return (
    <>
      {contextHolder}
      <PendingDocumentsWrapper />
      <p style={{ textAlign: 'center', color: 'gray' }}>Найдено результатов: {files.length}</p>
      {files?.map(file => (
        <Flex key={`${file.id}-${file.title}`} vertical justify="center" align="center">
          <Card
            actions={[
              <FileTextOutlined key="content" onClick={() => showModal(file)} />,
              <DownloadOutlined key="download" onClick={() => downloadFile(file)} />,
              <EditOutlined key="edit" onClick={() => showModalEditCategories(file)} />,
              <SendOutlined key="send" onClick={() => sendFile(file)} />,
              <DeleteOutlined key="delete" onClick={() => handleDelete(file.id)} />,
            ]}
            style={{ width: '100%', maxWidth: 750, marginBottom: 10 }}
          >
            <Card.Meta title={file.title} />
            <div style={{ paddingTop: 20 }}>
              {file.labels &&
                Object.entries(file.labels).map(([key, value]) =>
                  Array.isArray(value) ? (
                    value.map((item, index) => (
                      <p>По назначению:
                        <Tag key={`${key}-${index}`} style={{ marginBottom: 4 }}>
                          {item}
                        </Tag>
                      </p>
                    ))
                  ) : value !== "-" ? (
                    <p>По типу:
                      <Tag key={key} style={{ marginBottom: 4 }}>
                        {value}
                      </Tag>
                    </p>
                  ) : null
                )}
            </div>
            <Card.Meta
              description={`Дата создания: ${formatDateTime(file.date_created)}`}
              style={{ fontSize: 12, color: '#666', textAlign: 'right', marginTop: 20 }}
            />
          </Card>
        </Flex>
      ))}

      <EditCategoriesComponent
        open={isModalEditCategoriesOpen}
        file={currentFile}
        onCancel={hideModalEditCategories}
      />

      <ContentDocumentDisplay
        isModalOpen={isModalOpen}
        currentFile={currentFile}
        onCancel={handleCancel}
      />

      <ModalSendFileComp
        recipients={users}
        open={isModalSendFileOpen}
        file={currentFile}
        sender={user}
        onCancel={() => setIsModalSendFileOpen(false)}
      />
    </>
  );
};

export default DocumentsList;
