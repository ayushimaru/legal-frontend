import { useState } from 'react';
import { Alert } from 'antd';

const AlertComponent = ({ message, type, onClose }: { message: string, type: any, onClose: any }) => {
  const [visible, setVisible] = useState(true);

  const handleClose = () => {
    setVisible(false);
    onClose && onClose();
  };

  return (
    <Alert
      message={message}
      type={type}
      className='w-96 absolute top-10 right-12'
      showIcon
      closable
      onClose={handleClose}
      style={{ display: visible ? 'flex' : 'none' }}
    />
  );
};

export default AlertComponent;
