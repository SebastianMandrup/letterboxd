import { useState, type FunctionComponent, useEffect } from 'react';
import SectionHeader from '../shared/sectionHeader/SectionHeader';
import ListComment from './ListComment';
import { useUserStore } from '../../stores/useUserStore';
import styles from './listComments.module.css';
import useComments from '../../hooks/comments/useComments';
import type CommentDto from '../../DTO/CommentDto';
import { useToastStore } from '../../stores/useToastStore';
import useAddComment from '../../hooks/comments/useAddComment';

interface ListCommentsProps {
    listId: number;
}

const ListComments: FunctionComponent<ListCommentsProps> = ({ listId }) => {
    const { data, isLoading, error } = useComments(listId);
    const [comments, setComments] = useState<CommentDto[]>([]);
    const isAuthenticated = useUserStore((state) => state.isAuthenticated());
    const { addToast } = useToastStore();

    // Get the mutation hook at the top level
    const addCommentMutation = useAddComment(listId);

    useEffect(() => {
        if (data) {
            setComments(data);
        }
    }, [data]);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const contentInput = form.elements.namedItem('contentInput') as HTMLTextAreaElement;

        addCommentMutation.mutate(contentInput.value, {
            onSuccess: (response) => {
                contentInput.value = '';
                setComments((prevComments) => [...prevComments, response.data]);
                addToast('Comment added successfully', 'success');
            },
            onError: (err) => {
                console.error('Error adding comment:', err);
                addToast(err.message, 'error');
            },
        });
    };

    // TODO: error and loading combined component
    if (error) {
        console.error('Error fetching comments:', error);
        addToast('Error fetching comments', 'error');
        return null;
    }

    if (isLoading) {
        return <div>Loading comments...</div>;
    }

    return (
        <section>
            <SectionHeader title={`${comments.length > 0 ? comments.length : ''} Comments`} />
            <section>{comments.length > 0 ? comments.map((comment) => <ListComment key={comment.id} comment={comment} />) : 'No comments available.'}</section>
            {isAuthenticated && (
                <form className={styles.form} onSubmit={handleSubmit}>
                    <textarea name="contentInput" placeholder="Add a comment..." rows={4} className={styles.textarea} required />
                    <button className={styles.button} type="submit">
                        POST
                    </button>
                </form>
            )}
        </section>
    );
};

export default ListComments;
