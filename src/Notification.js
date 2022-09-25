import {notification } from 'antd';
export const openNotificationWithIcon =  (type, content) => {
    notification[type]({
        message: `${content}`,
    });
};

