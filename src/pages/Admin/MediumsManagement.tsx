import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { mockMediums } from '../../data/mockData';
export const MediumsManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'en' | 'mr' | 'hi'>('en');
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Mediums Management
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage language mediums
          </p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary">
          <Plus className="w-4 h-4" />
          Add Medium
        </button>
      </div>

      <div className="card">
        <div className="p-4 border-b border-slate-200 dark:border-dark-border flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search mediums..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 dark:border-dark-border bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
            
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-sm">
                <th className="p-4 font-medium">Medium Name (English)</th>
                <th className="p-4 font-medium">Name (Marathi)</th>
                <th className="p-4 font-medium">Name (Hindi)</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-dark-border">
              {mockMediums.map((medium) =>
              <tr
                key={medium.id}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                
                  <td className="p-4 font-medium text-slate-900 dark:text-white">
                    {medium.name.en}
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">
                    {medium.name.mr}
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">
                    {medium.name.hi}
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
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen &&
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-dark-card rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-dark-border flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Add New Medium
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
                    Medium Name ({activeTab.toUpperCase()})
                  </label>
                  <input
                  type="text"
                  className="input-field"
                  placeholder={
                  activeTab === 'en' ?
                  'e.g. English Medium' :
                  activeTab === 'mr' ?
                  'e.g. मराठी माध्यम' :
                  'e.g. हिंदी माध्यम'
                  } />
                
                </div>
              </div>

              {/* Shared Fields */}
              <div className="pt-4 border-t border-slate-200 dark:border-dark-border">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Image URL (Shared)
                </label>
                <input
                type="text"
                className="input-field"
                placeholder="https://images.unsplash.com/..." />
              
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 dark:border-dark-border flex justify-end gap-3 bg-slate-50 dark:bg-slate-800/50">
              <button
              onClick={() => setIsModalOpen(false)}
              className="btn-secondary">
              
                Cancel
              </button>
              <button className="btn-primary">Save Medium</button>
            </div>
          </div>
        </div>
      }
    </div>);

};