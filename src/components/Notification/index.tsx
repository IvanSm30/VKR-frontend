import { notification } from "antd";

const NotificationComponent = (text: string) => {
    const [api, contextHolder] = notification.useNotification();

    const openNotification = () => {
        api.info({
            message: `Уведомление`,
            description: text,
            placement: "topRight",
        });
    };

    return { openNotification, contextHolder };
};

export default NotificationComponent;
