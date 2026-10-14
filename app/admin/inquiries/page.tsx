'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  MessageSquare,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  Trash2,
  Mail,
  Phone,
  Clock,
  Eye,
  CheckCheck,
} from 'lucide-react';

interface InquiryItem {
  _id: string;
  name: string;
  email: string;
  phone: string;
  relationshipToSenior?: string;
  careNeeded?: string;
  subject: string;
  message: string;
  status: 'New' | 'In Review' | 'Contacted' | 'Closed';
  notes?: string;
  handledBy?: string;
  createdAt: string;
}

export default function InquiriesManagementPage() {
  const { data: session } = useSession();
  const isSuperAdmin = session?.user?.role === 'super_admin';

  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Drawer / View State
  const [viewingInquiry, setViewingInquiry] = useState<InquiryItem | null>(null);
  const [inquiryNotes, setInquiryNotes] = useState('');
  const [newStatus, setNewStatus] = useState<string>('In Review');

  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (statusFilter !== 'all') params.set('status', statusFilter);

      const res = await fetch(`/api/inquiries?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setInquiries(data.inquiries || []);
      }
    } catch (err) {
      console.error('Failed to load inquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [search, statusFilter]);

  const handleOpenView = (inq: InquiryItem) => {
    setViewingInquiry(inq);
    setInquiryNotes(inq.notes || '');
    setNewStatus(inq.status);
  };

  const handleUpdateStatus = async (statusVal: string) => {
    if (!viewingInquiry) return;
    try {
      const res = await fetch(`/api/inquiries/${viewingInquiry._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: statusVal,
          notes: inquiryNotes,
        }),
      });

      if (res.ok) {
        setToastMessage({ type: 'success', text: `Inquiry status changed to "${statusVal}".` });
        setViewingInquiry(null);
        fetchInquiries();
      }
    } catch (err: any) {
      setToastMessage({ type: 'error', text: 'Failed to update inquiry.' });
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      const res = await fetch(`/api/inquiries/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setToastMessage({ type: 'success', text: 'Inquiry record removed.' });
        fetchInquiries();
        if (viewingInquiry?._id === id) setViewingInquiry(null);
      }
    } catch (err: any) {
      setToastMessage({ type: 'error', text: err.message });
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between border ${
            toastMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : 'bg-red-50 text-red-900 border-red-200'
          }`}
        >
          <div className="flex items-center space-x-2 text-sm font-medium">
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
            <span>{toastMessage.text}</span>
          </div>
          <button onClick={() => setToastMessage(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-sage-900">
            Public Website Inquiries
          </h1>
          <p className="text-xs text-sage-600">
            Respond to admission requests and care questions submitted by prospective families
          </p>
        </div>
      </div>

      {/* Search and Status Filters */}
      <div className="bg-white p-4 rounded-2xl border border-sage-200 shadow-xs flex flex-wrap items-center gap-3 text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-sage-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by name, email, phone, message..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-sage-200 rounded-xl bg-cream-50/50"
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-2 px-3 border border-sage-200 rounded-xl bg-cream-50/50 font-medium text-sage-800"
          >
            <option value="all">All Inquiries</option>
            <option value="New">New (Unread)</option>
            <option value="In Review">In Review</option>
            <option value="Contacted">Contacted</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="bg-white rounded-2xl border border-sage-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-sm text-sage-800">
            <thead className="bg-sage-50 text-[11px] font-bold text-sage-700 uppercase tracking-wider border-b border-sage-200">
              <tr>
                <th className="py-3.5 px-4">Prospective Family</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Care Desired</th>
                <th className="py-3.5 px-4">Received On</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sage-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-sage-500">
                    <div className="w-8 h-8 border-3 border-sage-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    Loading website inquiries...
                  </td>
                </tr>
              ) : inquiries.length > 0 ? (
                inquiries.map((inq) => (
                  <tr key={inq._id} className="hover:bg-cream-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-sage-900 block">{inq.name}</span>
                      <span className="text-[11px] text-sage-500">
                        Relation: {inq.relationshipToSenior || 'Family Member'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 font-mono text-sage-900 font-medium">
                        <Phone className="w-3 h-3 text-sage-400" />
                        <a href={`tel:${inq.phone}`} className="hover:underline">
                          {inq.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-sage-500">
                        <Mail className="w-3 h-3 text-sage-400" />
                        <span>{inq.email}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-sage-800 block">{inq.careNeeded || 'General Care'}</span>
                      <span className="text-[11px] text-sage-500 truncate max-w-xs block">
                        {inq.subject}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-sage-600">
                      <div>{new Date(inq.createdAt).toLocaleDateString('en-GB')}</div>
                      <div className="text-[10px] text-sage-400">
                        {new Date(inq.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          inq.status === 'New'
                            ? 'bg-amber-100 text-amber-800 animate-pulse'
                            : inq.status === 'In Review'
                            ? 'bg-blue-100 text-blue-800'
                            : inq.status === 'Contacted'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-zinc-100 text-zinc-700'
                        }`}
                      >
                        {inq.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleOpenView(inq)}
                          className="px-3 py-1 text-xs font-semibold bg-sage-100 hover:bg-sage-200 text-sage-800 rounded-lg transition-colors flex items-center space-x-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Message</span>
                        </button>

                        {isSuperAdmin && (
                          <button
                            onClick={() => handleDeleteInquiry(inq._id)}
                            className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-sage-500">
                    No inquiries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inquiry Detail Modal */}
      {viewingInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl border border-sage-200 space-y-4">
            <div className="flex items-center justify-between border-b border-sage-200 pb-3">
              <div>
                <h3 className="text-base font-serif font-bold text-sage-900">
                  Inquiry from {viewingInquiry.name}
                </h3>
                <span className="text-xs text-sage-500">
                  Received {new Date(viewingInquiry.createdAt).toLocaleString('en-GB')}
                </span>
              </div>
              <button onClick={() => setViewingInquiry(null)}>
                <X className="w-4 h-4 text-sage-500" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-cream-50 rounded-xl border border-sage-200">
                <div>
                  <span className="text-sage-500 block">Phone:</span>
                  <a
                    href={`tel:${viewingInquiry.phone}`}
                    className="font-bold font-mono text-terracotta-600 hover:underline"
                  >
                    {viewingInquiry.phone}
                  </a>
                </div>
                <div>
                  <span className="text-sage-500 block">Email:</span>
                  <a
                    href={`mailto:${viewingInquiry.email}`}
                    className="font-medium text-sage-900 hover:underline"
                  >
                    {viewingInquiry.email}
                  </a>
                </div>
                <div>
                  <span className="text-sage-500 block">Relation to Senior:</span>
                  <span className="font-semibold text-sage-800">
                    {viewingInquiry.relationshipToSenior || 'Family'}
                  </span>
                </div>
                <div>
                  <span className="text-sage-500 block">Care Program Needed:</span>
                  <span className="font-semibold text-sage-800">
                    {viewingInquiry.careNeeded || 'Assisted Living'}
                  </span>
                </div>
              </div>

              <div>
                <span className="font-bold text-sage-900 block mb-1">
                  Subject: {viewingInquiry.subject}
                </span>
                <div className="p-3 bg-white rounded-xl border border-sage-200 text-sage-700 leading-relaxed max-h-40 overflow-y-auto">
                  {viewingInquiry.message}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-sage-800 mb-1">
                  Internal Staff Notes & Follow-up Log:
                </label>
                <textarea
                  rows={3}
                  placeholder="Record call outcome, visit scheduling, or admission status..."
                  value={inquiryNotes}
                  onChange={(e) => setInquiryNotes(e.target.value)}
                  className="w-full p-2.5 border border-sage-300 rounded-xl"
                />
              </div>

              <div>
                <span className="font-semibold text-sage-800 block mb-1">
                  Change Inquirer Status:
                </span>
                <div className="flex flex-wrap gap-2">
                  {['New', 'In Review', 'Contacted', 'Closed'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleUpdateStatus(st)}
                      className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors ${
                        viewingInquiry.status === st
                          ? 'bg-sage-800 text-white'
                          : 'bg-sage-100 text-sage-800 hover:bg-sage-200'
                      }`}
                    >
                      Mark as {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-sage-100">
              <button
                onClick={() => setViewingInquiry(null)}
                className="px-4 py-2 border border-sage-300 rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
