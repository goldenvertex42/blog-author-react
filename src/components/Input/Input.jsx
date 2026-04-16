import styles from "./Input.module.css";

export default function Input({ id, label, error, ...props }) {
  return (
    <div className={styles.input_group}>
      <label htmlFor={id}>{label}</label>
      <input 
        id={id} 
        {...props}
      />
      {error && <span className={styles.error_message}>{error}</span>}
    </div>
  );
}