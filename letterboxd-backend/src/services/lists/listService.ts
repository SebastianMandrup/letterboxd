import { SelectQueryBuilder } from "typeorm";
import { AppDataSource } from "../../data-source";
import { List } from "../../entities/List";

const listRepository = AppDataSource.getRepository(List);

const START_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 40;

const addFeaturedFilter = (
	queryBuilder: SelectQueryBuilder<List>,
	featured?: boolean
) => {
	if (featured) {
		queryBuilder.andWhere("list.id IN (:...ids)", {
			ids: [27, 44, 14, 17]
		})
			.leftJoinAndSelect("list.movies", "movie")
			.leftJoin("list.user", "user")
			.addSelect(["user.username"])
			.loadRelationCountAndMap("list.likeCount", "list.likes")
			.loadRelationCountAndMap("list.commentCount", "list.comments");
	}
};

const getMoviesQueryBuilder = async (req: any) => {
	const queryBuilder = listRepository.createQueryBuilder("list");
	const featured = req.query.featured === "true";
	addFeaturedFilter(queryBuilder, featured);

	return queryBuilder;
};

export const getLists = async (req: any) => {
	const page = req.query.page ? Number(req.query.page) : START_PAGE;
	let pageSize = req.query.pageSize ? Number(req.query.pageSize) : DEFAULT_PAGE_SIZE;

	if (pageSize > MAX_PAGE_SIZE) pageSize = MAX_PAGE_SIZE;

	const queryBuilder = await getMoviesQueryBuilder(req);

	try {
		queryBuilder.skip((page - 1) * pageSize).take(pageSize);

		const [lists, total] = await queryBuilder.getManyAndCount();

		return { lists, total };
	} catch (error) {
		console.error("Error fetching lists:", error);
		return { lists: [], total: 0 };
	}
};