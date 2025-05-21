import { useState, useCallback, useEffect } from 'react';
import logger from '../utils/logger';

type ValidationRule<T> = (value: T) => string | null;
type ValidationRules<T> = Record<keyof T, ValidationRule<T[keyof T]>[]>;
type ValidationErrors<T> = Partial<Record<keyof T, string>>;

interface UseFormValidationOptions<T> {
  initialValues: T;
  validationRules: ValidationRules<T>;
  onSubmit?: (values: T) => void | Promise<void>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

interface UseFormValidationResult<T> {
  values: T;
  errors: ValidationErrors<T>;
  touched: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
  handleChange: (field: keyof T, value: T[keyof T]) => void;
  handleBlur: (field: keyof T) => void;
  handleSubmit: (e?: React.FormEvent) => Promise<void>;
  setFieldValue: (field: keyof T, value: T[keyof T]) => void;
  setFieldError: (field: keyof T, error: string | null) => void;
  setFieldTouched: (field: keyof T, isTouched?: boolean) => void;
  resetForm: () => void;
  validateField: (field: keyof T) => Promise<string | null>;
  validateForm: () => Promise<boolean>;
}

/**
 * Custom hook for form validation and error handling
 */
export function useFormValidation<T extends Record<string, unknown>>({
  initialValues,
  validationRules,
  onSubmit,
  validateOnChange = true,
  validateOnBlur = true
}: UseFormValidationOptions<T>): UseFormValidationResult<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors<T>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  /**
   * Validates a single field
   */
  const validateField = useCallback(async (field: keyof T): Promise<string | null> => {
    const fieldRules = validationRules[field] || [];
    const value = values[field];

    for (const rule of fieldRules) {
      try {
        const error = await Promise.resolve(rule(value));
        if (error) {
          return error;
        }
      } catch (err) {
        logger.error('Validation error:', {
          field: String(field),
          error: err instanceof Error ? err.message : String(err)
        });
        return 'Validation failed';
      }
    }

    return null;
  }, [values, validationRules]);

  /**
   * Validates all form fields
   */
  const validateForm = useCallback(async (): Promise<boolean> => {
    const validationPromises = Object.keys(validationRules).map(async (field) => {
      const error = await validateField(field as keyof T);
      return { field, error };
    });

    const validationResults = await Promise.all(validationPromises);
    const newErrors: ValidationErrors<T> = {};
    let isValid = true;

    validationResults.forEach(({ field, error }) => {
      if (error) {
        newErrors[field as keyof T] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [validateField, validationRules]);

  /**
   * Handles field value changes
   */
  const handleChange = useCallback((field: keyof T, value: T[keyof T]) => {
    setValues(prev => ({ ...prev, [field]: value }));
    
    if (validateOnChange) {
      validateField(field).then(error => {
        setErrors(prev => ({
          ...prev,
          [field]: error || undefined
        }));
      });
    }
  }, [validateOnChange, validateField]);

  /**
   * Handles field blur events
   */
  const handleBlur = useCallback((field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }));

    if (validateOnBlur) {
      validateField(field).then(error => {
        setErrors(prev => ({
          ...prev,
          [field]: error || undefined
        }));
      });
    }
  }, [validateOnBlur, validateField]);

  /**
   * Handles form submission
   */
  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    setIsSubmitting(true);
    const isValid = await validateForm();

    if (isValid && onSubmit) {
      try {
        await onSubmit(values);
      } catch (err) {
        logger.error('Form submission error:', {
          error: err instanceof Error ? err.message : String(err)
        });
      }
    }

    setIsSubmitting(false);
  }, [values, validateForm, onSubmit]);

  /**
   * Resets the form to its initial state
   */
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched(initialTouched);
  }, [initialValues, initialTouched]);

  /**
   * Sets a field's value directly
   */
  const setFieldValue = useCallback((field: keyof T, value: T[keyof T]) => {
    handleChange(field, value);
  }, [handleChange]);

  /**
   * Sets a field's error directly
   */
  const setFieldError = useCallback((field: keyof T, error: string | null) => {
    setErrors(prev => ({
      ...prev,
      [field]: error || undefined
    }));
  }, []);

  /**
   * Sets a field's touched state directly
   */
  const setFieldTouched = useCallback((field: keyof T, isTouched = true) => {
    setTouched(prev => ({
      ...prev,
      [field]: isTouched
    }));
  }, []);

  // Validate form on mount if validateOnChange is true
  useEffect(() => {
    if (validateOnChange) {
      validateForm();
    }
  }, [validateOnChange, validateForm]);

  const isValid = Object.keys(errors).length === 0;
  const isDirty = Object.keys(touched).length > 0;

  return {
    values,
    errors,
    touched,
    isValid,
    isDirty,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    resetForm,
    validateField,
    validateForm
  };
} 