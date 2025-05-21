import { useState, useCallback } from 'react';
import { z } from 'zod';
import { ValidationResult } from '../types/blog';
import logger from '../../utils/logger';

interface ValidationState<T> {
  isValid: boolean;
  errors: Record<keyof T, string[]>;
  touched: Record<keyof T, boolean>;
}

interface UseFormValidationProps<T> {
  schema: z.ZodObject<any>;
  onValidationComplete?: (isValid: boolean, data: T | undefined) => void;
}

interface UseFormValidationReturn<T> {
  validate: (data: unknown) => ValidationResult<T>;
  validateField: (field: keyof T, value: unknown) => boolean;
  errors: Record<keyof T, string[]>;
  touched: Record<keyof T, boolean>;
  setTouched: (field: keyof T) => void;
  isValid: boolean;
  resetValidation: () => void;
}

export function useFormValidation<T>({
  schema,
  onValidationComplete
}: UseFormValidationProps<T>): UseFormValidationReturn<T> {
  const [validationState, setValidationState] = useState<ValidationState<T>>({
    isValid: false,
    errors: {} as Record<keyof T, string[]>,
    touched: {} as Record<keyof T, boolean>
  });

  const validate = useCallback((data: unknown): ValidationResult<T> => {
    try {
      const result = schema.safeParse(data);
      
      if (!result.success) {
        const formattedErrors: Record<keyof T, string[]> = {} as Record<keyof T, string[]>;
        
        result.error.errors.forEach(error => {
          const field = error.path[0] as keyof T;
          if (!formattedErrors[field]) {
            formattedErrors[field] = [];
          }
          formattedErrors[field].push(error.message);
        });

        setValidationState(prev => ({
          ...prev,
          isValid: false,
          errors: formattedErrors
        }));

        onValidationComplete?.(false, undefined);

        return {
          success: false,
          errors: result.error
        };
      }

      setValidationState(prev => ({
        ...prev,
        isValid: true,
        errors: {} as Record<keyof T, string[]>
      }));

      onValidationComplete?.(true, result.data);

      return {
        success: true,
        data: result.data as T
      };
    } catch (error) {
      logger.error('Validation error:', error);
      return {
        success: false,
        errors: error instanceof z.ZodError ? error : undefined
      };
    }
  }, [schema, onValidationComplete]);

  const validateField = useCallback((field: keyof T, value: unknown): boolean => {
    try {
      const fieldSchema = schema.shape[field as string] as z.ZodTypeAny;
      if (!fieldSchema) {
        logger.warn(`No schema found for field: ${String(field)}`);
        return false;
      }

      const result = fieldSchema.safeParse(value);
      
      setValidationState(prev => ({
        ...prev,
        errors: {
          ...prev.errors,
          [field]: result.success ? [] : [result.error.errors[0].message]
        }
      }));

      return result.success;
    } catch (error) {
      logger.error(`Field validation error for ${String(field)}:`, error);
      return false;
    }
  }, [schema]);

  const setTouched = useCallback((field: keyof T) => {
    setValidationState(prev => ({
      ...prev,
      touched: {
        ...prev.touched,
        [field]: true
      }
    }));
  }, []);

  const resetValidation = useCallback(() => {
    setValidationState({
      isValid: false,
      errors: {} as Record<keyof T, string[]>,
      touched: {} as Record<keyof T, boolean>
    });
  }, []);

  return {
    validate,
    validateField,
    errors: validationState.errors,
    touched: validationState.touched,
    setTouched,
    isValid: validationState.isValid,
    resetValidation
  };
}

// Example usage:
/*
interface BlogFormData {
  title: string;
  content: string;
  category: string;
}

const blogFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  content: z.string().min(1, 'Content is required'),
  category: z.string().min(1, 'Category is required')
});

const {
  validate,
  validateField,
  errors,
  touched,
  setTouched,
  isValid,
  resetValidation
} = useFormValidation<BlogFormData>({
  schema: blogFormSchema,
  onValidationComplete: (isValid, data) => {
    if (isValid && data) {
      // Handle valid form data
    }
  }
});
*/ 