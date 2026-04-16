import styles from "./Button.module.css"

const Button = ({ children, onClick, type = "button", ...props }) => {
  return (
    <button 
      className={styles.button64} 
      role="button" 
      onClick={onClick}
      type={type}
      {...props}
    >
        <span className={styles.text}>{children}</span>
    </button>
  );
};

export default Button;