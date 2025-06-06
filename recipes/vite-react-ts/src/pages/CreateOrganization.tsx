'use client';

import type React from 'react';

import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useApp} from '../App';
import {Building2, Upload, ArrowLeft} from 'lucide-react';

export default function CreateOrganization() {
  const navigate = useNavigate();
  const {addOrganization} = useApp();
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    website: '',
    avatar: '/placeholder.svg?height=64&width=64',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    setFormData({...formData, name, slug});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newOrg = {
      id: Date.now().toString(),
      name: formData.name,
      slug: formData.slug,
      avatar: formData.avatar,
      role: 'owner' as const,
      memberCount: 1,
    };

    addOrganization(newOrg);
    navigate('/organizations');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/organizations')}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to organizations
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Create a new organization</h1>
        <p className="text-gray-600 mt-2">
          Organizations are shared accounts where teams can collaborate across many projects at once.
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Organization Avatar */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Organization avatar</label>
            <div className="flex items-center space-x-4">
              <img
                src={formData.avatar || '/placeholder.svg'}
                alt="Organization avatar"
                className="w-16 h-16 rounded-lg border border-gray-200"
              />
              <button
                type="button"
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload image
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">We recommend an image that's at least 64×64 pixels.</p>
          </div>

          {/* Organization Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Organization name *
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={handleNameChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter organization name"
            />
          </div>

          {/* Organization Slug */}
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
              Organization slug *
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                teamspace.com/
              </span>
              <input
                type="text"
                id="slug"
                required
                value={formData.slug}
                onChange={e => setFormData({...formData, slug: e.target.value})}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="organization-slug"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              This will be your organization's URL. Only lowercase letters, numbers, and hyphens are allowed.
            </p>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Tell us about your organization..."
            />
          </div>

          {/* Website */}
          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
              Website
            </label>
            <input
              type="url"
              id="website"
              value={formData.website}
              onChange={e => setFormData({...formData, website: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://example.com"
            />
          </div>

          {/* Terms */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-start">
              <Building2 className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
              <div className="text-sm text-gray-600">
                <p className="font-medium mb-2">By creating an organization, you agree to:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Follow our Terms of Service and Community Guidelines</li>
                  <li>• Take responsibility for all activity under this organization</li>
                  <li>• Ensure all members comply with our policies</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/organizations')}
              className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.name || !formData.slug}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create organization'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
