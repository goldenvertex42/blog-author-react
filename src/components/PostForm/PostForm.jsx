import { Form, useNavigate, useNavigation, useActionData } from 'react-router';
import Input from '../Input/Input';
import Button from '../Button/Button';
import styles from './PostForm.module.css';

export default function PostForm({ initialData = {} }) {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const actionData = useActionData();
  const isSubmitting = navigation.state === "submitting";

  const errors = actionData?.errors || {};
  const serverError = actionData?.serverError;

  return (
    <Form method="post" className={styles.post_form}>
      {serverError && <p className="error-banner">{serverError}</p>}
      <Input 
        id="title" 
        label="Title" 
        name="title" 
        defaultValue={initialData.title || ''} 
        error={errors.title}
        required 
      />

      <div className={styles.textarea_group}>
        <label htmlFor="text">Text</label>
        <textarea 
          id="text" 
          name="text" 
          defaultValue={initialData.text || ''} 
          required 
        />
        {errors.text && <span className={styles.error_text}>{errors.text}</span>}
      </div>

      <div className={styles.checkbox_group}>
        <input 
          type="checkbox" 
          id="published" 
          name="published" 
          defaultChecked={initialData.published || false} 
        />
        <label htmlFor="published">Publish immediately</label>
      </div>

      <div className={styles.form_actions}>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting 
            ? 'Saving...' 
            : initialData.id ? 'Update Post' : 'Create Post'}
        </Button>
        <Button 
          type="button" 
          variant="secondary" 
          onClick={() => navigate(-1)}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </Form>
  );
}
