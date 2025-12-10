import Backdrop from '../components/index/backdrop/Backdrop';
import SectionFeaturedMovies from '../components/index/sectionFeaturedMovies/SectionFeaturedMovies';
import SectionGetStarted from '../components/index/sectionGetStarted/SectionGetStarted';
import SectionJustReviewed from '../components/index/sectionJustReviewed/SectionJustReviewed';
import SectionLetterboxLetsYou from '../components/index/sectionLetterboxLetsYou/SectionLetterboxLetsYou';

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
