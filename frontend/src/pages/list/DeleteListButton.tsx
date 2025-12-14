import { useState, type FunctionComponent } from 'react';
import { useUserStore } from '../../stores/useUserStore';
import type ListDto from '../../DTO/ListDto';
import styles from './deleteListButton.module.css';
import DeleteIcon from '../shared/icons/DeleteIcon';
import { redirect } from 'react-router-dom';
import useDeleteList from '../../hooks/lists/useDeleteList';
import { useToastStore } from '../../stores/useToastStore';

interface DeleteListButtonProps {
    list: ListDto;
}

const DeleteListButton: FunctionComponent<DeleteListButtonProps> = ({ list }) => {
    const { user } = useUserStore();
    const [isDeleting, setIsDeleting] = useState(false);
    const deleteListMutation = useDeleteList();
    const { addToast } = useToastStore();

    if (user?.username !== list.user.username) {
        return null;
    }

    const handleDeleteClick = () => {
        setIsDeleting(true);
    };

    const handleDeleteMutation = () => {
        deleteListMutation.mutate(list.id, {
            onSuccess: () => {
                addToast('List deleted successfully', 'success');
                redirect(`/user/${user?.username}`);
            },
            onError: (error) => {
                console.error('Error deleting list:', error);
                addToast(`${error.message}`, 'error');
                setIsDeleting(false);
            },
        });
    };

    return (
        <>
            {isDeleting && (
                <div className={styles.deleteListOverlay}>
                    <section className={styles.deleteListModal}>
                        <p>Are you sure you want to delete this list?</p>
                        <button className={styles.confirmDeleteButton} onClick={() => handleDeleteMutation()}>
                            Yes, Delete
                        </button>
                        <button className={styles.cancelDeleteButton} onClick={() => setIsDeleting(false)}>
                            Cancel
                        </button>
                    </section>
                </div>
            )}
            <button className="delete-list-button" onClick={() => handleDeleteClick()}>
                Delete List
                <DeleteIcon size={24} />
            </button>
        </>
    );
};

export default DeleteListButton;
