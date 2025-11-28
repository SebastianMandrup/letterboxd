import { useEffect, useState, type FunctionComponent } from 'react';
import styles from './toast.module.css';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning';
}

const Toast: FunctionComponent<ToastProps> = ({ message, type }) => {
  const [displayMessage, setDisplayMessage] = useState(message);

  useEffect(() => {
    setDisplayMessage(message);
    const timer = setTimeout(() => {
      setDisplayMessage('');
    }, 3000); // Toast disappears after 3 seconds

    return () => clearTimeout(timer);
  }, [message]);

  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      <p className={styles.message}>{displayMessage}</p>
    </div>
  );
};

export default Toast;
