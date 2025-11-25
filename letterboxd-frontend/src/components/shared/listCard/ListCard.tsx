import type { FunctionComponent } from "react";
import type ListDto from "../../../DTO/ListDto";
import styles from "./listCard.module.css";
import { Link } from "react-router-dom";
import { getSlug } from "../../../services/getSlug";

interface ListCardProps {
	list: ListDto;
}

const ListCard: FunctionComponent<ListCardProps> = ({ list }) => {

	const firstFiveMovies = list.movies.slice(0, 5);

	return (
		<article className={styles.listCard}>
			<Link to={`/lists/${getSlug(list.name)}`}>
				<section className={styles.posterStack}>
					{firstFiveMovies.map((movie, index) => (
						<img
							key={movie.id}
							src={movie.posterUrl ?? "/placeholder-movie"}
							alt={movie.title}
							className={styles.posterImage}
							style={{
								left: `${index * 38}px`, // overlap offset
								zIndex: list.movies.length - index
							}}
						/>
					))}
				</section>
			</Link>
			<section className={styles.listInfo}>
				<a className={styles.listName} href={`/lists/${getSlug(list.name)}`}>{list.name}</a>
				<a className={styles.listAuthor} href={`/users/${getSlug(list.user.username)}`}>Created by
					<span className={styles.username}>
						{list.user.username}
					</span>
				</a>
			</section>
		</article >
	);
};

export default ListCard;
