import styles from './signUpModal.module.css';

interface SignUpModalProps {
    setIsSigningUp: (value: boolean) => void;
}

function SignUpModal({ setIsSigningUp }: SignUpModalProps) {
    return (
        <div className={styles.divSignUpModal}>
            <section className={styles.sectionSignUpModal}>
                <h1>
                    JOIN BOXEDLETTER
                </h1>
                <button className={styles.buttonCloseSignUpModal} onClick={() => setIsSigningUp(false)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>

                <form action="" className={styles.formSignUpModal}>
                    <label>
                        Email address
                        <input type="email" name="email" />
                    </label>
                    <label className={styles.labelShort}>
                        Username
                        <input type="text" name="username" />
                    </label>
                    <label className={styles.labelShort}>
                        Password
                        <input type="password" name="password" />
                    </label>
                    <label className={styles.labelCheckbox}>
                        <input type="checkbox" name="ageAndTos" className={styles.inputCheckbox} />
                        <span>
                            I'm at least 16 years old, and I accept the
                            <a href="">terms of service</a>
                        </span>
                    </label>
                    <label className={styles.labelCheckbox}>
                        <input type="checkbox" name="privacyPolicy" className={styles.inputCheckbox} />
                        <span>
                            I accept the
                            <a href="">privacy policy</a>
                            and consent to the processing of my personal information in accordance with it
                        </span>
                    </label>
                    <button type='submit' className={styles.buttonSubmitSignUpModal}>
                        Sign up
                    </button>
                </form>
            </section>
        </div>
    );
}

export default SignUpModal;