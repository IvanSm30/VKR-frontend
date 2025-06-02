import { CheckOutlined, CloseOutlined, FileTextOutlined } from "@ant-design/icons";
import { Button, Card, List, Tooltip, Typography, Tag, Space } from "antd";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { FileData } from "../types";
import ContentDocumentDisplay from "../ContentDocument";

const { Title, Text } = Typography;

const PendingDocuments: React.FC = () => {
    const pendingFiles = useAppSelector(state => state.files.pendingFiles);
    const dispatch = useAppDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentFile, setCurrentFile] = useState<FileData | null>(null);

    if (pendingFiles.length === 0) {
        return (
            <div style={{ textAlign: "center", marginTop: 50 }}>
                <Title level={4} style={{ color: "#888" }}>Нет входящих документов</Title>
            </div>
        );
    }

    const acceptFiles = (file: FileData) => {
        fetch(`/api/accept_file/${file.id}`, {
            method: "PUT",
            credentials: "include",
        })
            .then((res) => res.json())
            .then(() => dispatch({ type: "files/acceptFile", payload: file }));
    };

    const rejectFiles = (file: FileData) => {
        fetch(`/api/delete_file/${file.id}`, {
            method: "DELETE",
            credentials: "include",
        })
            .then((res) => res.json())
            .then(() => {
                dispatch({ type: "files/rejectFile", payload: file });
            });
    };

    const showModal = (file: FileData) => {
        setCurrentFile(file);
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setCurrentFile(null);
    };

    return (
        <div style={{ maxWidth: 900, margin: "30px auto", padding: "0 20px" }}>
            <Title level={2} style={{ textAlign: "center", marginBottom: 30, color: "#1890ff" }}>
                Входящие документы
            </Title>

            <List
                grid={{ gutter: 16, column: 1 }}
                dataSource={pendingFiles}
                renderItem={file => (
                    <List.Item>
                        <Card
                            bordered={true}
                            hoverable
                            style={{
                                borderRadius: 8,
                                boxShadow: "0 4px 12px rgba(24, 144, 255, 0.15)",
                                backgroundColor: "#f0f5ff",
                                transition: "transform 0.2s",
                            }}
                            bodyStyle={{ padding: 20 }}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLElement).style.transform = "scale(1.02)";
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                            }}
                        >
                            <Space direction="vertical" size="small" style={{ width: "100%" }}>
                                <Title level={4} style={{ marginBottom: 0, color: "#096dd9" }}>
                                    {file.title}
                                </Title>
                                <Text strong>Дата создания: </Text>
                                <Text type="secondary">{new Date(file.date_created).toLocaleString()}</Text>

                                <Text strong>Тип: </Text>
                                <Tag color={file.content_type === "pdf" ? "red" : file.content_type === "docx" ? "blue" : "green"}>
                                    {file.content_type.toUpperCase()}
                                </Tag>

                                <Space size="middle" style={{ marginTop: 10 }}>
                                    <Tooltip title="Принять документ">
                                        <Button
                                            type="primary"
                                            shape="circle"
                                            icon={<CheckOutlined />}
                                            onClick={() => acceptFiles(file)}
                                            style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
                                            size="middle"
                                        />
                                    </Tooltip>

                                    <Tooltip title="Отклонить документ">
                                        <Button
                                            type="primary"
                                            danger
                                            shape="circle"
                                            icon={<CloseOutlined />}
                                            onClick={() => rejectFiles(file)}
                                            size="middle"
                                        />
                                    </Tooltip>

                                    <Tooltip title="Просмотреть документ">
                                        <Button
                                            shape="circle"
                                            icon={<FileTextOutlined />}
                                            onClick={() => showModal(file)}
                                            size="middle"
                                        />
                                    </Tooltip>
                                </Space>
                            </Space>
                        </Card>
                    </List.Item>
                )}
            />

            <ContentDocumentDisplay isModalOpen={isModalOpen} currentFile={currentFile} onCancel={handleCancel} />
        </div>
    );
};

export default PendingDocuments;
