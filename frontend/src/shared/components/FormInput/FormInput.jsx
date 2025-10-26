import styles from "./FormInput.module.css";

const FormInput = ({
  label,
  type = "text",
  name,
  placeholder,
  required=true,
  register,
  error,
  onInputChange,
}) => {
  return (
    <div className={`${styles["input-form-wrapper"]} ${styles["form-group"]}`}>
      <label>
        {label}: {required && <span className={`${styles["required"]}`}>*</span>}
      </label>
      <div className={styles["input-container"]}>
        <input
          type={type}
          placeholder={placeholder}
          className={`form-control ${styles["input-form-form-control"]} ${
            error ? styles["is-invalid"] : ""
          }`}
            {...register(name)}
          onChange={onInputChange}
        />
      </div>
      {error && <div className="d-block invalid-feedback">{error.message}</div>}
    </div>
  );
};

export default FormInput;