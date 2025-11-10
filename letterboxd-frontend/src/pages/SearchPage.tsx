import { useParams } from 'react-router-dom';

function SearchPage() {

    const query = useParams().query;

    return (
        <>
            SEARCH - {query}
        </>
    );
}

export default SearchPage;