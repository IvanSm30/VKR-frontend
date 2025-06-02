import { Modal, Select, message } from "antd";
import React, { useState } from "react";
import { UserData } from "src/store/userSlice/types";
import { FileData } from "./DocumentsList/types";

interface ModalSendFileCompProps {
  recipients: UserData[];
  open: boolean;
  file: FileData | null;
  sender: UserData | {};
  onCancel: () => void;
}

const ModalSendFileComp: React.FC<ModalSendFileCompProps> = ({
  recipients,
  open,
  file,
  sender,
  onCancel,
}) => {
  const [recipient, setRecipient] = useState("");
  const options: Array<object> = [];
  const [messageApi, contextHolder] = message.useMessage();

  recipients.map((rec) => {
    if (rec.email !== (sender as UserData).email) {
      options.push({ value: rec.email, label: rec.email })
    }
  })

  const handleRecipientChange = (value: string) => {
    setRecipient(value);
  };

  const handleSend = async () => {
    if (!file || !recipient) {
      messageApi.error("Пожалуйста, укажите получателя");
      return;
    }

    const isConfirmed = window.confirm('Вы уверены, что хотите отправить этот файл?');
    if (!isConfirmed) {
      onCancel();
      return;
    }

    try {
      const response = await fetch("/api/send_file", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          file,
          sender,
          recipient,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        messageApi.error("Ошибка при отправке файла: " + errorData.detail);
        return;
      }

      messageApi.success("Файл успешно отправлен!");
      onCancel();
    } catch (error) {
      messageApi.error("Ошибка сети при отправке файла");
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        open={open}
        onCancel={onCancel}
        onOk={handleSend}
        okText="Отправить"
        cancelText="Отмена"
      >
        <div>
          <p>
            <b>Файл:</b> {file?.title}
          </p>
          <p>
            <b>Отправитель:</b> {"fio" in sender ? sender.fio : ""}
          </p>
          <p>
            <b>Получатель: </b>
            <Select
              style={{ width: 200 }}
              onChange={handleRecipientChange}
              options={options}
            />
          </p>
        </div>
      </Modal>
    </>
  );
};

export default ModalSendFileComp;
