import React, { useState, useEffect } from 'react';
import { BookOpen, DollarSign, Users, Award, Clock, ChevronDown, ChevronRight, Layers, Sparkles, RefreshCw } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Course } from '../../types/admin';

export const AdminCoursesView: React.FC = () => {
  const { token } = useAdminAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>('crs-cohort-4w');

  const fetchCourses = async () => {
    if (!token) return;
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/courses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setCourses(data.data || []);
      }
    } catch (e) {
      console.error('Error fetching courses:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [token]);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span>Course Catalog & Curriculum Modules</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold">
              {courses.length} Active Tracks
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Configure cohort syllabi, module milestones, live weekend curriculum schedules, and pricing.
          </p>
        </div>
      </div>

      {/* Courses List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="py-12 text-center text-slate-500">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto text-emerald-400 mb-2" />
            <span>Loading courses...</span>
          </div>
        ) : courses.map((c) => {
          const isExpanded = expandedCourseId === c.id;

          return (
            <div key={c.id} className="bg-[#0B1513] border border-[#1B2F2A] rounded-2xl overflow-hidden shadow-lg transition-all">
              
              {/* Header Bar */}
              <div 
                onClick={() => setExpandedCourseId(isExpanded ? null : c.id)}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-[#0E1B18] transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white tracking-tight">{c.name}</h3>
                      <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {c.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 max-w-2xl">{c.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 shrink-0 text-xs">
                  <div className="text-right">
                    <span className="text-slate-500 text-[10px] block">Price (INR)</span>
                    <span className="font-bold text-emerald-400 text-sm">
                      {c.launchPrice > 0 ? `₹${c.launchPrice.toLocaleString('en-IN')}` : 'FREE'}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-slate-500 text-[10px] block">Enrolled Students</span>
                    <span className="font-bold text-white text-sm">{c.enrolledCount}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-slate-500 text-[10px] block">Completion</span>
                    <span className="font-bold text-teal-300 text-sm">{c.completionRate}%</span>
                  </div>

                  <div className="p-1 rounded-lg bg-[#152522] text-slate-400">
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Expanded Modules */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-[#1B2F2A] bg-[#070D0B]/60 space-y-3">
                  <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Cohort Modules & Lesson Milestones ({c.modules?.length || 0})
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {c.modules?.map((m, idx) => (
                      <div key={m.id} className="p-3.5 rounded-xl bg-[#0F1E1B] border border-[#1B2F2A] space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-bold text-white">
                          <span>{m.title}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#152522] text-slate-400 font-mono">
                            Mod {idx + 1}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-[11px] text-slate-400">
                          <span className="flex items-center gap-1">
                            <Layers className="w-3 h-3 text-emerald-400" />
                            <span>{m.lessonsCount} Core Lessons</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-teal-400" />
                            <span>{m.durationHours} Hours Live</span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};
