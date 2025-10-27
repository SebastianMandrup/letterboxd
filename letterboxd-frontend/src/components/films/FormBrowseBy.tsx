import styles from './formBrowseBy.module.css';

const FormBrowseBy = () => {
    return (
        <form className={styles.formBrowseBy}>
            <label>
                BROWSE BY
                <select name="YEAR" id="">
                    <option value="">YEAR</option>
                    <option value="all">ALL</option>
                    <option value="upcoming">UPCOMING</option>
                    <option value="2020s">2020s</option>
                    <option value="2010s">2010s</option>
                    <option value="2000s">2000s</option>
                    <option value="1990s">1990s</option>
                    <option value="1980s">1980s</option>
                    <option value="1970s">1970s</option>
                    <option value="1960s">1960s</option>
                    <option value="1950s">1950s</option>
                </select>
                <select name="rating" id="">
                    <option value="">RATING</option>
                    <option value="highest">Highest First</option>
                    <option value="lowest">Lowest First</option>
                    <option value="lowest">Top 250 Narrative Features</option>
                    <option value="lowest">Top 250 Documentaries</option>
                </select>
                <select name="popular" id="">
                    <option value="">POPULAR</option>
                    <option value="allTime">All Time</option>
                    <option value="thisYear">This Year</option>
                    <option value="thisMonth">This Month</option>
                    <option value="thisWeek">This Week</option>
                </select>
                <select name="genre" id="">
                    <option value="">GENRE</option>
                    <option value="action">Action</option>
                    <option value="comedy">Comedy</option>
                    <option value="drama">Drama</option>
                    <option value="horror">Horror</option>
                    <option value="sciFi">Sci-Fi</option>
                    <option value="documentary">Documentary</option>
                </select>
            </label>
        </form>
    );
}

export default FormBrowseBy;