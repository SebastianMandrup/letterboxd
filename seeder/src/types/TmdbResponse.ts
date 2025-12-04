import TmdbMovie from './TmdbMovie';

export default interface TmdbResponse {
  page: number;
  results: TmdbMovie[];
  total_pages: number;
  total_results: number;
}
