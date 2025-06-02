import React, { useEffect, useState } from "react";
import { Modal, Tag, message } from "antd";
import { docsByAppointment, docsByTypes } from "src/additional";
import { FileData } from "../types";

interface ModalEditCategoriesCompProps {
    open: boolean;
    file: FileData | null;
    onCancel: () => void;
}

const EditCategoriesComponent: React.FC<ModalEditCategoriesCompProps> = ({
    open,
    file,
    onCancel,
}) => {
    const [messageApi, contextHolder] = message.useMessage();

    const availableLabels = {
        "По назначению": docsByAppointment,
        "По типу": docsByTypes,
    };

    const [newLabelsFile, setNewLabelsFile] = useState<{
        "По назначению": string[];
        "По типу": string;
    }>({
        "По назначению": [],
        "По типу": "",
    });

    useEffect(() => {
        if (file && file.labels) {
            setNewLabelsFile({
                "По назначению": Array.isArray(file.labels["По назначению"])
                    ? file.labels["По назначению"]
                    : [],
                "По типу": typeof file.labels["По типу"] === "string"
                    ? file.labels["По типу"]
                    : "",
            });
        } else {
            setNewLabelsFile({
                "По назначению": [],
                "По типу": "",
            });
        }
    }, [file, open]);

    const [draggedLabel, setDraggedLabel] = useState<{
        categoryType: "По назначению" | "По типу";
        label: string;
        source: "available" | "selected";
    } | null>(null);

    const onDragStart = (
        e: React.DragEvent,
        categoryType: "По назначению" | "По типу",
        label: string,
        source: "available" | "selected"
    ) => {
        setDraggedLabel({ categoryType, label, source });
        e.dataTransfer.effectAllowed = "move";
    };

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const onDropToSelected = (categoryType: "По назначению" | "По типу") => {
        if (!draggedLabel) return;

        if (draggedLabel.categoryType !== categoryType) return;

        if (categoryType === "По назначению") {
            if (
                draggedLabel.source === "available" &&
                !newLabelsFile["По назначению"].includes(draggedLabel.label)
            ) {
                setNewLabelsFile((prev) => ({
                    ...prev,
                    "По назначению": [...prev["По назначению"], draggedLabel.label],
                }));
            } else if (
                draggedLabel.source === "selected" &&
                categoryType === "По назначению"
            ) {
            }
        } else if (categoryType === "По типу") {
            setNewLabelsFile((prev) => ({
                ...prev,
                "По типу": draggedLabel.label,
            }));
        }
        setDraggedLabel(null);
    };

    const onDropToAvailable = (categoryType: "По назначению" | "По типу") => {
        if (!draggedLabel) return;
        if (draggedLabel.categoryType !== categoryType) return;

        if (draggedLabel.source === "selected") {
            if (categoryType === "По назначению") {
                setNewLabelsFile((prev) => ({
                    ...prev,
                    "По назначению": prev["По назначению"].filter(
                        (l) => l !== draggedLabel.label
                    ),
                }));
            } else if (categoryType === "По типу") {
                setNewLabelsFile((prev) => ({
                    ...prev,
                    "По типу": "",
                }));
            }
        }
        setDraggedLabel(null);
    };

    const onRemoveSelected = (
        categoryType: "По назначению" | "По типу",
        label: string
    ) => {
        if (categoryType === "По назначению") {
            setNewLabelsFile((prev) => ({
                ...prev,
                "По назначению": prev["По назначению"].filter((l) => l !== label),
            }));
        } else if (categoryType === "По типу") {
            setNewLabelsFile((prev) => ({
                ...prev,
                "По типу": "",
            }));
        }
    };

    const onEdit = async () => {
        const file_id = file?.id;
        console.log('file_id', file_id)
        try {
            const response = await fetch("/api/editing_categories", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    id: file_id,
                    labels: newLabelsFile,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                messageApi.error("Ошибка при сохранении категорий: " + errorData.detail);
                return;
            }
            messageApi.success("Категории успешно сохранены");
            onCancel();
        } catch (error) {
            messageApi.error("Ошибка при сохранении категорий");
        }
    };

    return (
        <>
            {contextHolder}
            <Modal
                title="Редактирование категорий"
                open={open}
                onCancel={onCancel}
                onOk={onEdit}
                okText="Изменить"
                cancelText="Отмена"
                width={800}
            >
                <div style={{ display: "flex", gap: 24 }}>
                    {/* Доступные категории */}
                    <div style={{ flex: 1 }}>
                        <h3>Доступные категории</h3>
                        {Object.entries(availableLabels).map(([categoryType, labels]) => (
                            <div
                                key={categoryType}
                                onDragOver={onDragOver}
                                onDrop={() => onDropToAvailable(categoryType as any)}
                                style={{
                                    marginBottom: 16,
                                    border: "1px solid #ddd",
                                    borderRadius: 4,
                                    padding: 8,
                                    minHeight: 80,
                                    backgroundColor: "#fafafa",
                                }}
                            >
                                <h4>{categoryType}</h4>
                                {labels.map((label) => {
                                    const isSelected =
                                        categoryType === "По назначению"
                                            ? newLabelsFile["По назначению"].includes(label)
                                            : newLabelsFile["По типу"] === label;
                                    return (
                                        <Tag
                                            key={label}
                                            color={isSelected ? "default" : "blue"}
                                            draggable={!isSelected}
                                            onDragStart={(e) =>
                                                onDragStart(
                                                    e,
                                                    categoryType as any,
                                                    label,
                                                    "available"
                                                )
                                            }
                                            style={{
                                                userSelect: "none",
                                                marginBottom: 4,
                                                cursor: isSelected ? "not-allowed" : "grab",
                                                opacity: isSelected ? 0.5 : 1,
                                                display: "inline-block",
                                                marginRight: 8,
                                            }}
                                        >
                                            {label}
                                        </Tag>
                                    );
                                })}
                            </div>
                        ))}
                    </div>

                    <div style={{ flex: 1 }}>
                        <h3>Выбранные категории</h3>
                        {(["По назначению", "По типу"] as const).map((categoryType) => (
                            <div
                                key={categoryType}
                                onDragOver={onDragOver}
                                onDrop={() => onDropToSelected(categoryType)}
                                style={{
                                    marginBottom: 16,
                                    border: "1px solid #1890ff",
                                    borderRadius: 4,
                                    padding: 8,
                                    minHeight: 80,
                                    backgroundColor: "#e6f7ff",
                                    minWidth: 150,
                                }}
                            >
                                <h4>{categoryType}</h4>
                                {categoryType === "По назначению"
                                    ? newLabelsFile["По назначению"].map((label) => (
                                        <Tag
                                            key={label}
                                            color="blue"
                                            draggable
                                            onDragStart={(e) =>
                                                onDragStart(e, categoryType, label, "selected")
                                            }
                                            closable
                                            onClose={() => onRemoveSelected(categoryType, label)}
                                            style={{
                                                userSelect: "none",
                                                marginBottom: 4,
                                                cursor: "grab",
                                                display: "inline-block",
                                                marginRight: 8,
                                            }}
                                        >
                                            {label}
                                        </Tag>
                                    ))
                                    : newLabelsFile["По типу"] && (
                                        <Tag
                                            color="blue"
                                            draggable
                                            onDragStart={(e) =>
                                                onDragStart(
                                                    e,
                                                    categoryType,
                                                    newLabelsFile["По типу"],
                                                    "selected"
                                                )
                                            }
                                            closable
                                            onClose={() =>
                                                onRemoveSelected(categoryType, newLabelsFile["По типу"])
                                            }
                                            style={{
                                                userSelect: "none",
                                                marginBottom: 4,
                                                cursor: "grab",
                                                display: "inline-block",
                                                marginRight: 8,
                                            }}
                                        >
                                            {newLabelsFile["По типу"]}
                                        </Tag>
                                    )}
                            </div>
                        ))}
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default EditCategoriesComponent;
