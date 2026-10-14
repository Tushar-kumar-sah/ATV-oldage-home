'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  UserCheck,
  Plus,
  Search,
  Phone,
  Mail,
  Calendar,
  Clock,
  Shield,
  Trash2,
  Edit,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';

interface StaffMember {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  shift: string;
  joiningDate: string;
  emergencyContact?: {
    name: string;
    relation: string;
    phone: string;
  };
  address?: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  notes?: string;
}

export default function StaffDirectoryPage() {
  const { data: session } = useSession();
  const isSuperAdmin = session?.user?.role === 'super_admin';

  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [shiftFilter, setShiftFilter] = useState('all');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('Caregiver');
  const [shift, setShift] = useState('Morning (7 AM - 3 PM)');
  const [joiningDate, setJoiningDate] = useState(new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState<'Active' | 'On Leave' | 'Inactive'>('Active');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyRelation, setEmergencyRelation] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [address, setAddress] = useState('');

  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (roleFilter !== 'all') params.set('role', roleFilter);
      if (shiftFilter !== 'all') params.set('shift', shiftFilter);

      const res = await fetch(`/api/staff?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setStaffList(data.staff || []);
      }
    } catch (err) {
      console.error('Failed to load staff directory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, [search, roleFilter, shiftFilter]);

  const handleOpenAddModal = () => {
    setEditingStaff(null);
    setFullName('');
    setEmail('');
    setPhone('');
    setRole('Caregiver');
    setShift('Morning (7 AM - 3 PM)');
    setJoiningDate(new Date().toISOString().slice(0, 10));
    setStatus('Active');
    setEmergencyName('');
    setEmergencyRelation('');
    setEmergencyPhone('');
    setAddress('');
    setModalOpen(true);
  };

  const handleOpenEditModal = (staff: StaffMember) => {
    setEditingStaff(staff);
    setFullName(staff.fullName);
    setEmail(staff.email);
    setPhone(staff.phone);
    setRole(staff.role);
    setShift(staff.shift);
    setJoiningDate(staff.joiningDate ? staff.joiningDate.slice(0, 10) : '');
    setStatus(staff.status);
    setEmergencyName(staff.emergencyContact?.name || '');
    setEmergencyRelation(staff.emergencyContact?.relation || '');
    setEmergencyPhone(staff.emergencyContact?.phone || '');
    setAddress(staff.address || '');
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        fullName,
        email,
        phone,
        role,
        shift,
        joiningDate,
        status,
        emergencyContact: {
          name: emergencyName,
          relation: emergencyRelation,
          phone: emergencyPhone,
        },
        address,
      };

      const url = editingStaff ? `/api/staff/${editingStaff._id}` : '/api/staff';
      const method = editingStaff ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to save staff record.');
      }

      setToastMessage({
        type: 'success',
        text: editingStaff ? `Updated profile for ${fullName}.` : `Staff member ${fullName} added.`,
      });
      setModalOpen(false);
      fetchStaff();
    } catch (err: any) {
      setToastMessage({ type: 'error', text: err.message });
    }
  };

  const handleDeleteStaff = async (staffId: string, name: string) => {
    if (!confirm(`Are you sure you want to remove staff member ${name}?`)) return;

    try {
      const res = await fetch(`/api/staff/${staffId}`, { method: 'DELETE' });
      if (res.ok) {
        setToastMessage({ type: 'success', text: `Staff member ${name} removed.` });
        fetchStaff();
      } else {
        const err = await res.json();
        setToastMessage({ type: 'error', text: err.error });
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
            Care Staff Directory
          </h1>
          <p className="text-xs text-sage-600">
            Manage nurses, caregivers, geriatric doctors, cooks, and facility support staff
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-sage-700 hover:bg-sage-800 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Staff Member</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-sage-200 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-sage-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search staff by name, phone, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-sage-200 rounded-xl bg-cream-50/50"
          />
        </div>

        <div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full py-2 px-3 border border-sage-200 rounded-xl bg-cream-50/50 text-sage-800 font-medium"
          >
            <option value="all">Role: All Roles</option>
            <option value="Caregiver">Caregiver</option>
            <option value="Nurse">Nurse</option>
            <option value="Doctor">Doctor</option>
            <option value="Physiotherapist">Physiotherapist</option>
            <option value="Cook">Cook / Kitchen</option>
            <option value="Manager">Manager</option>
            <option value="Security">Security</option>
          </select>
        </div>

        <div>
          <select
            value={shiftFilter}
            onChange={(e) => setShiftFilter(e.target.value)}
            className="w-full py-2 px-3 border border-sage-200 rounded-xl bg-cream-50/50 text-sage-800 font-medium"
          >
            <option value="all">Shift: All Shifts</option>
            <option value="Morning (7 AM - 3 PM)">Morning (7 AM - 3 PM)</option>
            <option value="Evening (3 PM - 11 PM)">Evening (3 PM - 11 PM)</option>
            <option value="Night (11 PM - 7 AM)">Night (11 PM - 7 AM)</option>
            <option value="General (9 AM - 6 PM)">General (9 AM - 6 PM)</option>
          </select>
        </div>
      </div>

      {/* Staff Cards Grid */}
      {loading ? (
        <div className="py-12 text-center text-sage-500 text-sm">
          <div className="w-8 h-8 border-3 border-sage-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          Loading staff roster...
        </div>
      ) : staffList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {staffList.map((member) => (
            <div
              key={member._id}
              className="bg-white rounded-2xl p-5 border border-sage-200 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-11 h-11 rounded-full bg-cream-200 border border-cream-300 flex items-center justify-center font-bold text-sage-800 text-sm shrink-0">
                      {member.fullName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-base text-sage-900 leading-tight">
                        {member.fullName}
                      </h3>
                      <span className="inline-block mt-0.5 text-xs font-semibold px-2 py-0.5 rounded-md bg-sage-100 text-sage-800">
                        {member.role}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      member.status === 'Active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : member.status === 'On Leave'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-zinc-100 text-zinc-700'
                    }`}
                  >
                    {member.status}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-sage-600 my-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3.5 h-3.5 text-sage-400 shrink-0" />
                    <span>{member.shift}</span>
                  </div>
                  <div className="flex items-center space-x-2 font-mono">
                    <Phone className="w-3.5 h-3.5 text-sage-400 shrink-0" />
                    <a href={`tel:${member.phone}`} className="hover:underline text-sage-900 font-semibold">
                      {member.phone}
                    </a>
                  </div>
                  <div className="flex items-center space-x-2 truncate">
                    <Mail className="w-3.5 h-3.5 text-sage-400 shrink-0" />
                    <span className="truncate">{member.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-3.5 h-3.5 text-sage-400 shrink-0" />
                    <span>Joined: {new Date(member.joiningDate).toLocaleDateString('en-GB')}</span>
                  </div>
                </div>

                {member.emergencyContact?.name && (
                  <div className="p-2.5 rounded-xl bg-cream-50 border border-cream-200 text-[11px] text-sage-700">
                    <span className="font-bold block text-sage-800">Emergency Contact:</span>
                    <span>
                      {member.emergencyContact.name} ({member.emergencyContact.relation}) •{' '}
                      {member.emergencyContact.phone}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-sage-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => handleOpenEditModal(member)}
                  className="text-sage-700 hover:text-sage-900 font-medium flex items-center gap-1"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>

                {isSuperAdmin && (
                  <button
                    onClick={() => handleDeleteStaff(member._id, member.fullName)}
                    className="text-red-600 hover:text-red-800 flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-2xl border border-sage-200 text-sage-500 text-sm">
          No staff records matching your filter.
        </div>
      )}

      {/* Add / Edit Staff Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl border border-sage-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-sage-200 pb-3">
              <h3 className="text-base font-serif font-bold text-sage-900">
                {editingStaff ? `Edit Staff: ${editingStaff.fullName}` : 'Add Staff Member'}
              </h3>
              <button onClick={() => setModalOpen(false)}>
                <X className="w-4 h-4 text-sage-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block font-semibold text-sage-800 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sister Maria Joseph"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 border border-sage-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-sage-800 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="maria@ananddham.org"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-sage-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-sage-800 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 11111"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-sage-300 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-sage-800 mb-1">Designated Role *</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 border border-sage-300 rounded-xl"
                  >
                    <option value="Caregiver">Caregiver</option>
                    <option value="Nurse">Nurse (Registered GNM/B.Sc)</option>
                    <option value="Doctor">Doctor (Geriatrician)</option>
                    <option value="Physiotherapist">Physiotherapist</option>
                    <option value="Cook">Cook / Kitchen Lead</option>
                    <option value="Manager">Facility Manager</option>
                    <option value="Security">Security Guard</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-sage-800 mb-1">Assigned Shift *</label>
                  <select
                    value={shift}
                    onChange={(e) => setShift(e.target.value)}
                    className="w-full px-3 py-2 border border-sage-300 rounded-xl"
                  >
                    <option value="Morning (7 AM - 3 PM)">Morning (7 AM - 3 PM)</option>
                    <option value="Evening (3 PM - 11 PM)">Evening (3 PM - 11 PM)</option>
                    <option value="Night (11 PM - 7 AM)">Night (11 PM - 7 AM)</option>
                    <option value="General (9 AM - 6 PM)">General (9 AM - 6 PM)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-sage-800 mb-1">Joining Date *</label>
                  <input
                    type="date"
                    required
                    value={joiningDate}
                    onChange={(e) => setJoiningDate(e.target.value)}
                    className="w-full px-3 py-2 border border-sage-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-sage-800 mb-1">Employment Status *</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-sage-300 rounded-xl"
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="p-3 bg-cream-50 rounded-xl border border-sage-200 space-y-2">
                <span className="font-bold text-sage-900 block">Emergency Contact:</span>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Name"
                    value={emergencyName}
                    onChange={(e) => setEmergencyName(e.target.value)}
                    className="px-2 py-1.5 border border-sage-300 rounded-lg bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Relation"
                    value={emergencyRelation}
                    onChange={(e) => setEmergencyRelation(e.target.value)}
                    className="px-2 py-1.5 border border-sage-300 rounded-lg bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Phone"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    className="px-2 py-1.5 border border-sage-300 rounded-lg bg-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-sage-800 mb-1">Residential Address</label>
                <input
                  type="text"
                  placeholder="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-sage-300 rounded-xl"
                />
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
                  Save Staff Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
