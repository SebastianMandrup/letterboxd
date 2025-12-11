import Backdrop from '../shared/backdrop/Backdrop';
import SectionFeaturedMovies from './sectionFeaturedMovies/SectionFeaturedMovies';
import SectionGetStarted from './sectionGetStarted/SectionGetStarted';
import SectionJustReviewed from './sectionJustReviewed/SectionJustReviewed';
import SectionLetterboxLetsYou from './sectionLetterboxLetsYou/SectionLetterboxLetsYou';

function IndexPage() {
    return (
        <>
            <Backdrop src="./backdrop.png" alt="backdrop" caption="FILMMAKERS ON FILMMAKERS (2025)" />
            <SectionGetStarted />
            <SectionFeaturedMovies />
            <SectionLetterboxLetsYou />
            <SectionJustReviewed />
        </>
    );
}

export default IndexPage;
