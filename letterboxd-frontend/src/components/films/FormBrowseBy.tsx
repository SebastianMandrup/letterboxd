import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./formBrowseBy.module.css";

interface FormBrowseByProps {
    selectedDecade?: string;
    selectedRating?: string;
    selectedPopular?: string;
    selectedGenre?: string;
}

const FormBrowseBy = ({
    selectedDecade,
    selectedRating,
    selectedPopular,
    selectedGenre,
}: FormBrowseByProps) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const handleChange = (
        event: React.ChangeEvent<HTMLSelectElement>,
        key: string
    ) => {
        const value = event.target.value;

        // Clone current params so we keep all existing ones
        const newParams = new URLSearchParams(searchParams);

        if (value) {
            newParams.set(key, value);
        } else {
            newParams.delete(key); // if user resets dropdown
        }

        navigate(`/movies/browse?${newParams.toString()}`);
    };

    return (
        <form className={styles.formBrowseBy}>
            <label>
                BROWSE BY
                <select
                    name="YEAR"
                    value={selectedDecade || ""}
                    onChange={(e) => handleChange(e, "decade")}
                >
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

                <select
                    name="rating"
                    value={selectedRating || ""}
                    onChange={(e) => handleChange(e, "rating")}
                >
                    <option value="">RATING</option>
                    <option value="highest">Highest First</option>
                    <option value="lowest">Lowest First</option>
                    <option value="top250narrative">Top 250 Narrative Features</option>
                    <option value="top250doc">Top 250 Documentaries</option>
                </select>

                <select
                    name="popular"
                    value={selectedPopular || ""}
                    onChange={(e) => handleChange(e, "popular")}
                >
                    <option value="">POPULAR</option>
                    <option value="allTime">All Time</option>
                    <option value="thisYear">This Year</option>
                    <option value="thisMonth">This Month</option>
                    <option value="thisWeek">This Week</option>
                </select>

                <select
                    name="genre"
                    value={selectedGenre || ""}
                    onChange={(e) => handleChange(e, "genre")}
                >
                    <option value="">GENRE</option>
                    <option value="action">Action</option>
                    <option value="comedy">Comedy</option>
                    <option value="drama">Drama</option>
                    <option value="horror">Horror</option>
                    <option value="documentary">Documentary</option>
                </select>
            </label>
        </form>
    );
};

export default FormBrowseBy;
