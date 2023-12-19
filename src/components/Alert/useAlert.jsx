import { useState } from 'react';
import AlertComponent from './Alert';

const useAlert = () => {
  const [alertProps, setAlertProps] = useState({});
  const [visible, setVisible] = useState(false);

  const showAlert = (message, type = 'info', duration = 3000, onClose) => {
    setAlertProps({ message, type, onClose });
    setVisible(true);

    setTimeout(() => {
      setVisible(false);
      setAlertProps({});
    }, duration);
  };

  const closeAlert = () => {
    setVisible(false);
    setAlertProps({});
  };

  const Alert = () => visible && <AlertComponent {...alertProps} />;

  return {
    showAlert,
    closeAlert,
    Alert,
  };
};

export default useAlert;
