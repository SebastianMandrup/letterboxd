import type { FunctionComponent } from 'react';
import SectionHeader from '../shared/sectionHeader/SectionHeader';
import useUsers from '../../hooks/useUsers';
import FeaturedUserCard from './FeaturedUserCard';
import styles from './featuredMembers.module.css';

const FeaturedMembers: FunctionComponent = () => {
  const { data, isLoading, error } = useUsers({
    params: { sortBy: 'popular', pageSize: 5 },
  });

  return (
    <section>
      <SectionHeader title="Featured Members" />
      {isLoading && (
        <div className="spinnerContainer">
          <div className="spinner"></div>
        </div>
      )}
      {(error || !data) && <p>Error loading featured members.</p>}
      {data && (
        <ul className={styles.ul}>
          {data.results.map((user) => (
            <li key={user.id}>
              <FeaturedUserCard user={user} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default FeaturedMembers;
