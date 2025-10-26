import type { FunctionComponent } from 'react';
import styles from './sectionBrowseBy.module.css';

interface SectionBrowseByProps {

}

const SectionBrowseBy: FunctionComponent<SectionBrowseByProps> = () => {
    return (
        <section className={styles.sectionBrowseBy}>
            <label>
                browse by
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
                    <option value="highest">HIGHEST FIRST</option>
                    <option value="lowest">LOWEST FIRST</option>
                    <option value="lowest">Top 250 Narrative Features</option>
                    <option value="lowest">Top 250 Documentaries</option>
                </select>
            </label>
        </section>
    );
}

export default SectionBrowseBy;