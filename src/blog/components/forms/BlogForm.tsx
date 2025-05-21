import React, { useState, useCallback } from 'react';
import { z } from 'zod';
import { useFormValidation } from '../../hooks/useFormValidation';
import { BlogPost, BlogCategory } from '../../types/blog';
import logger from '../../../utils/logger';

interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  featured: boolean;
  status: BlogPost['status'];
}

interface BlogFormProps {
  initialData?: Partial<BlogFormData>;
  categories: BlogCategory[];
  onSubmit: (data: BlogFormData) => Promise<void>;
  onCancel: () => void;
}

const blogFormSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
  slug: z.string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format'),
  excerpt: z.string()
    .max(300, 'Excerpt must be less than 300 characters')
    .optional()
    .default(''),
  content: z.string()
    .min(1, 'Content is required'),
  category: z.string()
    .min(1, 'Category is required'),
  tags: z.array(z.string())
    .default([]),
  featured: z.boolean()
    .default(false),
  status: z.enum(['draft', 'published', 'archived'] as const)
    .default('draft')
});

export function BlogForm({ initialData, categories, onSubmit, onCancel }: BlogFormProps) {
  const [formData, setFormData] = useState<BlogFormData>(() => ({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    tags: [],
    featured: false,
    status: 'draft',
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
  } = useFormValidation<BlogFormData>({
    schema: blogFormSchema,
    onValidationComplete: (isValid, data) => {
      if (isValid && data) {
        handleSubmit(data);
      }
    }
  });

  const handleSubmit = async (data: BlogFormData) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
    } catch (error) {
      logger.error('Error submitting blog form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = useCallback((
    field: keyof BlogFormData,
    value: string | boolean | string[]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    validateField(field, value);
  }, [validateField]);

  const handleBlur = useCallback((field: keyof BlogFormData) => {
    setTouched(field);
    validateField(field, formData[field]);
  }, [setTouched, validateField, formData]);

  const generateSlug = useCallback((title: string) => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    handleChange('slug', slug);
  }, [handleChange]);

  const handleTitleChange = useCallback((value: string) => {
    handleChange('title', value);
    if (!touched.slug) {
      generateSlug(value);
    }
  }, [handleChange, touched.slug, generateSlug]);

  const handleStatusChange = useCallback((value: string) => {
    if (value === 'draft' || value === 'published' || value === 'archived') {
      handleChange('status', value);
    }
  }, [handleChange]);

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        validate(formData);
      }}
    >
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          onBlur={() => handleBlur('title')}
          className={`mt-1 block w-full rounded-md shadow-sm ${
            touched.title && errors.title?.length
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }`}
        />
        {touched.title && errors.title?.length > 0 && (
          <p className="mt-1 text-sm text-red-600">{errors.title[0]}</p>
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
        <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
          Excerpt
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          rows={3}
          value={formData.excerpt}
          onChange={(e) => handleChange('excerpt', e.target.value)}
          onBlur={() => handleBlur('excerpt')}
          className={`mt-1 block w-full rounded-md shadow-sm ${
            touched.excerpt && errors.excerpt?.length
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }`}
        />
        {touched.excerpt && errors.excerpt?.length > 0 && (
          <p className="mt-1 text-sm text-red-600">{errors.excerpt[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          Content
        </label>
        <textarea
          id="content"
          name="content"
          rows={10}
          value={formData.content}
          onChange={(e) => handleChange('content', e.target.value)}
          onBlur={() => handleBlur('content')}
          className={`mt-1 block w-full rounded-md shadow-sm ${
            touched.content && errors.content?.length
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }`}
        />
        {touched.content && errors.content?.length > 0 && (
          <p className="mt-1 text-sm text-red-600">{errors.content[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={(e) => handleChange('category', e.target.value)}
          onBlur={() => handleBlur('category')}
          className={`mt-1 block w-full rounded-md shadow-sm ${
            touched.category && errors.category?.length
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }`}
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {touched.category && errors.category?.length > 0 && (
          <p className="mt-1 text-sm text-red-600">{errors.category[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={(e) => handleStatusChange(e.target.value)}
          onBlur={() => handleBlur('status')}
          className={`mt-1 block w-full rounded-md shadow-sm ${
            touched.status && errors.status?.length
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }`}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
        {touched.status && errors.status?.length > 0 && (
          <p className="mt-1 text-sm text-red-600">{errors.status[0]}</p>
        )}
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="featured"
          name="featured"
          checked={formData.featured}
          onChange={(e) => handleChange('featured', e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
          Featured post
        </label>
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