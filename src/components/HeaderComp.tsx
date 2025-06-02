import { InboxOutlined, LogoutOutlined, UploadOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Modal, Upload, UploadFile, UploadProps, Space, Typography, GetProp, message } from "antd";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { FileData } from "./DocumentsList/types";
import { useNavigate } from "react-router-dom";
import { UserData } from "src/store/userSlice/types";

const { Dragger } = Upload;
const { Text } = Typography;
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const Header: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [uploading, setUploading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const user = useAppSelector(state => state.user.user);
    const [messageApi, contextHolder] = message.useMessage();

    const handleUpload = () => {
        const formData = new FormData();
        fileList.forEach((file) => {
            formData.append('files', file as FileType);
        });
        setUploading(true);
        fetch('/api/upload_files', {
            method: 'POST',
            body: formData,
            credentials: 'include',
        })
            .then((res) => res.json())
            .then((newFiles: FileData[]) => {
                newFiles.forEach(file => {
                    dispatch({ type: "files/addFile", payload: file });
                });
                setFileList([]);
            })
            .catch(() => {
                console.error('Загрузка не успешна!');
                messageApi.error('Загрузка не успешна!');
            })
            .finally(() => {
                messageApi.success('Загрузка файлов прошла успешна!')
                setOpenModal(false);
                setUploading(false);
            });
    };

    const props: UploadProps = {
        onRemove: (file) => {
            setFileList(prev => prev.filter(f => f.uid !== file.uid));
        },
        beforeUpload: (file) => {
            setFileList(prev => [...prev, file]);
            return false; // prevent auto upload
        },
        fileList,
    };

    const openModalDownload = () => {
        setOpenModal(true);
    };

    const closeModalDownload = () => {
        setOpenModal(false);
    };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include',
        });
        dispatch({ type: "user/clearUser" });
        navigate("/login");
    };

    return (
        <>
            {contextHolder}
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <Button onClick={openModalDownload} icon={<UploadOutlined />}>
                    Загрузить файлы
                </Button>
                <Button onClick={handleLogout} icon={<LogoutOutlined />} danger>
                    Выйти
                </Button>
                <Space align="center" style={{ marginLeft: "auto" }}>
                    <UserOutlined style={{ fontSize: 20, color: "white" }} />
                    <Text style={{ color: "white" }}>
                        {user ? (user as UserData).fio : "Гость"}
                    </Text>
                </Space>

                <Modal open={openModal} onCancel={closeModalDownload} footer={null} title="Загрузка файлов">
                    <Dragger {...props} style={{ marginTop: 25 }}>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Нажмите или перетащите файл в эту область для загрузки</p>
                        <p className="ant-upload-hint">Поддержка одиночной или массовой загрузки</p>
                    </Dragger>
                    <Button
                        type="primary"
                        onClick={handleUpload}
                        disabled={fileList.length === 0}
                        loading={uploading}
                        style={{ marginTop: 16, width: "100%" }}
                    >
                        {uploading ? 'Загрузка...' : 'Начать загрузку'}
                    </Button>
                </Modal>
            </div>
        </>
    );
};

export default Header;
