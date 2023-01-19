import { useState } from "react";
import styles from "./auth-modal.module.scss";
import EyeIcon from "@assets/icons/eye.svg";
import EyeOffIcon from "@assets/icons/eye-off.svg";
import PersonIcon from "@assets/icons/person.svg";
import EmailIcon from "@assets/icons/envelope-at.svg";
import ShieldIcon from "@assets/icons/shield-lock.svg";
import { useAuth, useError } from "@hooks";

export function AuthModal({ showAuthModal }: { showAuthModal: boolean }) {
  const [type, setType] = useState<"log-in" | "sign-up">("log-in");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { setIsLoggedIn } = useAuth();
  const { setError } = useError();

  const formSubmitHandler: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.currentTarget).entries());
    if (type === "sign-up" && formData.password !== formData["confirm-password"]) {
      return alert("Passwords dont match");
    }
    try {
      const res = await fetch(`/api/auth/${type}`, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.text();
      if (!res.ok) {
        throw new Error(data);
      }
      setIsLoggedIn(true);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  return (
    <div className={[styles.container, !showAuthModal && styles.hide].join(" ")}>
      <form className={styles.authModal} onSubmit={formSubmitHandler} autoComplete="off">
        <div className={styles.type} data-type={type}>
          <div>
            <button onClick={() => setType("log-in")}>Log In</button>
            <button onClick={() => setType("sign-up")}>Sign Up</button>
          </div>
          <hr className={styles.mover} />
          <hr className={styles.line} />
        </div>
        <div className={styles.inputUtil}>
          <PersonIcon />
          <input type="text" name="username" placeholder="Username" required />
        </div>
        {type === "sign-up" && (
          <div className={styles.inputUtil}>
            <EmailIcon />
            <input type="text" name="email" placeholder="Email" required />{" "}
          </div>
        )}
        <div className={styles.inputUtil}>
          <ShieldIcon />
          <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" required />
          <button type="button" onClick={() => setShowPassword((state) => !state)}>
            {showPassword ? <EyeIcon /> : <EyeOffIcon />}
          </button>
        </div>
        {type === "log-in" && <p className={styles.forgotPasswordLink}>Forgot password?</p>}
        {type === "sign-up" && (
          <div className={styles.inputUtil}>
            <ShieldIcon />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirm-password"
              placeholder="Confirm Password"
              required
            />
            <button type="button" onClick={() => setShowConfirmPassword((state) => !state)}>
              {showConfirmPassword ? <EyeIcon /> : <EyeOffIcon />}
            </button>
          </div>
        )}
        <button type="submit">{type === "sign-up" ? "Sign Up" : "Log In"}</button>
      </form>
    </div>
  );
}
