import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, GetProp, Modal, Upload, UploadFile, UploadProps } from "antd"; // message
import React, { useEffect, useState } from "react";
import { useAppDispatch } from "src/store/hooks";
import { FileData } from "./DocumentsList/types";

const { Dragger } = Upload;
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const header = () => {
    const dispatch = useAppDispatch();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [uploading, setUploading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const handleUpload = () => {
        const formData = new FormData();
        fileList.forEach((file) => {
            formData.append('files', file as FileType);
        });
        setUploading(true);
        fetch('/api/upload_files', {
            method: 'POST',
            body: formData,
        })
            .then((res) => res.json())
            .then((newFiles: FileData[]) => {
                // Dispatch action to add new files to the Redux store
                newFiles.forEach(file => {
                    dispatch({ type: "files/addFile", payload: file });
                });
                setFileList([]);
            })
            .catch(() => {
                // message.error('upload failed.');
            })
            .finally(() => {
                setOpenModal(false)
                setUploading(false);
            });
    };


    const props: UploadProps = {
        onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: (file) => {
            setFileList([...fileList, file]);
            return false;
        },
        fileList,
    };

    const fetchFiles = async () => {
        const response = await fetch('/api/get_files');
        const data = await response.json();
        if (Array.isArray(data)) {
            data.forEach(file => {
                dispatch({ type: "files/addFile", payload: file });
            });
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    const openModalDownload = () => {
        setOpenModal(true);
    };
    const closeModalDownload = () => {
        setOpenModal(false);
    };

    return (
        <div>
            <Button onClick={openModalDownload} icon={<UploadOutlined />} />
            <Modal open={openModal} onCancel={closeModalDownload} footer={null}>
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
                    style={{ marginTop: 16 }}
                >
                    {uploading ? 'Загрузка' : 'Начать загрузку'}
                </Button>
            </Modal>
        </div>
    )
}

export default header;
