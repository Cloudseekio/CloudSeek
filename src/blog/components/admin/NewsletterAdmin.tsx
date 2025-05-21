import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { useNewsletter } from '../../hooks/useNewsletter';
import { 
  NewsletterTemplate, 
  NewsletterCampaign, 
  SubscriberSegment 
} from '../../../models/Newsletter';

interface NewsletterAdminProps {
  className?: string;
}

const NewsletterAdmin: React.FC<NewsletterAdminProps> = ({ className = '' }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState<'templates' | 'campaigns' | 'subscribers' | 'analytics'>('templates');
  
  const {
    isLoading,
    error,
    analytics,
    refreshAnalytics,
    createTemplate,
    createCampaign,
    scheduleCampaign
  } = useNewsletter();

  useEffect(() => {
    refreshAnalytics();
  }, [refreshAnalytics]);

  const [newTemplate, setNewTemplate] = useState<Partial<NewsletterTemplate>>({
    name: '',
    subject: '',
    content: '',
    type: 'regular',
    variables: []
  });

  const [newCampaign, setNewCampaign] = useState<Partial<NewsletterCampaign>>({
    name: '',
    segment: 'all',
    schedule: {
      sendDate: new Date().toISOString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    },
    status: 'draft'
  });

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTemplate.name || !newTemplate.subject || !newTemplate.content) {
      return;
    }

    try {
      await createTemplate(newTemplate as Omit<NewsletterTemplate, 'id' | 'createdAt' | 'updatedAt'>);
      setNewTemplate({
        name: '',
        subject: '',
        content: '',
        type: 'regular',
        variables: []
      });
    } catch (error) {
      console.error('Failed to create template:', error);
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampaign.name || !newCampaign.template) {
      return;
    }

    try {
      const campaign = await createCampaign(newCampaign as Omit<NewsletterCampaign, 'id' | 'metrics'>);
      if (campaign.id && newCampaign.schedule?.sendDate) {
        await scheduleCampaign(campaign.id, newCampaign.schedule.sendDate);
      }
      setNewCampaign({
        name: '',
        segment: 'all',
        schedule: {
          sendDate: new Date().toISOString(),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        status: 'draft'
      });
    } catch (error) {
      console.error('Failed to create campaign:', error);
    }
  };

  return (
    <div className={`${className} ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-6">
        {(['templates', 'campaigns', 'subscribers', 'analytics'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === tab
                ? 'bg-blue-500 text-white'
                : isDark
                ? 'bg-gray-800 hover:bg-gray-700'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="space-y-6">
        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-8">
            Loading...
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-red-500 text-center py-8">
            {error.message}
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Create Newsletter Template</h2>
            <form onSubmit={handleCreateTemplate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Template Name</label>
                <input
                  type="text"
                  value={newTemplate.name}
                  onChange={e => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark
                      ? 'bg-gray-800 border-gray-700'
                      : 'bg-white border-gray-300'
                  }`}
                  placeholder="Enter template name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Subject Line</label>
                <input
                  type="text"
                  value={newTemplate.subject}
                  onChange={e => setNewTemplate(prev => ({ ...prev, subject: e.target.value }))}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark
                      ? 'bg-gray-800 border-gray-700'
                      : 'bg-white border-gray-300'
                  }`}
                  placeholder="Enter subject line"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Content</label>
                <textarea
                  value={newTemplate.content}
                  onChange={e => setNewTemplate(prev => ({ ...prev, content: e.target.value }))}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark
                      ? 'bg-gray-800 border-gray-700'
                      : 'bg-white border-gray-300'
                  }`}
                  rows={10}
                  placeholder="Enter template content"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Create Template
              </button>
            </form>
          </div>
        )}

        {/* Campaigns Tab */}
        {activeTab === 'campaigns' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Create Campaign</h2>
            <form onSubmit={handleCreateCampaign} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Campaign Name</label>
                <input
                  type="text"
                  value={newCampaign.name}
                  onChange={e => setNewCampaign(prev => ({ ...prev, name: e.target.value }))}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark
                      ? 'bg-gray-800 border-gray-700'
                      : 'bg-white border-gray-300'
                  }`}
                  placeholder="Enter campaign name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Segment</label>
                <select
                  value={newCampaign.segment}
                  onChange={e => setNewCampaign(prev => ({ ...prev, segment: e.target.value as SubscriberSegment }))}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark
                      ? 'bg-gray-800 border-gray-700'
                      : 'bg-white border-gray-300'
                  }`}
                  aria-label="Select subscriber segment"
                  title="Subscriber segment"
                >
                  <option value="all">All Subscribers</option>
                  <option value="new">New Subscribers</option>
                  <option value="engaged">Engaged Subscribers</option>
                  <option value="inactive">Inactive Subscribers</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Schedule Date</label>
                <input
                  type="datetime-local"
                  value={newCampaign.schedule?.sendDate.slice(0, 16)}
                  onChange={e => setNewCampaign(prev => ({
                    ...prev,
                    schedule: {
                      ...prev.schedule!,
                      sendDate: new Date(e.target.value).toISOString()
                    }
                  }))}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark
                      ? 'bg-gray-800 border-gray-700'
                      : 'bg-white border-gray-300'
                  }`}
                  aria-label="Schedule campaign date and time"
                  title="Campaign schedule"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Create Campaign
              </button>
            </form>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && analytics && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Newsletter Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className={`p-6 rounded-lg ${
                isDark ? 'bg-gray-800' : 'bg-white shadow'
              }`}>
                <h3 className="text-lg font-medium mb-2">Total Subscribers</h3>
                <p className="text-3xl font-bold text-blue-500">{analytics.total}</p>
              </div>
              <div className={`p-6 rounded-lg ${
                isDark ? 'bg-gray-800' : 'bg-white shadow'
              }`}>
                <h3 className="text-lg font-medium mb-2">Active Subscribers</h3>
                <p className="text-3xl font-bold text-green-500">{analytics.active}</p>
              </div>
              <div className={`p-6 rounded-lg ${
                isDark ? 'bg-gray-800' : 'bg-white shadow'
              }`}>
                <h3 className="text-lg font-medium mb-2">Engagement Rate</h3>
                <p className="text-3xl font-bold text-purple-500">
                  {analytics.engagementRate.toFixed(1)}%
                </p>
              </div>
              <div className={`p-6 rounded-lg ${
                isDark ? 'bg-gray-800' : 'bg-white shadow'
              }`}>
                <h3 className="text-lg font-medium mb-2">Unsubscribe Rate</h3>
                <p className="text-3xl font-bold text-red-500">
                  {((analytics.unsubscribed / analytics.total) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsletterAdmin; 