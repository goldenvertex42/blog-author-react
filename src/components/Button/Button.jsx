import styles from "./Button.module.css"

export default function Button({ children, variant, className = '', ...props }) {
  return (
    <button 
      className={`${styles.btn} ${className}`} 
      data-variant={variant} // This acts as our "switch"
      {...props}
    >
      {children}
    </button>
  );
}