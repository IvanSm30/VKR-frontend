import React, { useEffect } from "react";
import { notification } from "antd";

const NotificationComponent: React.FC<{ text: string }> = ({ text }) => {
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    api.info({
      message: "Уведомление",
      description: text,
      placement: "topRight",
    });
  }, [api, text]);

  return <>{contextHolder}</>;
};

export default NotificationComponent;
