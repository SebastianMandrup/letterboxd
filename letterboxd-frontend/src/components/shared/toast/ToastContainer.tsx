import { useToastStore } from '../../../stores/useToastStore';
import styles from './toast.module.css';
import Toast from './Toast';

export const ToastContainer = () => {
	const { toasts } = useToastStore();

	return (
		<div className={styles.toastContainer}>
			{toasts.map((toast) => (
				<Toast
					key={toast.id}
					message={toast.message}
					type={toast.type}
				/>
			))}
		</div>
	);
};