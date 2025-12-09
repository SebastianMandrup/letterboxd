import { useState, type FunctionComponent, useEffect } from 'react';
import SectionHeader from '../shared/sectionHeader/SectionHeader';
import ListComment from './ListComment';
import { useUserStore } from '../../stores/useUserStore';
import styles from './listComments.module.css';
import useFetchComments from '../../hooks/useFetchComments';
import type CommentDto from '../../DTO/CommentDto';
import ListClient from '../../services/ListClient';
import { useToastStore } from '../../stores/useToastStore';

interface ListCommentsProps {
    id: number;
}

const ListComments: FunctionComponent<ListCommentsProps> = ({ id }) => {
    const { data, isLoading, error } = useFetchComments(id);
    const [comments, setComments] = useState<CommentDto[]>([]);
    const isAuthenticated = useUserStore((state) => state.isAuthenticated());
    const { addToast } = useToastStore();

    useEffect(() => {
        if (data) {
            setComments(data);
        }
    }, [data]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const contentInput = form.elements.namedItem('contentInput') as HTMLTextAreaElement;

        const response = await ListClient.addCommentToList(id, contentInput.value);
        contentInput.value = '';

        if (response.error) {
            addToast(response.error, 'error');
            return;
        }

        if (response.message && response.data) {
            const newComment = response.data;
            setComments((prevComments) => [...prevComments, newComment]);
            addToast(response.message, 'success');
        }
    };

    if (isLoading) {
        return <div>Loading comments...</div>;
    }

    if (error) {
        return <div>Error loading comments</div>;
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
