import React, { useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { NewsletterPreferences, NotificationChannel, NewsletterFrequency } from '../../../models/Newsletter';

// Helper function to encode form data for Netlify Forms
const encode = (data: Record<string, string>) => {
  return Object.keys(data)
    .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");
};

interface NewsletterSignupProps {
  onSubmit: (email: string, name: string, preferences: NewsletterPreferences) => Promise<void>;
  className?: string;
  showPreferences?: boolean;
  defaultFrequency?: NewsletterFrequency;
  availableChannels?: NotificationChannel[];
  topics?: string[];
}

const NewsletterSignup: React.FC<NewsletterSignupProps> = ({
  onSubmit,
  className = '',
  showPreferences = false,
  defaultFrequency = 'weekly',
  availableChannels = ['email'],
  topics = []
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [botField, setBotField] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<NewsletterPreferences>({
    frequency: defaultFrequency,
    channels: ['email'],
    topics: [],
  });

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Prepare form data for Netlify Forms
      const formData: Record<string, string> = {
        'form-name': 'blog-newsletter',
        'email': email,
        'name': name,
        'bot-field': botField,
        'frequency': preferences.frequency,
        'channels': preferences.channels.join(','),
        'topics': preferences.topics.join(',')
      };
      
      // Submit to Netlify Forms
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode(formData)
      });
      
      // Also call the original onSubmit handler
      await onSubmit(email, name, preferences);
      
      setEmail('');
      setName('');
      setBotField('');
      setShowAdvanced(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to subscribe');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFrequencyChange = (frequency: NewsletterFrequency) => {
    setPreferences(prev => ({ ...prev, frequency }));
  };

  const handleChannelToggle = (channel: NotificationChannel) => {
    setPreferences(prev => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter(c => c !== channel)
        : [...prev.channels, channel]
    }));
  };

  const handleTopicToggle = (topic: string) => {
    setPreferences(prev => ({
      ...prev,
      topics: prev.topics.includes(topic)
        ? prev.topics.filter(t => t !== topic)
        : [...prev.topics, topic]
    }));
  };

  return (
    <div className={`${className} ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
      <form 
        name="blog-newsletter" 
        method="POST" 
        data-netlify="true" 
        data-netlify-honeypot="bot-field" 
        onSubmit={handleSubmit} 
        className="space-y-4"
      >
        {/* Hidden input for Netlify form name */}
        <input type="hidden" name="form-name" value="blog-newsletter" />
        
        {/* Honeypot field */}
        <p className="hidden">
          <label>
            Don't fill this out if you're human: 
            <input 
              name="bot-field" 
              value={botField} 
              onChange={(e) => setBotField(e.target.value)} 
            />
          </label>
        </p>
        
        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className={`w-full px-4 py-2 rounded-lg border ${
              isDark
                ? 'bg-gray-800 border-gray-700 focus:border-blue-500'
                : 'bg-white border-gray-300 focus:border-blue-400'
            } focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
            placeholder="Enter your email"
            required
          />
        </div>

        {/* Name Input */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Name (Optional)
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={e => setName(e.target.value)}
            className={`w-full px-4 py-2 rounded-lg border ${
              isDark
                ? 'bg-gray-800 border-gray-700 focus:border-blue-500'
                : 'bg-white border-gray-300 focus:border-blue-400'
            } focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
            placeholder="Enter your name"
          />
        </div>

        {/* Advanced Preferences */}
        {showPreferences && (
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`text-sm ${
                isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
              }`}
            >
              {showAdvanced ? 'Hide preferences' : 'Customize preferences'}
            </button>

            {showAdvanced && (
              <div className="mt-4 space-y-4">
                {/* Frequency Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Newsletter Frequency
                  </label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {(['daily', 'weekly', 'monthly'] as NewsletterFrequency[]).map(freq => (
                      <button
                        key={freq}
                        type="button"
                        onClick={() => handleFrequencyChange(freq)}
                        className={`px-4 py-2 text-sm rounded-lg border ${
                          preferences.frequency === freq
                            ? 'bg-blue-500 text-white border-blue-500'
                            : isDark
                            ? 'bg-gray-800 border-gray-700 hover:bg-gray-700'
                            : 'bg-white border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        {freq.charAt(0).toUpperCase() + freq.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notification Channels */}
                {availableChannels.length > 1 && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Notification Channels
                    </label>
                    <div className="space-y-2">
                      {availableChannels.map(channel => (
                        <label
                          key={channel}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={preferences.channels.includes(channel)}
                            onChange={() => handleChannelToggle(channel)}
                            className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                          />
                          <span className="text-sm">
                            {channel.charAt(0).toUpperCase() + channel.slice(1)}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Topics Selection */}
                {topics.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Topics of Interest
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {topics.map(topic => (
                        <button
                          key={topic}
                          type="button"
                          onClick={() => handleTopicToggle(topic)}
                          className={`px-3 py-1 text-sm rounded-full border ${
                            preferences.topics.includes(topic)
                              ? 'bg-blue-500 text-white border-blue-500'
                              : isDark
                              ? 'bg-gray-800 border-gray-700 hover:bg-gray-700'
                              : 'bg-white border-gray-300 hover:bg-gray-100'
                          }`}
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="text-red-500 text-sm mt-2">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full px-6 py-2 text-white bg-blue-500 rounded-lg ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
          } transition-colors`}
        >
          {isSubmitting ? 'Subscribing...' : 'Subscribe to Newsletter'}
        </button>
      </form>
    </div>
  );
};

export default NewsletterSignup; 