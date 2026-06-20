import React from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Languages,
  Book,
  Video,
  TrendingUp,
  Plus } from
'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell } from
'recharts';
import {
  mockClasses,
  mockMediums,
  mockSubjects,
  mockVideos } from
'../../data/mockData';
const uploadData = [
{
  name: 'Jan',
  uploads: 12
},
{
  name: 'Feb',
  uploads: 19
},
{
  name: 'Mar',
  uploads: 15
},
{
  name: 'Apr',
  uploads: 22
},
{
  name: 'May',
  uploads: 28
},
{
  name: 'Jun',
  uploads: 35
}];

const languageData = [
{
  name: 'English',
  value: 45
},
{
  name: 'Marathi',
  value: 35
},
{
  name: 'Hindi',
  value: 20
}];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];
export const Dashboard = () => {
  const stats = [
  {
    label: 'Total Classes',
    value: mockClasses.length,
    icon: <BookOpen className="w-6 h-6" />,
    color: 'bg-blue-500'
  },
  {
    label: 'Total Mediums',
    value: mockMediums.length,
    icon: <Languages className="w-6 h-6" />,
    color: 'bg-emerald-500'
  },
  {
    label: 'Total Subjects',
    value: mockSubjects.length,
    icon: <Book className="w-6 h-6" />,
    color: 'bg-purple-500'
  },
  {
    label: 'Total Videos',
    value: mockVideos.length,
    icon: <Video className="w-6 h-6" />,
    color: 'bg-rose-500'
  }];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Overview of your platform's content
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/admin/classes" className="btn-secondary text-sm">
            <Plus className="w-4 h-4" />
            Add Class
          </Link>
          <Link to="/admin/mediums" className="btn-secondary text-sm">
            <Plus className="w-4 h-4" />
            Add Medium
          </Link>
          <Link to="/admin/subjects" className="btn-secondary text-sm">
            <Plus className="w-4 h-4" />
            Add Subject
          </Link>
          <Link to="/admin/videos" className="btn-primary text-sm">
            <Plus className="w-4 h-4" />
            Upload Video
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) =>
        <div key={index} className="card p-6 flex items-center gap-4">
            <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${stat.color}`}>
            
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {stat.label}
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {stat.value}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Trends Chart */}
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Upload Trends
            </h2>
            <div className="w-40">
              <select className="w-full appearance-none px-3 py-1.5 rounded-lg border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary-500 outline-none">
                <option>Last 6 Months</option>
                <option>This Year</option>
              </select>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={uploadData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0" />
                
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: '#64748b'
                  }} />
                
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: '#64748b'
                  }} />
                
                <Tooltip
                  cursor={{
                    fill: '#f1f5f9'
                  }}
                  contentStyle={{
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }} />
                
                <Bar dataKey="uploads" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Videos by Language */}
        <div className="card p-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
            Videos by Language
          </h2>
          <div className="h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={languageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value">
                  
                  {languageData.map((entry, index) =>
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]} />

                  )}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {mockVideos.length}
              </span>
              <span className="text-xs text-slate-500">Total</span>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {languageData.map((lang, index) =>
            <div
              key={index}
              className="flex items-center justify-between text-sm">
              
                <div className="flex items-center gap-2">
                  <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: COLORS[index]
                  }}>
                </div>
                  <span className="text-slate-600 dark:text-slate-400">
                    {lang.name}
                  </span>
                </div>
                <span className="font-medium text-slate-900 dark:text-white">
                  {lang.value}%
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Videos */}
      <div className="card">
        <div className="p-6 border-b border-slate-200 dark:border-dark-border flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Recently Added Videos
          </h2>
          <Link
            to="/admin/videos"
            className="text-sm font-medium text-primary-600 hover:text-primary-700">
            
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-sm">
                <th className="p-4 font-medium">Video</th>
                <th className="p-4 font-medium">Subject</th>
                <th className="p-4 font-medium">Views</th>
                <th className="p-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-dark-border">
              {mockVideos.slice(0, 3).map((video) => {
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
                          className="w-16 h-10 rounded object-cover" />
                        
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white line-clamp-1">
                            {video.title.en}
                          </p>
                          <p className="text-xs text-slate-500">
                            {video.duration}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-400">
                      {subject?.name.en}
                    </td>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-400">
                      {video.views}
                    </td>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-400">
                      {new Date(video.createdAt).toLocaleDateString()}
                    </td>
                  </tr>);

              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>);

};