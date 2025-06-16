'use client';

import {useState} from 'react';
import {useApp} from '../App';
import {User, Mail, Calendar, MapPin, LinkIcon, Edit3, Save, X} from 'lucide-react';

export default function Profile() {
  const {user} = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: 'Full-stack developer passionate about building great user experiences.',
    location: 'San Francisco, CA',
    website: 'https://johndoe.dev',
    company: 'Acme Corp',
  });

  const handleSave = () => {
    // In a real app, you'd save to your backend
    console.log('Saving profile:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      bio: 'Full-stack developer passionate about building great user experiences.',
      location: 'San Francisco, CA',
      website: 'https://johndoe.dev',
      company: 'Acme Corp',
    });
    setIsEditing(false);
  };

  const stats = [
    {label: 'Projects', value: '24'},
    {label: 'Organizations', value: '3'},
    {label: 'Contributions', value: '1,247'},
    {label: 'Followers', value: '89'},
  ];

  const recentProjects = [
    {
      id: 1,
      name: 'Mobile App Redesign',
      description: 'Complete UI/UX overhaul for mobile application',
      status: 'In Progress',
      lastUpdated: '2 days ago',
    },
    {
      id: 2,
      name: 'API Documentation',
      description: 'Comprehensive API documentation and examples',
      status: 'Completed',
      lastUpdated: '1 week ago',
    },
    {
      id: 3,
      name: 'Team Dashboard',
      description: 'Analytics dashboard for team performance metrics',
      status: 'Planning',
      lastUpdated: '3 days ago',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-16">
            <div className="flex items-end space-x-4">
              <img
                src={user?.avatar || '/placeholder.svg'}
                alt={user?.name}
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
              />
              <div className="pb-2">
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="text-2xl font-bold text-gray-900 bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                  />
                ) : (
                  <h1 className="text-2xl font-bold text-gray-900">{formData.name}</h1>
                )}
                <p className="text-gray-600">@{user?.username}</p>
              </div>
            </div>
            <div className="pb-2">
              {isEditing ? (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Bio and Details */}
          <div className="mt-6 space-y-4">
            {isEditing ? (
              <textarea
                value={formData.bio}
                onChange={e => setFormData({...formData, bio: e.target.value})}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Tell us about yourself..."
              />
            ) : (
              <p className="text-gray-700">{formData.bio}</p>
            )}

            <div className="flex flex-wrap gap-6 text-sm text-gray-600">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.company}
                    onChange={e => setFormData({...formData, company: e.target.value})}
                    className="bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                  />
                ) : (
                  formData.company
                )}
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                    className="bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                  />
                ) : (
                  formData.location
                )}
              </div>
              <div className="flex items-center">
                <LinkIcon className="h-4 w-4 mr-2" />
                {isEditing ? (
                  <input
                    type="url"
                    value={formData.website}
                    onChange={e => setFormData({...formData, website: e.target.value})}
                    className="bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                  />
                ) : (
                  <a href={formData.website} className="text-blue-600 hover:underline">
                    {formData.website}
                  </a>
                )}
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                {formData.email}
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Joined March 2023
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Projects */}
      <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Projects</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentProjects.map(project => (
            <div key={project.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900">{project.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                  <p className="text-xs text-gray-500 mt-2">Updated {project.lastUpdated}</p>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    project.status === 'Completed'
                      ? 'bg-green-100 text-green-800'
                      : project.status === 'In Progress'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {project.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
