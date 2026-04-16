export default function Input({ id, label, error, ...props }) {
  return (
    <div className="input-group">
      <label htmlFor={id}>{label}</label>
      <input 
        id={id} 
        {...props}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
}