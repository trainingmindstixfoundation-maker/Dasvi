import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { mockSubjects, mockClasses, mockMediums } from '../../data/mockData';
import { Select } from '../../components/ui/Select';
export const SubjectsManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'en' | 'mr' | 'hi'>('en');
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Subjects Management
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage subjects across classes and mediums
          </p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary">
          <Plus className="w-4 h-4" />
          Add Subject
        </button>
      </div>

      <div className="card">
        <div className="p-4 border-b border-slate-200 dark:border-dark-border flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search subjects..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 dark:border-dark-border bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
            
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-sm">
                <th className="p-4 font-medium">Subject Name (English)</th>
                <th className="p-4 font-medium">Class</th>
                <th className="p-4 font-medium">Medium</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-dark-border">
              {mockSubjects.map((subject) => {
                const cls = mockClasses.find((c) => c.id === subject.classId);
                const medium = mockMediums.find(
                  (m) => m.id === subject.mediumId
                );
                return (
                  <tr
                    key={subject.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    
                    <td className="p-4 font-medium text-slate-900 dark:text-white">
                      {subject.name.en}
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">
                      {cls?.name.en}
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">
                      {medium?.name.en}
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

      {/* Add/Edit Modal */}
      {isModalOpen &&
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-dark-card rounded-xl shadow-xl w-full max-w-lg my-8">
            <div className="p-6 border-b border-slate-200 dark:border-dark-border flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 sticky top-0 z-10 rounded-t-xl">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Add New Subject
              </h2>
              <button
              onClick={() => setIsModalOpen(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>

            <div className="p-6 space-y-6">
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
                    Subject Name ({activeTab.toUpperCase()})
                  </label>
                  <input
                  type="text"
                  className="input-field"
                  placeholder={
                  activeTab === 'en' ?
                  'e.g. Mathematics' :
                  activeTab === 'mr' ?
                  'e.g. गणित' :
                  'e.g. गणित'
                  } />
                
                </div>
              </div>

              {/* Shared Fields */}
              <div className="pt-4 border-t border-slate-200 dark:border-dark-border space-y-4">
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
              
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Image URL
                  </label>
                  <input
                  type="text"
                  className="input-field"
                  placeholder="https://images.unsplash.com/..." />
                
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 dark:border-dark-border flex justify-end gap-3 bg-slate-50 dark:bg-slate-800/50 sticky bottom-0 rounded-b-xl">
              <button
              onClick={() => setIsModalOpen(false)}
              className="btn-secondary">
              
                Cancel
              </button>
              <button className="btn-primary">Save Subject</button>
            </div>
          </div>
        </div>
      }
    </div>);

};