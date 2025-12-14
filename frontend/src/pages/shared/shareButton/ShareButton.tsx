import { useState, type FunctionComponent } from 'react';
import { useToastStore } from '../../../stores/useToastStore';
import styles from './shareButton.module.css';

const ShareButton: FunctionComponent = () => {
    const [showCopiedMessage, setShowCopiedMessage] = useState(false);
    const { addToast } = useToastStore();

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setShowCopiedMessage(true);
            setTimeout(() => setShowCopiedMessage(false), 2000);
        } catch (error) {
            console.error('Failed to copy movie link:', error);
            addToast('Failed to copy link', 'error');
        }
    };

    return (
        <button className={styles.shareButton} onClick={() => handleShare()}>
            {showCopiedMessage ? 'Link Copied!' : 'Share'}
        </button>
    );
};

export default ShareButton;
