import styles from './formSearchFilm.module.css';


const FormSearchFilm = () => {
    return (
        <form className={styles.formSearchFilm}>
            <label>
                FIND A FILM
                <input type="text" name='q' />
            </label>
        </form>
    );
}

export default FormSearchFilm;