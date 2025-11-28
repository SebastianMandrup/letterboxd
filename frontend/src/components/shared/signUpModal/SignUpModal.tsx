import userService from '../../../services/userService';
import styles from './signUpModal.module.css';

interface SignUpModalProps {
  setIsSigningUp: (value: boolean) => void;
}

function SignUpModal({ setIsSigningUp }: SignUpModalProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isAtLeast16 = (
      event.currentTarget.elements.namedItem('ageAndTos') as HTMLInputElement
    ).checked;
    const acceptedTos = (
      event.currentTarget.elements.namedItem(
        'privacyPolicy',
      ) as HTMLInputElement
    ).checked;

    if (!isAtLeast16) {
      alert('You must be at least 16 years old to sign up.');
      return;
    }

    if (!acceptedTos) {
      alert('You must accept the privacy policy to sign up.');
      return;
    }

    userService
      .create({
        email: (
          event.currentTarget.elements.namedItem('email') as HTMLInputElement
        ).value,
        username: (
          event.currentTarget.elements.namedItem('username') as HTMLInputElement
        ).value,
        password: (
          event.currentTarget.elements.namedItem('password') as HTMLInputElement
        ).value,
      })
      .then(() => {
        setIsSigningUp(false);
        alert('Sign up successful! You can now log in.');
      })
      .catch((error: Error) => {
        alert('Sign up failed: ' + error.message);
      });
  };

  return (
    <div className={styles.divSignUpModal}>
      <section className={styles.sectionSignUpModal}>
        <h1>JOIN BOXEDLETTER</h1>
        <button
          className={styles.buttonCloseSignUpModal}
          onClick={() => setIsSigningUp(false)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <form
          onSubmit={(event) => handleSubmit(event)}
          className={styles.formSignUpModal}
        >
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
            <input
              type="checkbox"
              name="ageAndTos"
              className={styles.inputCheckbox}
            />
            <span>
              I&apos;m at least 16 years old, and I accept the
              <button>terms of service</button>
            </span>
          </label>
          <label className={styles.labelCheckbox}>
            <input
              type="checkbox"
              name="privacyPolicy"
              className={styles.inputCheckbox}
            />
            <span>
              I accept the
              <button>privacy policy</button>
              and consent to the processing of my personal information in
              accordance with it
            </span>
          </label>
          <button type="submit" className={styles.buttonSubmitSignUpModal}>
            Sign up
          </button>
        </form>
      </section>
    </div>
  );
}

export default SignUpModal;
