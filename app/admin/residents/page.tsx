'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  Users,
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  BedDouble,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';

interface ResidentSummary {
  _id: string;
  fullName: string;
  admissionNumber: string;
  admissionDate: string;
  dateOfBirth: string;
  age: number;
  gender: string;
  bloodGroup: string;
  status: 'Active' | 'Discharged' | 'Deceased' | 'On Leave';
  roomNumber?: string;
  bedNumber?: string;
  mobilityLevel: string;
  emergencyContacts?: Array<{
    name: string;
    phone: string;
    relation: string;
    isPrimary: boolean;
  }>;
}

export default function ResidentsListPage() {
  const { data: session } = useSession();
  const isSuperAdmin = session?.user?.role === 'super_admin';

  const [residents, setResidents] = useState<ResidentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState<Array<{ _id: string; roomNumber: string }>>([]);

  // Search & Filter States
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [gender, setGender] = useState('all');
  const [roomFilter, setRoomFilter] = useState('all');
  const [minAge, setMinAge] = useState('');
  const [maxAge, setMaxAge] = useState('');

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Soft delete state
  const [deleteModalResident, setDeleteModalResident] = useState<ResidentSummary | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch rooms for filter dropdown
  useEffect(() => {
    async function fetchRooms() {
      try {
        const res = await fetch('/api/rooms');
        if (res.ok) {
          const data = await res.json();
          setRooms(data.rooms || []);
        }
      } catch (err) {
        console.error('Failed to load rooms:', err);
      }
    }
    fetchRooms();
  }, []);

  // Fetch residents
  const fetchResidents = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (status !== 'all') params.set('status', status);
      if (gender !== 'all') params.set('gender', gender);
      if (roomFilter !== 'all') params.set('room', roomFilter);
      if (minAge) params.set('minAge', minAge);
      if (maxAge) params.set('maxAge', maxAge);
      params.set('page', String(page));
      params.set('limit', '10');

      const res = await fetch(`/api/residents?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setResidents(data.residents || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalCount(data.pagination?.total || 0);
      }
    } catch (err) {
      console.error('Failed to fetch residents:', err);
    } finally {
      setLoading(false);
    }
  }, [search, status, gender, roomFilter, minAge, maxAge, page]);

  useEffect(() => {
    fetchResidents();
  }, [fetchResidents]);

  // Handle CSV Export
  const handleExportCsv = () => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (status !== 'all') params.set('status', status);
    if (gender !== 'all') params.set('gender', gender);
    if (roomFilter !== 'all') params.set('room', roomFilter);
    if (minAge) params.set('minAge', minAge);
    if (maxAge) params.set('maxAge', maxAge);
    params.set('export', 'csv');

    window.open(`/api/residents?${params.toString()}`, '_blank');
  };

  // Handle Soft Delete (Super Admin only)
  const handleDeleteResident = async () => {
    if (!deleteModalResident) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/residents/${deleteModalResident._id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setToastMessage({
          type: 'success',
          text: `Resident ${deleteModalResident.fullName} archived successfully.`,
        });
        setDeleteModalResident(null);
        fetchResidents();
      } else {
        const errorData = await res.json();
        setToastMessage({
          type: 'error',
          text: errorData.error || 'Failed to archive resident.',
        });
      }
    } catch (err: any) {
      setToastMessage({ type: 'error', text: err.message || 'Error deleting resident' });
    } finally {
      setDeleting(false);
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
          <button onClick={() => setToastMessage(null)} className="text-sm font-bold">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-sage-900">
            Resident Directory
          </h1>
          <p className="text-xs text-sage-600">
            Total {totalCount} resident{totalCount !== 1 ? 's' : ''} recorded in sanctuary
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportCsv}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-sage-800 bg-white hover:bg-sage-50 border border-sage-300 shadow-xs transition-colors"
          >
            <Download className="w-4 h-4 text-sage-600" />
            <span>Export CSV</span>
          </button>

          <Link
            href="/admin/residents/new"
            className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-sage-700 hover:bg-sage-800 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>+ Admit Resident</span>
          </Link>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-sage-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Input */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-sage-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by name, admission no, room, contact..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 text-xs border border-sage-200 rounded-xl focus:ring-2 focus:ring-sage-500 bg-cream-50/50"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="w-full py-2 px-3 text-xs border border-sage-200 rounded-xl focus:ring-2 focus:ring-sage-500 bg-cream-50/50 text-sage-800 font-medium"
            >
              <option value="all">Status: All</option>
              <option value="Active">Active Resident</option>
              <option value="On Leave">On Leave</option>
              <option value="Discharged">Discharged</option>
              <option value="Deceased">Deceased</option>
            </select>
          </div>

          {/* Gender Filter */}
          <div>
            <select
              value={gender}
              onChange={(e) => {
                setGender(e.target.value);
                setPage(1);
              }}
              className="w-full py-2 px-3 text-xs border border-sage-200 rounded-xl focus:ring-2 focus:ring-sage-500 bg-cream-50/50 text-sage-800 font-medium"
            >
              <option value="all">Gender: All</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Room Filter */}
          <div>
            <select
              value={roomFilter}
              onChange={(e) => {
                setRoomFilter(e.target.value);
                setPage(1);
              }}
              className="w-full py-2 px-3 text-xs border border-sage-200 rounded-xl focus:ring-2 focus:ring-sage-500 bg-cream-50/50 text-sage-800 font-medium"
            >
              <option value="all">Room: All</option>
              {rooms.map((r) => (
                <option key={r._id} value={r._id}>
                  Room {r.roomNumber}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Age Range Filter */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-sage-100 text-xs text-sage-600">
          <span className="font-semibold text-sage-800 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Age Range:
          </span>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              placeholder="Min Age (e.g. 60)"
              value={minAge}
              onChange={(e) => {
                setMinAge(e.target.value);
                setPage(1);
              }}
              className="w-28 px-2.5 py-1.5 border border-sage-200 rounded-lg text-xs"
            />
            <span>to</span>
            <input
              type="number"
              placeholder="Max Age (e.g. 95)"
              value={maxAge}
              onChange={(e) => {
                setMaxAge(e.target.value);
                setPage(1);
              }}
              className="w-28 px-2.5 py-1.5 border border-sage-200 rounded-lg text-xs"
            />
          </div>

          {(search || status !== 'all' || gender !== 'all' || roomFilter !== 'all' || minAge || maxAge) && (
            <button
              onClick={() => {
                setSearch('');
                setStatus('all');
                setGender('all');
                setRoomFilter('all');
                setMinAge('');
                setMaxAge('');
                setPage(1);
              }}
              className="ml-auto text-terracotta-600 hover:text-terracotta-700 font-semibold"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Residents Table */}
      <div className="bg-white rounded-2xl border border-sage-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm text-sage-800">
            <thead className="bg-sage-50 text-[11px] font-bold text-sage-700 uppercase tracking-wider border-b border-sage-200">
              <tr>
                <th className="py-3.5 px-4">Resident</th>
                <th className="py-3.5 px-4">Admission</th>
                <th className="py-3.5 px-4">Age / Gender</th>
                <th className="py-3.5 px-4">Room & Bed</th>
                <th className="py-3.5 px-4">Emergency Contact</th>
                <th className="py-3.5 px-4">Mobility</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sage-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-sage-500">
                    <div className="w-8 h-8 border-3 border-sage-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    Loading resident records...
                  </td>
                </tr>
              ) : residents.length > 0 ? (
                residents.map((r) => {
                  const primaryContact =
                    r.emergencyContacts?.find((c) => c.isPrimary) || r.emergencyContacts?.[0];

                  return (
                    <tr key={r._id} className="hover:bg-cream-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-full bg-cream-200 border border-cream-300 flex items-center justify-center font-bold text-sage-800 text-xs shrink-0">
                            {r.fullName.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <Link
                              href={`/admin/residents/${r._id}`}
                              className="font-semibold text-sage-900 hover:text-terracotta-600 block"
                            >
                              {r.fullName}
                            </Link>
                            <span className="text-[11px] text-sage-500 font-mono">
                              Blood: {r.bloodGroup || 'Unknown'}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-mono text-xs font-medium text-sage-700">
                          {r.admissionNumber}
                        </div>
                        <div className="text-[11px] text-sage-500">
                          {new Date(r.admissionDate).toLocaleDateString('en-GB')}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-xs">
                        <span className="font-semibold text-sage-900">{r.age} yrs</span>
                        <span className="text-sage-500 block">{r.gender}</span>
                      </td>

                      <td className="py-3.5 px-4 text-xs font-medium">
                        {r.roomNumber ? (
                          <span className="inline-flex items-center gap-1 text-sage-800">
                            <BedDouble className="w-3.5 h-3.5 text-sage-500" />
                            Room {r.roomNumber} {r.bedNumber ? `(${r.bedNumber})` : ''}
                          </span>
                        ) : (
                          <span className="text-sage-400 italic">Unassigned</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-xs">
                        {primaryContact ? (
                          <div>
                            <span className="font-medium text-sage-900 block">
                              {primaryContact.name} ({primaryContact.relation})
                            </span>
                            <span className="text-sage-500 font-mono text-[11px]">
                              {primaryContact.phone}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sage-400 italic">No contact</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-xs">
                        <span className="px-2 py-0.5 rounded-full bg-cream-200 text-sage-800 font-medium">
                          {r.mobilityLevel}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            r.status === 'Active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : r.status === 'On Leave'
                              ? 'bg-amber-100 text-amber-800'
                              : r.status === 'Discharged'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-zinc-100 text-zinc-700'
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <Link
                            href={`/admin/residents/${r._id}`}
                            title="View Full Dossier"
                            className="p-1.5 rounded-lg text-sage-600 hover:text-sage-900 hover:bg-sage-100 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/admin/residents/${r._id}/edit`}
                            title="Edit Resident"
                            className="p-1.5 rounded-lg text-sage-600 hover:text-sage-900 hover:bg-sage-100 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          {isSuperAdmin && (
                            <button
                              onClick={() => setDeleteModalResident(r)}
                              title="Archive Resident (Super Admin Only)"
                              className="p-1.5 rounded-lg text-red-600 hover:text-red-800 hover:bg-red-50 transition-colors"
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
                  <td colSpan={8} className="py-12 text-center text-sage-500 text-sm">
                    No residents matching your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="py-3.5 px-6 border-t border-sage-200 flex items-center justify-between text-xs text-sage-600">
            <span>
              Showing Page <span className="font-semibold text-sage-900">{page}</span> of{' '}
              <span className="font-semibold text-sage-900">{totalPages}</span>
            </span>

            <div className="flex items-center space-x-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-sage-200 disabled:opacity-40 hover:bg-sage-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg border border-sage-200 disabled:opacity-40 hover:bg-sage-50 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal for Super Admin Soft Delete */}
      {deleteModalResident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl border border-sage-200">
            <div className="flex items-center space-x-3 text-red-600 mb-4">
              <ShieldAlert className="w-6 h-6 shrink-0" />
              <h3 className="text-lg font-serif font-bold text-sage-900">
                Archive Resident Record?
              </h3>
            </div>
            <p className="text-sm text-sage-600 mb-4 leading-relaxed">
              Are you sure you want to archive{' '}
              <span className="font-bold text-sage-800">{deleteModalResident.fullName}</span> (
              {deleteModalResident.admissionNumber})?
              <br />
              This will mark the record as archived and safely release any assigned room bed.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteModalResident(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-sage-300 text-sage-700 hover:bg-sage-50"
              >
                Cancel
              </button>
              <button
                disabled={deleting}
                onClick={handleDeleteResident}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? 'Archiving...' : 'Confirm Archive'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
