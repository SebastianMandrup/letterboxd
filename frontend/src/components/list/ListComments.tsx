import { type FunctionComponent } from 'react';
import SectionHeader from '../shared/sectionHeader/SectionHeader';
import ListComment from './ListComment';
import { useUserStore } from '../../stores/useUserStore';
import styles from './ListComments.module.css';
import useFetchComments from '../../hooks/useFetchComments';
import usePostComment from '../../hooks/usePostComment';

interface ListCommentsProps {
    id: number;
}

const ListComments: FunctionComponent<ListCommentsProps> = ({ id }) => {
    const { data: comments, isLoading, error } = useFetchComments(id);

    const isAuthenticated = useUserStore((state) => state.isAuthenticated());

    const useSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const { content } = event.target as HTMLFormElement;
        const response = await usePostComment(id, content.value);
        content.value = '';

        if (response.message === 'Comment added successfully') {
            alert('Comment posted successfully');
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
            <SectionHeader title={`${comments && comments.length > 0 ? comments.length : null} Comments`} />
            <section>
                {comments && comments.length > 0 ? comments.map((comment) => <ListComment key={comment.id} comment={comment} />) : 'No comments available.'}
            </section>
            {isAuthenticated ? (
                <form className={styles.form} onSubmit={useSubmit}>
                    <textarea name="content" placeholder="Add a comment..." rows={4} className={styles.textarea}></textarea>
                    <button className={styles.button} type="submit">
                        POST
                    </button>
                </form>
            ) : null}
        </section>
    );
};

export default ListComments;
