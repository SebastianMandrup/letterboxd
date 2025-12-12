import type { FunctionComponent } from 'react';
import UserCard from '../userCard/UserCard';
import SectionHeader from '../sectionHeader/SectionHeader';
import usePopularReviewers from '../../../hooks/users/usePopularReviewers';

const SectionPopularReviewers: FunctionComponent = () => {
    const { data, isLoading, error } = usePopularReviewers();

    if (error) {
        return <div>Error loading popular reviewers.</div>;
    }

    if (isLoading || !data) {
        return (
            <div className="centeredContainer">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <section>
            <SectionHeader title="popular reviewers" />
            {data.results.map((user) => (
                <UserCard key={user.id} user={user} />
            ))}
        </section>
    );
};

export default SectionPopularReviewers;
