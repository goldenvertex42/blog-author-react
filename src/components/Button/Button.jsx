import styles from "./Button.module.css"

const Button = ({ children, onClick, type = "button" }) => {
  return (
    <button 
      className={styles.button64} 
      role="button" 
      onClick={onClick}
      type={type} // Crucial for form submission
    >
        <span className={styles.text}>{children}</span>
    </button>
  );
};

export default Button;