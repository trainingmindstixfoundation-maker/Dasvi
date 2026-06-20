import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Upload } from 'lucide-react';
import {
  mockSubjects,
  mockClasses,
  mockMediums,
  mockVideos } from
'../../data/mockData';
import { Select } from '../../components/ui/Select';
export const TestsManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'en' | 'mr' | 'hi'>('en');
  const [scope, setScope] = useState<'subject' | 'video'>('subject');
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Tests & Quizzes
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage assessments for videos and subjects
          </p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary">
          <Plus className="w-4 h-4" />
          Create Test
        </button>
      </div>

      <div className="card">
        <div className="p-4 border-b border-slate-200 dark:border-dark-border flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search tests..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 dark:border-dark-border bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
            
          </div>
        </div>

        <div className="p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
            <Upload className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
            No tests created yet
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            Create your first test to assess student knowledge.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary mx-auto">
            
            Create First Test
          </button>
        </div>
      </div>

      {/* Create Test Modal */}
      {isModalOpen &&
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-dark-card rounded-xl shadow-xl w-full max-w-3xl my-8 max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-200 dark:border-dark-border flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 shrink-0 rounded-t-xl">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Create New Test
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
                    Test Title ({activeTab.toUpperCase()})
                  </label>
                  <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Algebra Chapter 1 Quiz" />
                
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
                  <Select
                  label="Scope"
                  value={scope}
                  onChange={(e) =>
                  setScope(e.target.value as 'subject' | 'video')
                  }
                  options={[
                  {
                    value: 'subject',
                    label: 'Entire Subject'
                  },
                  {
                    value: 'video',
                    label: 'Specific Video'
                  }]
                  } />
                
                  {scope === 'video' &&
                <Select
                  label="Select Video"
                  options={[
                  {
                    value: '',
                    label: 'Select Video'
                  },
                  ...mockVideos.map((v) => ({
                    value: v.id,
                    label: v.title.en
                  }))]
                  } />

                }
                </div>

                <div className="border-t border-slate-200 dark:border-dark-border pt-6">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
                    Test Content
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        External Link (Google Form / PDF URL)
                      </label>
                      <input
                      type="text"
                      className="input-field"
                      placeholder="https://docs.google.com/forms/..." />
                    
                    </div>

                    <div className="relative">
                      <div
                      className="absolute inset-0 flex items-center"
                      aria-hidden="true">
                      
                        <div className="w-full border-t border-slate-200 dark:border-dark-border"></div>
                      </div>
                      <div className="relative flex justify-center">
                        <span className="px-2 bg-white dark:bg-dark-card text-sm text-slate-500">
                          OR ADD QUESTIONS MANUALLY
                        </span>
                      </div>
                    </div>

                    <div className="border border-slate-200 dark:border-dark-border rounded-lg p-4 bg-slate-50 dark:bg-slate-800/30">
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Question 1
                        </label>
                        <input
                        type="text"
                        className="input-field"
                        placeholder="Enter question text..." />
                      
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex items-center gap-2">
                          <input
                          type="radio"
                          name="q1"
                          className="text-primary-600 focus:ring-primary-500" />
                        
                          <input
                          type="text"
                          className="input-field py-1.5 text-sm"
                          placeholder="Option A" />
                        
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                          type="radio"
                          name="q1"
                          className="text-primary-600 focus:ring-primary-500" />
                        
                          <input
                          type="text"
                          className="input-field py-1.5 text-sm"
                          placeholder="Option B" />
                        
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                          type="radio"
                          name="q1"
                          className="text-primary-600 focus:ring-primary-500" />
                        
                          <input
                          type="text"
                          className="input-field py-1.5 text-sm"
                          placeholder="Option C" />
                        
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                          type="radio"
                          name="q1"
                          className="text-primary-600 focus:ring-primary-500" />
                        
                          <input
                          type="text"
                          className="input-field py-1.5 text-sm"
                          placeholder="Option D" />
                        
                        </div>
                      </div>
                    </div>

                    <button className="btn-secondary w-full py-2 text-sm border-dashed border-2 border-slate-300 dark:border-slate-700 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Another Question
                    </button>
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
              <button className="btn-primary">Save Test</button>
            </div>
          </div>
        </div>
      }
    </div>);

};