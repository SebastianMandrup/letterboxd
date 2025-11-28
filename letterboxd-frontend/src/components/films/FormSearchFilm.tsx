import { getSlug } from '../../services/getSlug';
import styles from './formSearchFilm.module.css';

const FormSearchFilm = () => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = formData.get('query') as string;
    window.location.href = `/movies/browse?title=${getSlug(query)}`;
  };

  return (
    <form className={styles.formSearchFilm} onSubmit={handleSubmit}>
      <label>
        FIND A FILM
        <input type="text" name="query" />
      </label>
    </form>
  );
};

export default FormSearchFilm;
