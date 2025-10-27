import Backdrop from '../components/index/backdrop/Backdrop'
import SectionFeaturedMovies from '../components/index/sectionFeaturedMovies/SectionFeaturedMovies'
import SectionGetStarted from '../components/index/sectionGetStarted/SectionGetStarted'
import SectionJustReviewed from '../components/index/sectionJustReviewed/SectionJustReviewed'
import SectionLetterboxLetsYou from '../components/index/sectionLetterboxLetsYou/SectionLetterboxLetsYou'
import SectionRecentStories from '../components/index/sectionRecentStories/SectionRecentStories'
import Footer from '../components/shared/footer/Footer'
import Header from '../components/shared/header/Header'
import styles from './index.module.css'

function IndexPage() {

  return (
    <>
      <Header />
      <Backdrop src="./backdrop.png" alt="backdrop" caption="FILMMAKERS ON FILMMAKERS (2025)" />
      <main className={styles.mainIndex}>
        <SectionGetStarted />
        <SectionFeaturedMovies />
        <SectionLetterboxLetsYou />
        <SectionJustReviewed />
        <SectionRecentStories />
      </main>
      <Footer />
    </>
  )
}

export default IndexPage
