import React, { useState, useCallback } from 'react';
import { z } from 'zod';
import { useFormValidation } from '../../hooks/useFormValidation';
import logger from '../../../utils/logger';

interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
}

interface CategoryFormProps {
  initialData?: Partial<CategoryFormData>;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  onCancel: () => void;
}

const categoryFormSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(50, 'Name must be less than 50 characters'),
  slug: z.string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format'),
  description: z.string()
    .max(200, 'Description must be less than 200 characters')
    .optional()
    .default('')
});

export function CategoryForm({ initialData, onSubmit, onCancel }: CategoryFormProps) {
  const [formData, setFormData] = useState<CategoryFormData>(() => ({
    name: '',
    slug: '',
    description: '',
    ...initialData
  }));

  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    validate,
    validateField,
    errors,
    touched,
    setTouched,
    isValid
  } = useFormValidation<CategoryFormData>({
    schema: categoryFormSchema,
    onValidationComplete: (isValid, data) => {
      if (isValid && data) {
        handleSubmit(data);
      }
    }
  });

  const handleSubmit = async (data: CategoryFormData) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
    } catch (error) {
      logger.error('Error submitting category form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = useCallback((
    field: keyof CategoryFormData,
    value: string
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    validateField(field, value);
  }, [validateField]);

  const handleBlur = useCallback((field: keyof CategoryFormData) => {
    setTouched(field);
    validateField(field, formData[field]);
  }, [setTouched, validateField, formData]);

  const generateSlug = useCallback((name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    handleChange('slug', slug);
  }, [handleChange]);

  const handleNameChange = useCallback((value: string) => {
    handleChange('name', value);
    if (!touched.slug) {
      generateSlug(value);
    }
  }, [handleChange, touched.slug, generateSlug]);

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        validate(formData);
      }}
    >
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={(e) => handleNameChange(e.target.value)}
          onBlur={() => handleBlur('name')}
          className={`mt-1 block w-full rounded-md shadow-sm ${
            touched.name && errors.name?.length
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }`}
        />
        {touched.name && errors.name?.length > 0 && (
          <p className="mt-1 text-sm text-red-600">{errors.name[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
          Slug
        </label>
        <input
          type="text"
          id="slug"
          name="slug"
          value={formData.slug}
          onChange={(e) => handleChange('slug', e.target.value)}
          onBlur={() => handleBlur('slug')}
          className={`mt-1 block w-full rounded-md shadow-sm ${
            touched.slug && errors.slug?.length
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }`}
        />
        {touched.slug && errors.slug?.length > 0 && (
          <p className="mt-1 text-sm text-red-600">{errors.slug[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          onBlur={() => handleBlur('description')}
          className={`mt-1 block w-full rounded-md shadow-sm ${
            touched.description && errors.description?.length
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }`}
        />
        {touched.description && errors.description?.length > 0 && (
          <p className="mt-1 text-sm text-red-600">{errors.description[0]}</p>
        )}
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !isValid}
          className={`rounded-md px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isSubmitting || !isValid
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
          }`}
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
} 