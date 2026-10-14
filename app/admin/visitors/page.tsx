'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  ClipboardList,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  LogOut,
  Phone,
  Trash2,
  AlertCircle,
  X,
  User,
  Heart,
} from 'lucide-react';

interface VisitorItem {
  _id: string;
  visitorName: string;
  phone: string;
  residentId: string;
  residentName: string;
  relation: string;
  checkIn: string;
  checkOut?: string;
  purpose: string;
  idProofType?: string;
  idProofNumber?: string;
  temperatureOrHealthNotes?: string;
  loggedBy: string;
}

interface ResidentOption {
  _id: string;
  fullName: string;
  roomNumber?: string;
}

export default function VisitorLogPage() {
  const { data: session } = useSession();
  const isSuperAdmin = session?.user?.role === 'super_admin';

  const [visitors, setVisitors] = useState<VisitorItem[]>([]);
  const [residents, setResidents] = useState<ResidentOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);

  // Form Fields
  const [visitorName, setVisitorName] = useState('');
  const [phone, setPhone] = useState('');
  const [residentId, setResidentId] = useState('');
  const [relation, setRelation] = useState('Son / Daughter');
  const [purpose, setPurpose] = useState('Weekly Family Visit');
  const [idProofType, setIdProofType] = useState('Aadhaar / ID Card');
  const [idProofNumber, setIdProofNumber] = useState('');
  const [healthNotes, setHealthNotes] = useState('Normal (No symptoms)');

  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchVisitors = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);

      const res = await fetch(`/api/visitors?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setVisitors(data.visitors || []);
      }
    } catch (err) {
      console.error('Failed to load visitor log:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, [search]);

  // Load residents for dropdown
  useEffect(() => {
    async function loadResidents() {
      try {
        const res = await fetch('/api/residents?limit=100&status=Active');
        if (res.ok) {
          const data = await res.json();
          setResidents(data.residents || []);
        }
      } catch (e) {
        console.error('Failed to load residents for visitor dropdown:', e);
      }
    }
    loadResidents();
  }, []);

  const handleOpenAddModal = () => {
    setVisitorName('');
    setPhone('');
    setResidentId(residents[0]?._id || '');
    setRelation('Son / Daughter');
    setPurpose('Family Visit & Wellbeing Check');
    setIdProofType('Aadhaar / ID Card');
    setIdProofNumber('');
    setHealthNotes('Normal');
    setModalOpen(true);
  };

  const handleCheckOut = async (visitorId: string) => {
    try {
      const res = await fetch(`/api/visitors/${visitorId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'checkout' }),
      });

      if (res.ok) {
        setToastMessage({ type: 'success', text: 'Recorded visitor check-out.' });
        fetchVisitors();
      }
    } catch (e: any) {
      setToastMessage({ type: 'error', text: 'Failed to record checkout.' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        visitorName,
        phone,
        residentId,
        relation,
        purpose,
        idProofType,
        idProofNumber,
        temperatureOrHealthNotes: healthNotes,
      };

      const res = await fetch('/api/visitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to log visitor.');
      }

      setToastMessage({ type: 'success', text: `Visitor check-in logged for ${visitorName}.` });
      setModalOpen(false);
      fetchVisitors();
    } catch (err: any) {
      setToastMessage({ type: 'error', text: err.message });
    }
  };

  const handleDeleteVisitor = async (id: string) => {
    if (!confirm('Are you sure you want to delete this visitor record?')) return;
    try {
      const res = await fetch(`/api/visitors/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setToastMessage({ type: 'success', text: 'Visitor record deleted.' });
        fetchVisitors();
      }
    } catch (e: any) {
      setToastMessage({ type: 'error', text: e.message });
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
            Visitor & Family Gate Log
          </h1>
          <p className="text-xs text-sage-600">
            Keep our seniors safe with accurate check-in and check-out tracking for all guests
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-sage-700 hover:bg-sage-800 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>+ Log Guest Check-In</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-2xl border border-sage-200 shadow-xs">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-sage-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by visitor name, resident visited, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-sage-200 rounded-xl bg-cream-50/50"
          />
        </div>
      </div>

      {/* Visitors Table */}
      <div className="bg-white rounded-2xl border border-sage-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-sage-800">
            <thead className="bg-sage-50 text-[11px] font-bold text-sage-700 uppercase tracking-wider border-b border-sage-200">
              <tr>
                <th className="py-3.5 px-4">Visitor Name</th>
                <th className="py-3.5 px-4">Resident Visited</th>
                <th className="py-3.5 px-4">Relation & Purpose</th>
                <th className="py-3.5 px-4">Check-In Time</th>
                <th className="py-3.5 px-4">Check-Out Time</th>
                <th className="py-3.5 px-4">Logged By</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sage-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-sage-500">
                    <div className="w-8 h-8 border-3 border-sage-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    Loading visitor entries...
                  </td>
                </tr>
              ) : visitors.length > 0 ? (
                visitors.map((v) => {
                  const isCheckedOut = Boolean(v.checkOut);

                  return (
                    <tr key={v._id} className="hover:bg-cream-50/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-sage-900 block">{v.visitorName}</span>
                        <span className="text-[11px] font-mono text-sage-500">{v.phone}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-sage-900 block flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5 text-terracotta-500" />
                          {v.residentName}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-medium text-sage-800 block">{v.relation}</span>
                        <span className="text-[11px] text-sage-500">{v.purpose}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-mono text-sage-900 font-medium">
                          {new Date(v.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="text-[11px] text-sage-500">
                          {new Date(v.checkIn).toLocaleDateString('en-GB')}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        {isCheckedOut ? (
                          <div>
                            <div className="font-mono text-emerald-800 font-semibold">
                              {new Date(v.checkOut!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                            <div className="text-[11px] text-sage-500">
                              {new Date(v.checkOut!).toLocaleDateString('en-GB')}
                            </div>
                          </div>
                        ) : (
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 animate-pulse">
                            Inside Premises
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-sage-600">
                        {v.loggedBy}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {!isCheckedOut && (
                            <button
                              onClick={() => handleCheckOut(v._id)}
                              className="px-2.5 py-1 text-xs font-semibold bg-sage-100 hover:bg-sage-200 text-sage-800 rounded-lg transition-colors flex items-center space-x-1"
                            >
                              <LogOut className="w-3 h-3" />
                              <span>Check Out</span>
                            </button>
                          )}

                          {isSuperAdmin && (
                            <button
                              onClick={() => handleDeleteVisitor(v._id)}
                              className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-sage-500">
                    No visitor logs found. Click &quot;+ Log Guest Check-In&quot; to record today&apos;s visitors.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Visitor Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl border border-sage-200 space-y-4">
            <div className="flex items-center justify-between border-b border-sage-200 pb-3">
              <h3 className="text-base font-serif font-bold text-sage-900">
                Log Guest Check-In
              </h3>
              <button onClick={() => setModalOpen(false)}>
                <X className="w-4 h-4 text-sage-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-sage-800 mb-1">
                  Resident to Visit *
                </label>
                <select
                  required
                  value={residentId}
                  onChange={(e) => setResidentId(e.target.value)}
                  className="w-full px-3 py-2 border border-sage-300 rounded-xl"
                >
                  <option value="">Select Resident</option>
                  {residents.map((r) => (
                    <option key={r._id} value={r._id}>
                      {r.fullName} {r.roomNumber ? `(Room ${r.roomNumber})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-sage-800 mb-1">
                  Visitor Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ankit Sharma"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  className="w-full px-3 py-2 border border-sage-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-sage-800 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-sage-300 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-sage-800 mb-1">
                    Relation *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Son / Grandchild / Friend"
                    value={relation}
                    onChange={(e) => setRelation(e.target.value)}
                    className="w-full px-3 py-2 border border-sage-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-sage-800 mb-1">
                  Purpose of Visit *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Birthday celebration, Weekend visit"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full px-3 py-2 border border-sage-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-sage-800 mb-1">
                    ID Proof Type
                  </label>
                  <input
                    type="text"
                    value={idProofType}
                    onChange={(e) => setIdProofType(e.target.value)}
                    className="w-full px-3 py-2 border border-sage-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-sage-800 mb-1">
                    Health Check / Remarks
                  </label>
                  <input
                    type="text"
                    value={healthNotes}
                    onChange={(e) => setHealthNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-sage-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-sage-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-sage-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sage-700 text-white font-semibold rounded-xl hover:bg-sage-800"
                >
                  Confirm Check-In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
