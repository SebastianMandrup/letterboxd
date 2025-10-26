import ButtonLetterboxLetsYou from './ButtonLetterboxLetsYou';
import styles from './sectionLetterboxLetsYou.module.css';

function SectionLetterboxLetsYou() {

    const eyeSvg = (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 5C6.5 5 2.3 8.1 1 12c1.3 3.9 5.5 7 11 7s9.7-3.1 11-7c-1.3-3.9-5.5-7-11-7zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" />
        </svg>
    )

    const heartSvg = (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
           2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09
           C13.09 3.81 14.76 3 16.5 3
           19.58 3 22 5.42 22 8.5
           c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
    )

    const editSvg = (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 17.25V21h3.75l11-11.03-3.75-3.75L3 17.25zM20.71 
           7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34
           a1.003 1.003 0 0 0-1.42 0l-1.83 1.83
           3.75 3.75 1.84-1.82z"/>
        </svg>
    )

    const starSvg = (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 
           9.24l-7.19-.61L12 2 9.19 8.63 
           2 9.24l5.46 4.73L5.82 21z"/>
        </svg>
    )

    const diarySvg = (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 
           2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 
           18H6V4h12v16z"/>
        </svg>
    )

    const listSvg = (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 6h2v2H4V6zm0 5h2v2H4v-2zm0 
           5h2v2H4v-2zm4-10h12v2H8V6zm0 
           5h12v2H8v-2zm0 5h12v2H8v-2z"/>
        </svg>
    )

    return (
        <section id={styles.sectionLetterboxLetsYou}>
            <h3 className='sectionHeader'>
                LETTERBOXD LETS YOU...

            </h3>
            <div id={styles.divLetterboxLetsYouButtons}>
                <ButtonLetterboxLetsYou svg={eyeSvg} text="Keep track of every movie you've ever watched (or just start from the day you join)." color="green" />
                <ButtonLetterboxLetsYou svg={heartSvg} text="Discover new movies and find out what your friends are watching and loving." color="orange" />
                <ButtonLetterboxLetsYou svg={editSvg} text="Write reviews and share your opinions with a community of film lovers." color="blue" />
                <ButtonLetterboxLetsYou svg={starSvg} text="Rate and review films to build a personal record of your film-watching journey." color="green" />
                <ButtonLetterboxLetsYou svg={diarySvg} text="Keep a diary of your film watching (and upgrade to pro for comprehensive stats)" color="orange" />
                <ButtonLetterboxLetsYou svg={listSvg} text="Compile and share lists of films on any topic and keep a watchlist of films to see" color="blue" />
            </div>
        </section >
    );
}

export default SectionLetterboxLetsYou;