import Backdrop from '../components/index/backdrop/Backdrop'
import SectionFeaturedMovies from '../components/index/sectionFeaturedMovies/SectionFeaturedMovies'
import SectionGetStarted from '../components/index/sectionGetStarted/SectionGetStarted'
import SectionJustReviewed from '../components/index/sectionJustReviewed/SectionJustReviewed'
import SectionLetterboxLetsYou from '../components/index/sectionLetterboxLetsYou/SectionLetterboxLetsYou'
import SectionRecentStories from '../components/index/sectionRecentStories/SectionRecentStories'


function IndexPage() {

  return (
    <>
      <Backdrop src="./backdrop.png" alt="backdrop" caption="FILMMAKERS ON FILMMAKERS (2025)" />
      <SectionGetStarted />
      <SectionFeaturedMovies />
      <SectionLetterboxLetsYou />
      <SectionJustReviewed />
      <SectionRecentStories />
    </>
  )
}

export default IndexPage
