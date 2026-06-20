import React, { useState } from 'react';
import {
  Download,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight } from
'lucide-react';
import {
  mockVideos,
  mockSubjects,
  mockClasses,
  mockMediums } from
'../../data/mockData';
export const Reports = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  // Generate some mock report data based on videos
  const reportData = mockVideos.map((video) => {
    const subject = mockSubjects.find((s) => s.id === video.subjectId);
    const cls = mockClasses.find((c) => c.id === subject?.classId);
    const medium = mockMediums.find((m) => m.id === subject?.mediumId);
    return {
      id: video.id,
      title: video.title.en,
      className: cls?.name.en || 'Unknown',
      mediumName: medium?.name.en || 'Unknown',
      subjectName: subject?.name.en || 'Unknown',
      views: video.views,
      completionRate: Math.floor(Math.random() * 40) + 60,
      avgWatchTime: '08:45',
      uploadDate: new Date(video.createdAt).toLocaleDateString()
    };
  });
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Analytics & Reports
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Detailed performance metrics for your content
          </p>
        </div>
        <button className="btn-secondary">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Date Range
            </label>
            <div className="relative">
              <select className="input-field py-2 text-sm appearance-none pr-8">
                <option>Last 30 Days</option>
                <option>Last 3 Months</option>
                <option>This Year</option>
                <option>All Time</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7">
                  </path>
                </svg>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Class
            </label>
            <div className="relative">
              <select className="input-field py-2 text-sm appearance-none pr-8">
                <option value="">All Classes</option>
                {mockClasses.map((c) =>
                <option key={c.id} value={c.id}>
                    {c.name.en}
                  </option>
                )}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7">
                  </path>
                </svg>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Medium
            </label>
            <div className="relative">
              <select className="input-field py-2 text-sm appearance-none pr-8">
                <option value="">All Mediums</option>
                {mockMediums.map((m) =>
                <option key={m.id} value={m.id}>
                    {m.name.en}
                  </option>
                )}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7">
                  </path>
                </svg>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Subject
            </label>
            <div className="relative">
              <select className="input-field py-2 text-sm appearance-none pr-8">
                <option value="">All Subjects</option>
                {mockSubjects.map((s) =>
                <option key={s.id} value={s.id}>
                    {s.name.en}
                  </option>
                )}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7">
                  </path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="card p-6 border-l-4 border-primary-500">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Total Views (Filtered)
          </p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
            4,190
          </p>
          <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
            ↑ 12% from last period
          </p>
        </div>
        <div className="card p-6 border-l-4 border-emerald-500">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Avg. Completion Rate
          </p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
            78%
          </p>
          <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
            ↑ 5% from last period
          </p>
        </div>
        <div className="card p-6 border-l-4 border-purple-500">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Total Watch Time
          </p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
            842 hrs
          </p>
          <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
            ↑ 18% from last period
          </p>
        </div>
      </div>

      {/* Data Table */}
      <div className="card">
        <div className="p-4 border-b border-slate-200 dark:border-dark-border flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
          <h2 className="font-bold text-slate-900 dark:text-white">
            Detailed Video Performance
          </h2>
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search reports..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 dark:border-dark-border bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
            
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-sm">
                <th className="p-4 font-medium">Video Title</th>
                <th className="p-4 font-medium">Hierarchy</th>
                <th className="p-4 font-medium text-right">Views</th>
                <th className="p-4 font-medium text-right">Completion</th>
                <th className="p-4 font-medium text-right">Avg. Watch</th>
                <th className="p-4 font-medium text-right">Upload Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-dark-border">
              {reportData.map((row) =>
              <tr
                key={row.id}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                
                  <td className="p-4 font-medium text-slate-900 dark:text-white">
                    {row.title}
                  </td>
                  <td className="p-4">
                    <div className="text-sm">
                      <span className="text-slate-900 dark:text-white">
                        {row.className}
                      </span>
                      <span className="text-slate-400 mx-1">/</span>
                      <span className="text-slate-600 dark:text-slate-400">
                        {row.mediumName}
                      </span>
                      <span className="text-slate-400 mx-1">/</span>
                      <span className="text-slate-500">{row.subjectName}</span>
                    </div>
                  </td>
                  <td className="p-4 text-right text-slate-600 dark:text-slate-400">
                    {row.views.toLocaleString()}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-slate-600 dark:text-slate-400">
                        {row.completionRate}%
                      </span>
                      <div className="w-16 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                        className={`h-full ${row.completionRate > 75 ? 'bg-green-500' : row.completionRate > 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{
                          width: `${row.completionRate}%`
                        }}>
                      </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right text-slate-600 dark:text-slate-400">
                    {row.avgWatchTime}
                  </td>
                  <td className="p-4 text-right text-slate-600 dark:text-slate-400">
                    {row.uploadDate}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-200 dark:border-dark-border flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <p className="text-sm text-slate-500">
            Showing 1 to {reportData.length} of {reportData.length} entries
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg border border-slate-200 dark:border-dark-border text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-lg bg-primary-600 text-white text-sm font-medium flex items-center justify-center">
              1
            </button>
            <button className="p-2 rounded-lg border border-slate-200 dark:border-dark-border text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>);

};