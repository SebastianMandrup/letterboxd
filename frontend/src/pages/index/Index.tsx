import Backdrop from '../shared/backdrop/Backdrop';
import SectionFeaturedMovies from './sectionFeaturedMovies/SectionFeaturedMovies';
import SectionGetStarted from './sectionGetStarted/SectionGetStarted';
import SectionJustReviewed from './sectionJustReviewed/SectionJustReviewed';
import SectionLetterboxLetsYou from './sectionLetterboxLetsYou/SectionLetterboxLetsYou';

function IndexPage() {
    return (
        <>
            <Backdrop backdropPath={'es0N3A6vkLz2EmJavnM2M4urOEO.jpg'} title="Filmmakers on Filmmakers (2025)" />
            <SectionGetStarted />
            <SectionFeaturedMovies />
            <SectionLetterboxLetsYou />
            <SectionJustReviewed />
        </>
    );
}

export default IndexPage;
