import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  UserCheck, 
  Eye, 
  AlertTriangle, 
  ShieldCheck, 
  Award, 
  MoreHorizontal, 
  RefreshCw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MessageCircle
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Student } from '../../types/admin';
import { AdminStudentDetailModal } from './AdminStudentDetailModal';

export const AdminStudentsView: React.FC = () => {
  const { token, viewMode } = useAdminAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [atRiskFilter, setAtRiskFilter] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Selected student for 360 modal
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const fetchStudents = async () => {
    if (!token) return;
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        search,
        courseId: courseFilter,
        paymentStatus: statusFilter,
        mode: viewMode,
        atRisk: String(atRiskFilter),
        page: String(page),
        limit: '20'
      });

      const res = await fetch(`/api/admin/students?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setStudents(data.data || []);
        setTotalPages(data.totalPages || 1);
        setTotalCount(data.total || 0);
      }
    } catch (e) {
      console.error('Error fetching students:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [token, search, courseFilter, statusFilter, atRiskFilter, page, viewMode]);

  const handleExportCSV = () => {
    if (students.length === 0) return;
    const headers = ['Enrollment ID', 'Full Name', 'Email', 'Mobile', 'Course', 'Payment Status', 'Amount', 'Progress', 'Registration Date'];
    const rows = students.map(s => [
      s.enrollmentId || 'N/A',
      `"${s.fullName}"`,
      s.email,
      s.mobile,
      `"${s.courseName}"`,
      s.paymentStatus,
      s.paymentAmount,
      `${s.courseProgress}%`,
      s.registrationDate
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `codeinindia_students_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Export Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span>Enrolled Students Registry</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold">
              {totalCount} Total
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Authoritative list of students with confirmed gateway payments and active Enrollment IDs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAtRiskFilter(!atRiskFilter)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
              atRiskFilter
                ? 'bg-rose-950/80 border-rose-500 text-rose-300'
                : 'bg-[#0F1E1B] border-[#1B2F2A] text-slate-400 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>At-Risk Students</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3 py-2 rounded-xl bg-[#0F1E1B] border border-[#1B2F2A] hover:border-emerald-500/40 text-slate-200 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0B1513] border border-[#1B2F2A] rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative sm:col-span-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, Enrollment ID..."
            className="w-full bg-[#070D0B] border border-[#1B2F2A] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Course Filter */}
        <div>
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="w-full bg-[#070D0B] border border-[#1B2F2A] rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Cohort Tracks</option>
            <option value="crs-cohort-4w">Full-Stack 4-Week Live Cohort</option>
            <option value="crs-workshop-2d">2-Day Live Weekend Builder Workshop</option>
            <option value="crs-free-masterclass">Free AI Coding Masterclass</option>
          </select>
        </div>

        {/* Payment Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-[#070D0B] border border-[#1B2F2A] rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Payment Statuses</option>
            <option value="PAID">PAID (Verified)</option>
            <option value="PENDING">PENDING</option>
            <option value="FAILED">FAILED</option>
            <option value="REFUNDED">REFUNDED</option>
          </select>
        </div>
      </div>

      {/* Student Registry Table */}
      <div className="bg-[#0B1513] border border-[#1B2F2A] rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0E1B18] text-slate-400 font-semibold border-b border-[#1B2F2A]">
              <tr>
                <th className="py-3.5 px-4">Enrollment ID</th>
                <th className="py-3.5 px-4">Student & Contact</th>
                <th className="py-3.5 px-4">Enrolled Course</th>
                <th className="py-3.5 px-4">Progress</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1B2F2A] text-slate-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto text-emerald-400 mb-2" />
                    <span>Loading student records...</span>
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No enrolled students match the current filters.
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id} className="hover:bg-[#0F1E1B] transition-colors group">
                    
                    {/* Enrollment ID */}
                    <td className="py-3.5 px-4 font-mono">
                      {student.enrollmentId ? (
                        <span className="font-bold text-emerald-400 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>{student.enrollmentId}</span>
                        </span>
                      ) : (
                        <span className="text-slate-500">Unassigned</span>
                      )}
                    </td>

                    {/* Student Info */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>{student.fullName}</span>
                        {student.isTest && (
                          <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono">TEST</span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {student.email} • {student.mobile}
                      </div>
                    </td>

                    {/* Enrolled Course */}
                    <td className="py-3.5 px-4">
                      <div className="truncate max-w-[200px] text-slate-300 font-medium">
                        {student.courseName}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Reg: {new Date(student.registrationDate).toLocaleDateString('en-IN')}
                      </div>
                    </td>

                    {/* Course Progress */}
                    <td className="py-3.5 px-4 min-w-[140px]">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-semibold">{student.courseProgress}%</span>
                        {student.certificateStatus === 'ISSUED' && (
                          <span className="text-emerald-400 flex items-center gap-0.5">
                            <Award className="w-3 h-3" />
                            <span>Cert</span>
                          </span>
                        )}
                      </div>
                      <div className="w-full bg-[#070D0B] rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-emerald-500 h-full rounded-full"
                          style={{ width: `${student.courseProgress}%` }}
                        ></div>
                      </div>
                    </td>

                    {/* Payment Status & Amount */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-emerald-400">
                        ₹{(student.paymentAmount || 0).toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px]">
                        {student.paymentStatus === 'PAID' ? (
                          <span className="text-emerald-400 font-medium">Verified Capture</span>
                        ) : (
                          <span className="text-amber-400 font-medium">{student.paymentStatus}</span>
                        )}
                      </div>
                    </td>

                    {/* Action Button */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedStudent(student)}
                        className="px-3 py-1.5 rounded-lg bg-[#152522] hover:bg-emerald-600 hover:text-white text-slate-300 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ml-auto"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>360° Profile</span>
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-[#1B2F2A] bg-[#0E1B18] flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="p-1.5 rounded-lg bg-[#152522] text-slate-300 hover:text-white disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="p-1.5 rounded-lg bg-[#152522] text-slate-300 hover:text-white disabled:opacity-40 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Student 360 Detail Modal */}
      {selectedStudent && (
        <AdminStudentDetailModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          onStudentUpdated={() => {
            fetchStudents();
            // Refresh modal student view
            fetch(`/api/admin/students/${selectedStudent.id}`, {
              headers: { Authorization: `Bearer ${token}` }
            })
              .then(r => r.json())
              .then(d => { if (d.student) setSelectedStudent(d.student); });
          }}
        />
      )}

    </div>
  );
};
