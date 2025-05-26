'use client';

import React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import clsx from 'clsx';

// Helper function to encode form data for Netlify Forms
const encode = (data: Record<string, string>) => {
  return Object.keys(data)
    .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");
};

interface NewsletterFormData {
  email: string;
  'bot-field'?: string;
}

export default function NewsletterSubscription() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<NewsletterFormData>();

  const onSubmit = async (data: NewsletterFormData) => {
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({
          'form-name': 'newsletter-subscription',
          ...data
        })
      });
      
      setSubmitStatus('success');
      reset();
    } catch (error: unknown) {
      console.error('Subscription error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Subscribe for Updates
      </h2>
      <p className="text-gray-600 mb-4">
        Get the latest insights and tutorials delivered straight to your inbox.
      </p>

      <form 
        name="newsletter-subscription"
        method="POST"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
        onSubmit={handleSubmit(onSubmit)} 
        className="space-y-4"
      >
        <input type="hidden" name="form-name" value="newsletter-subscription" />
        
        {/* Honeypot field */}
        <p className="hidden">
          <label>
            Don't fill this out if you're human: 
            <input {...register('bot-field')} />
          </label>
        </p>
        
        <div>
          <input
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            className={clsx(
              'w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors',
              {
                'border-red-500': errors.email,
                'border-gray-300': !errors.email
              }
            )}
            placeholder="Your email address"
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={clsx(
            'w-full py-2 px-4 rounded-md text-white font-medium transition-all',
            'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
            {
              'opacity-75 cursor-not-allowed': isSubmitting
            }
          )}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Subscribing...
            </span>
          ) : (
            'Subscribe'
          )}
        </button>

        {submitStatus === 'success' && (
          <p className="text-sm text-green-600">
            Thanks for subscribing! Please check your email to confirm.
          </p>
        )}

        {submitStatus === 'error' && (
          <p className="text-sm text-red-600">
            Something went wrong. Please try again later.
          </p>
        )}

        <p className="text-xs text-gray-500">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </form>
    </section>
  );
} 