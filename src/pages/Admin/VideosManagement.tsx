import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';
import {
  mockVideos,
  mockSubjects,
  mockClasses,
  mockMediums } from
'../../data/mockData';
import { Select } from '../../components/ui/Select';
export const VideosManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'en' | 'mr' | 'hi'>('en');
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Videos Management
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Upload and manage video lessons
          </p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary">
          <Plus className="w-4 h-4" />
          Upload Video
        </button>
      </div>

      <div className="card">
        <div className="p-4 border-b border-slate-200 dark:border-dark-border flex flex-col sm:flex-row justify-between gap-4 bg-slate-50 dark:bg-slate-800/50">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search videos..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 dark:border-dark-border bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
            
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="w-full sm:w-40">
              <Select
                options={[
                {
                  value: '',
                  label: 'All Classes'
                },
                ...mockClasses.map((c) => ({
                  value: c.id,
                  label: c.name.en
                }))]
                } />
              
            </div>
            <div className="w-full sm:w-40">
              <Select
                options={[
                {
                  value: '',
                  label: 'All Subjects'
                },
                ...mockSubjects.map((s) => ({
                  value: s.id,
                  label: s.name.en
                }))]
                } />
              
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-sm">
                <th className="p-4 font-medium">Video Details</th>
                <th className="p-4 font-medium">Subject</th>
                <th className="p-4 font-medium">Duration</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-dark-border">
              {mockVideos.map((video) => {
                const subject = mockSubjects.find(
                  (s) => s.id === video.subjectId
                );
                return (
                  <tr
                    key={video.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={video.thumbnail}
                          alt=""
                          className="w-20 h-12 rounded object-cover" />
                        
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {video.title.en}
                          </p>
                          <p className="text-xs text-slate-500 line-clamp-1 w-48">
                            {video.description.en}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-400">
                      {subject?.name.en}
                    </td>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-400">
                      {video.duration}
                    </td>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-400">
                      {new Date(video.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-slate-400 hover:text-primary-600 transition-colors rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>);

              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      {isModalOpen &&
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-dark-card rounded-xl shadow-xl w-full max-w-3xl my-8 max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-200 dark:border-dark-border flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 shrink-0 rounded-t-xl">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Upload New Video
              </h2>
              <button
              onClick={() => setIsModalOpen(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto">
              {/* Language Tabs */}
              <div className="flex gap-2 border-b border-slate-200 dark:border-dark-border">
                {(['en', 'mr', 'hi'] as const).map((lang) =>
              <button
                key={lang}
                onClick={() => setActiveTab(lang)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === lang ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                
                    {lang === 'en' ?
                'English' :
                lang === 'mr' ?
                'Marathi' :
                'Hindi'}
                  </button>
              )}
              </div>

              {/* Tab Content */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Video Title ({activeTab.toUpperCase()})
                  </label>
                  <input
                  type="text"
                  className="input-field"
                  placeholder={
                  activeTab === 'en' ?
                  'e.g. Algebra Basics' :
                  activeTab === 'mr' ?
                  'e.g. बीजगणित मूलतत्त्वे' :
                  'e.g. बीजगणित मूल बातें'
                  } />
                
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Description ({activeTab.toUpperCase()})
                  </label>
                  <textarea
                  className="input-field h-24 resize-none"
                  placeholder={`Enter description in ${activeTab === 'en' ? 'English' : activeTab === 'mr' ? 'Marathi' : 'Hindi'}`}>
                </textarea>
                </div>
              </div>

              {/* Shared Fields */}
              <div className="pt-4 border-t border-slate-200 dark:border-dark-border space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Select
                  label="Class"
                  options={[
                  {
                    value: '',
                    label: 'Select Class'
                  },
                  ...mockClasses.map((c) => ({
                    value: c.id,
                    label: c.name.en
                  }))]
                  } />
                
                  <Select
                  label="Medium"
                  options={[
                  {
                    value: '',
                    label: 'Select Medium'
                  },
                  ...mockMediums.map((m) => ({
                    value: m.id,
                    label: m.name.en
                  }))]
                  } />
                
                  <Select
                  label="Subject"
                  options={[
                  {
                    value: '',
                    label: 'Select Subject'
                  },
                  ...mockSubjects.map((s) => ({
                    value: s.id,
                    label: s.name.en
                  }))]
                  } />
                
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Video File / URL
                    </label>
                    <input
                    type="text"
                    className="input-field"
                    placeholder="https://..." />
                  
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Thumbnail URL
                    </label>
                    <input
                    type="text"
                    className="input-field"
                    placeholder="https://..." />
                  
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 dark:border-dark-border flex justify-end gap-3 bg-slate-50 dark:bg-slate-800/50 shrink-0 rounded-b-xl">
              <button
              onClick={() => setIsModalOpen(false)}
              className="btn-secondary">
              
                Cancel
              </button>
              <button className="btn-primary">Upload Video</button>
            </div>
          </div>
        </div>
      }
    </div>);

};