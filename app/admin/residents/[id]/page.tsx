'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Printer,
  Shield,
  Eye,
  EyeOff,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Heart,
  Activity,
  CreditCard,
  FileText,
  Clock,
  Plus,
  CheckCircle2,
  AlertCircle,
  X,
  FilePlus,
  Stethoscope,
  Receipt,
  BedDouble,
} from 'lucide-react';

interface ResidentDetail {
  _id: string;
  fullName: string;
  photoUrl?: string;
  dateOfBirth: string;
  age: number;
  gender: string;
  bloodGroup: string;
  maritalStatus: string;
  languages: string[];
  idType: string;
  idNumberMasked: string;
  revealedIdNumber?: string | null;
  idDocumentUrl?: string;
  admissionNumber: string;
  admissionDate: string;
  roomId?: {
    _id: string;
    roomNumber: string;
    roomType: string;
    floor: number;
    monthlyRate: number;
  };
  roomNumber?: string;
  bedNumber?: string;
  status: 'Active' | 'Discharged' | 'Deceased' | 'On Leave';
  dischargeDate?: string;
  dischargeReason?: string;
  emergencyContacts: Array<{
    _id: string;
    name: string;
    relation: string;
    phone: string;
    alternatePhone?: string;
    email?: string;
    address?: string;
    isPrimary: boolean;
  }>;
  conditions: string[];
  allergies: string[];
  medications: Array<{
    _id: string;
    name: string;
    dosage: string;
    frequency: string;
    timing: string;
    instructions?: string;
  }>;
  primaryDoctor?: {
    name: string;
    phone: string;
    clinicOrHospital: string;
  };
  insurance?: {
    provider: string;
    policyNumber: string;
  };
  dietaryNeeds?: string;
  mobilityLevel: string;
  medicalNotes: Array<{
    _id: string;
    date: string;
    title: string;
    notes: string;
    category: string;
    recordedBy: string;
  }>;
  monthlyFee: number;
  securityDeposit?: number;
  payments: Array<{
    _id: string;
    date: string;
    amount: number;
    paymentMethod: string;
    receiptNumber: string;
    billingMonth: string;
    recordedBy: string;
    remarks?: string;
  }>;
  documents: Array<{
    _id: string;
    title: string;
    documentType: string;
    fileUrl: string;
    uploadedAt: string;
    uploadedBy: string;
  }>;
  createdByName?: string;
  createdAt: string;
  updatedByName?: string;
  updatedAt: string;
}

export default function ResidentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const isSuperAdmin = session?.user?.role === 'super_admin';

  const [resident, setResident] = useState<ResidentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [revealingId, setRevealingId] = useState(false);
  const [revealedNumber, setRevealedNumber] = useState<string | null>(null);

  // Modals state
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [documentModalOpen, setDocumentModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Form states for modals
  const [noteTitle, setNoteTitle] = useState('');
  const [noteCategory, setNoteCategory] = useState('General Observation');
  const [noteContent, setNoteContent] = useState('');

  const [paymentAmount, setPaymentAmount] = useState<number>(15000);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [receiptNumber, setReceiptNumber] = useState(`RCP-${Date.now().toString().slice(-6)}`);
  const [billingMonth, setBillingMonth] = useState('October 2026');
  const [paymentRemarks, setPaymentRemarks] = useState('');

  const [docTitle, setDocTitle] = useState('');
  const [docType, setDocType] = useState('Medical Report');
  const [docUrl, setDocUrl] = useState('');

  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch resident details
  const fetchResidentData = async (reveal = false) => {
    try {
      const url = reveal
        ? `/api/residents/${params.id}?revealId=true`
        : `/api/residents/${params.id}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setResident(data);
        if (reveal && data.revealedIdNumber) {
          setRevealedNumber(data.revealedIdNumber);
        }
      } else {
        router.push('/admin/residents');
      }
    } catch (err) {
      console.error('Error fetching resident profile:', err);
    } finally {
      setLoading(false);
      setRevealingId(false);
    }
  };

  useEffect(() => {
    fetchResidentData(false);
  }, [params.id]);

  // Handle Decryption of Sensitive Govt ID
  const handleToggleRevealId = () => {
    if (revealedNumber) {
      setRevealedNumber(null);
    } else {
      setRevealingId(true);
      fetchResidentData(true);
    }
  };

  // Add Medical Note
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/residents/${params.id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: noteTitle,
          category: noteCategory,
          notes: noteContent,
          date: new Date().toISOString(),
        }),
      });

      if (res.ok) {
        setToastMessage({ type: 'success', text: 'Medical note added to timeline.' });
        setNoteModalOpen(false);
        setNoteTitle('');
        setNoteContent('');
        fetchResidentData(false);
      }
    } catch (err) {
      setToastMessage({ type: 'error', text: 'Failed to record medical note.' });
    }
  };

  // Add Payment
  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/residents/${params.id}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Number(paymentAmount),
          paymentMethod,
          receiptNumber,
          billingMonth,
          remarks: paymentRemarks,
        }),
      });

      if (res.ok) {
        setToastMessage({ type: 'success', text: 'Payment receipt logged successfully.' });
        setPaymentModalOpen(false);
        fetchResidentData(false);
      }
    } catch (err) {
      setToastMessage({ type: 'error', text: 'Failed to log payment.' });
    }
  };

  // Add Document
  const handleAddDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/residents/${params.id}/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: docTitle,
          documentType: docType,
          fileUrl: docUrl,
        }),
      });

      if (res.ok) {
        setToastMessage({ type: 'success', text: 'Document attached successfully.' });
        setDocumentModalOpen(false);
        setDocTitle('');
        setDocUrl('');
        fetchResidentData(false);
      }
    } catch (err) {
      setToastMessage({ type: 'error', text: 'Failed to attach document.' });
    }
  };

  // Soft Delete (Super Admin only)
  const handleDeleteResident = async () => {
    try {
      const res = await fetch(`/api/residents/${params.id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/admin/residents');
      } else {
        const errorData = await res.json();
        setToastMessage({ type: 'error', text: errorData.error || 'Failed to archive resident.' });
      }
    } catch (err: any) {
      setToastMessage({ type: 'error', text: err.message });
    }
  };

  if (loading || !resident) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-sage-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sage-600 text-sm font-medium">Loading resident dossier...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Toast Notification */}
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

      {/* Navigation & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <Link
          href="/admin/residents"
          className="inline-flex items-center text-xs font-semibold text-sage-700 hover:text-sage-900"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Directory
        </Link>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => window.print()}
            className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold text-sage-800 bg-white hover:bg-sage-50 border border-sage-300 rounded-xl shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4 text-sage-600" />
            <span>Print Dossier</span>
          </button>

          <Link
            href={`/admin/residents/${resident._id}/edit`}
            className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-sage-700 hover:bg-sage-800 rounded-xl shadow-xs transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span>Edit Profile</span>
          </Link>

          {isSuperAdmin && (
            <button
              onClick={() => setDeleteModalOpen(true)}
              className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Archive</span>
            </button>
          )}
        </div>
      </div>

      {/* Resident Identity Banner */}
      <div className="bg-white rounded-2xl p-6 md:p-8 border border-sage-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-5">
          <div className="w-20 h-20 rounded-2xl bg-cream-200 border-2 border-cream-300 flex items-center justify-center font-bold text-sage-800 text-2xl shadow-inner shrink-0">
            {resident.fullName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="text-2xl font-serif font-bold text-sage-900">
                {resident.fullName}
              </h1>
              <span
                className={`inline-block px-3 py-0.5 rounded-full text-xs font-bold ${
                  resident.status === 'Active'
                    ? 'bg-emerald-100 text-emerald-800'
                    : resident.status === 'On Leave'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-zinc-100 text-zinc-700'
                }`}
              >
                {resident.status}
              </span>
            </div>

            <p className="text-xs text-sage-600 flex items-center gap-3 flex-wrap">
              <span className="font-mono font-semibold text-sage-800">
                {resident.admissionNumber}
              </span>
              <span>•</span>
              <span>
                {resident.age} years old ({resident.gender})
              </span>
              <span>•</span>
              <span>Blood Group: <strong className="text-sage-800">{resident.bloodGroup}</strong></span>
              <span>•</span>
              <span className="flex items-center gap-1 font-medium text-sage-800">
                <BedDouble className="w-3.5 h-3.5 text-sage-500" />
                {resident.roomNumber ? `Room ${resident.roomNumber} (${resident.bedNumber || 'Bed 1'})` : 'No room assigned'}
              </span>
            </p>
          </div>
        </div>

        {/* Encrypted ID with audited reveal button */}
        <div className="p-4 rounded-xl bg-sage-50 border border-sage-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-sage-600 font-medium block">
              {resident.idType} Card (Encrypted at Rest)
            </span>
            <span className="font-mono font-bold text-sage-900 text-sm tracking-wider">
              {revealedNumber ? revealedNumber : resident.idNumberMasked}
            </span>
          </div>

          <button
            onClick={handleToggleRevealId}
            disabled={revealingId}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-sage-100 border border-sage-300 text-sage-800 transition-colors shrink-0"
          >
            {revealedNumber ? (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                <span>Mask ID</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-terracotta-600" />
                <span>{revealingId ? 'Decrypting...' : 'Reveal ID (Audited)'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Dossier Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Medical, Contacts, Notes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Medical Health & Prescriptions Card */}
          <div className="bg-white rounded-2xl p-6 border border-sage-200 shadow-xs">
            <h2 className="text-base font-serif font-bold text-sage-900 flex items-center gap-2 border-b border-sage-200 pb-3 mb-4">
              <Activity className="w-5 h-5 text-terracotta-500" />
              <span>Medical & Health Profile</span>
            </h2>

            <div className="space-y-4 text-xs">
              {/* Conditions & Allergies */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-cream-50 p-3.5 rounded-xl border border-cream-200">
                  <span className="font-bold text-sage-800 block mb-1">
                    Diagnosed Conditions:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {resident.conditions?.length ? (
                      resident.conditions.map((c, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-full bg-sage-100 text-sage-800 font-medium"
                        >
                          {c}
                        </span>
                      ))
                    ) : (
                      <span className="text-sage-500 italic">No chronic conditions listed</span>
                    )}
                  </div>
                </div>

                <div className="bg-red-50/70 p-3.5 rounded-xl border border-red-200">
                  <span className="font-bold text-red-900 block mb-1">
                    Known Drug & Food Allergies:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {resident.allergies?.length ? (
                      resident.allergies.map((a, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 font-semibold"
                        >
                          ⚠ {a}
                        </span>
                      ))
                    ) : (
                      <span className="text-sage-500 italic">No known allergies</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Mobility & Diet */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <span className="text-sage-500 block">Mobility Level:</span>
                  <span className="font-semibold text-sage-900">{resident.mobilityLevel}</span>
                </div>
                <div>
                  <span className="text-sage-500 block">Dietary Preferences:</span>
                  <span className="font-semibold text-sage-900">{resident.dietaryNeeds || 'Normal diet'}</span>
                </div>
              </div>

              {/* Current Medications */}
              <div className="pt-3 border-t border-sage-100">
                <span className="font-bold text-sage-800 block mb-2">
                  Daily Prescribed Medications:
                </span>
                {resident.medications?.length ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border border-sage-200 rounded-lg overflow-hidden">
                      <thead className="bg-sage-50 font-semibold text-sage-700">
                        <tr>
                          <th className="p-2">Medication</th>
                          <th className="p-2">Dosage</th>
                          <th className="p-2">Frequency</th>
                          <th className="p-2">Timing</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-sage-100">
                        {resident.medications.map((m, idx) => (
                          <tr key={idx} className="hover:bg-cream-50">
                            <td className="p-2 font-semibold text-sage-900">{m.name}</td>
                            <td className="p-2">{m.dosage}</td>
                            <td className="p-2">{m.frequency}</td>
                            <td className="p-2 text-sage-600">{m.timing}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sage-500 italic">No regular medications prescribed.</p>
                )}
              </div>

              {/* Doctor Details */}
              {resident.primaryDoctor?.name && (
                <div className="pt-3 border-t border-sage-100 flex items-center justify-between">
                  <div>
                    <span className="text-sage-500 block">Attending Geriatrician:</span>
                    <span className="font-semibold text-sage-900">
                      {resident.primaryDoctor.name} ({resident.primaryDoctor.clinicOrHospital})
                    </span>
                  </div>
                  <a
                    href={`tel:${resident.primaryDoctor.phone}`}
                    className="flex items-center space-x-1 text-terracotta-600 font-semibold hover:underline"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{resident.primaryDoctor.phone}</span>
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Medical Notes Timeline */}
          <div className="bg-white rounded-2xl p-6 border border-sage-200 shadow-xs">
            <div className="flex items-center justify-between border-b border-sage-200 pb-3 mb-4">
              <h2 className="text-base font-serif font-bold text-sage-900 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-terracotta-500" />
                <span>Dated Medical Notes & Observations</span>
              </h2>
              <button
                onClick={() => setNoteModalOpen(true)}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-sage-100 hover:bg-sage-200 text-sage-800 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Note</span>
              </button>
            </div>

            <div className="space-y-4">
              {resident.medicalNotes && resident.medicalNotes.length > 0 ? (
                resident.medicalNotes.map((note) => (
                  <div
                    key={note._id}
                    className="p-4 rounded-xl border border-sage-200 bg-cream-50/50 space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-sage-900">{note.title}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sage-200 text-sage-800">
                        {note.category}
                      </span>
                    </div>
                    <p className="text-sage-700 leading-relaxed">{note.notes}</p>
                    <div className="pt-2 text-[11px] text-sage-500 flex items-center justify-between">
                      <span>Recorded by: {note.recordedBy}</span>
                      <span>{new Date(note.date).toLocaleString('en-GB')}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-sage-500 italic py-4 text-center">
                  No medical notes recorded yet. Click &quot;Add Note&quot; to log daily observations, vitals, or doctor visits.
                </p>
              )}
            </div>
          </div>

          {/* Family & Emergency Contacts Card */}
          <div className="bg-white rounded-2xl p-6 border border-sage-200 shadow-xs">
            <h2 className="text-base font-serif font-bold text-sage-900 flex items-center gap-2 border-b border-sage-200 pb-3 mb-4">
              <Phone className="w-5 h-5 text-terracotta-500" />
              <span>Family & Emergency Contacts</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {resident.emergencyContacts.map((contact, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border text-xs space-y-2 ${
                    contact.isPrimary
                      ? 'bg-cream-100 border-terracotta-300'
                      : 'bg-cream-50/50 border-sage-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-sage-900">{contact.name}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white border border-sage-200 text-sage-700">
                      {contact.relation}
                    </span>
                  </div>

                  <div className="space-y-1 text-sage-600">
                    <div className="flex items-center gap-1.5 font-mono text-sage-900 font-semibold">
                      <Phone className="w-3.5 h-3.5 text-terracotta-600" />
                      <a href={`tel:${contact.phone}`} className="hover:underline">
                        {contact.phone}
                      </a>
                    </div>
                    {contact.email && (
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-sage-500" />
                        <span>{contact.email}</span>
                      </div>
                    )}
                    {contact.address && (
                      <div className="flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-sage-500 shrink-0 mt-0.5" />
                        <span>{contact.address}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Financial, Documents, Audit Trail */}
        <div className="space-y-6">
          {/* Financial & Fee History */}
          <div className="bg-white rounded-2xl p-6 border border-sage-200 shadow-xs">
            <div className="flex items-center justify-between border-b border-sage-200 pb-3 mb-4">
              <h2 className="text-base font-serif font-bold text-sage-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-terracotta-500" />
                <span>Financial & Payments</span>
              </h2>
              <button
                onClick={() => setPaymentModalOpen(true)}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-terracotta-500 hover:bg-terracotta-600 text-white transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log Payment</span>
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-sage-50 p-3.5 rounded-xl border border-sage-200 flex justify-between">
                <div>
                  <span className="text-sage-500 block">Monthly Care Fee:</span>
                  <span className="font-bold text-base text-sage-900">
                    ₹{resident.monthlyFee.toLocaleString('en-IN')}
                  </span>
                </div>
                <div>
                  <span className="text-sage-500 block">Security Deposit:</span>
                  <span className="font-bold text-base text-sage-900">
                    ₹{(resident.securityDeposit || 0).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div>
                <span className="font-bold text-sage-800 block mb-2">Payment History:</span>
                <div className="space-y-2">
                  {resident.payments && resident.payments.length > 0 ? (
                    resident.payments.map((p, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg border border-sage-100 bg-cream-50/50 flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-bold text-sage-900 block">
                            ₹{p.amount.toLocaleString('en-IN')} ({p.paymentMethod})
                          </span>
                          <span className="text-[11px] text-sage-500 font-mono">
                            {p.billingMonth} • {p.receiptNumber}
                          </span>
                        </div>
                        <span className="text-[11px] text-sage-500">
                          {new Date(p.date).toLocaleDateString('en-GB')}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sage-500 italic py-2">No payment entries logged yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Uploaded Documents List */}
          <div className="bg-white rounded-2xl p-6 border border-sage-200 shadow-xs">
            <div className="flex items-center justify-between border-b border-sage-200 pb-3 mb-4">
              <h2 className="text-base font-serif font-bold text-sage-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-terracotta-500" />
                <span>Documents & Consent</span>
              </h2>
              <button
                onClick={() => setDocumentModalOpen(true)}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-sage-100 hover:bg-sage-200 text-sage-800 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Attach</span>
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {resident.documents && resident.documents.length > 0 ? (
                resident.documents.map((doc, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-sage-200 bg-cream-50/40 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-semibold text-sage-900 block">{doc.title}</span>
                      <span className="text-[10px] uppercase font-bold text-sage-500">
                        {doc.documentType} • {new Date(doc.uploadedAt).toLocaleDateString('en-GB')}
                      </span>
                    </div>
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 text-xs font-semibold bg-white border border-sage-300 rounded-lg text-sage-700 hover:bg-sage-50"
                    >
                      View
                    </a>
                  </div>
                ))
              ) : (
                <p className="text-sage-500 italic py-2">No documents attached.</p>
              )}
            </div>
          </div>

          {/* Audit Trail Box */}
          <div className="bg-cream-100 rounded-2xl p-5 border border-cream-300 shadow-xs text-xs space-y-2">
            <h3 className="font-bold text-sage-900 flex items-center gap-1.5 uppercase text-[10px] tracking-wider">
              <Clock className="w-3.5 h-3.5 text-sage-600" />
              <span>Immutable Audit Trail</span>
            </h3>
            <p className="text-sage-600">
              Admitted by: <strong className="text-sage-800">{resident.createdByName || 'Staff'}</strong> on{' '}
              {new Date(resident.createdAt).toLocaleString('en-GB')}
            </p>
            {resident.updatedByName && (
              <p className="text-sage-600">
                Last modified by: <strong className="text-sage-800">{resident.updatedByName}</strong> on{' '}
                {new Date(resident.updatedAt).toLocaleString('en-GB')}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Modal: Add Medical Note */}
      {noteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl border border-sage-200 space-y-4">
            <div className="flex items-center justify-between border-b border-sage-200 pb-3">
              <h3 className="text-base font-serif font-bold text-sage-900">Add Medical Note</h3>
              <button onClick={() => setNoteModalOpen(false)}>
                <X className="w-4 h-4 text-sage-500" />
              </button>
            </div>
            <form onSubmit={handleAddNote} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-sage-800 mb-1">Title / Summary *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BP Check, Sugar Spike, Physical Therapy"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-sage-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-sage-800 mb-1">Category</label>
                <select
                  value={noteCategory}
                  onChange={(e) => setNoteCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-sage-300 rounded-xl"
                >
                  <option value="General Observation">General Observation</option>
                  <option value="Routine Checkup">Routine Checkup</option>
                  <option value="Doctor Visit">Doctor Visit</option>
                  <option value="Emergency">Emergency</option>
                  <option value="Medication Change">Medication Change</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-sage-800 mb-1">Detailed Observation *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Enter clinical observations, vitals recorded, medication changes..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full px-3 py-2 border border-sage-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNoteModalOpen(false)}
                  className="px-4 py-2 border border-sage-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sage-700 text-white font-semibold rounded-xl"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Payment */}
      {paymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl border border-sage-200 space-y-4">
            <div className="flex items-center justify-between border-b border-sage-200 pb-3">
              <h3 className="text-base font-serif font-bold text-sage-900">Record Fee Payment</h3>
              <button onClick={() => setPaymentModalOpen(false)}>
                <X className="w-4 h-4 text-sage-500" />
              </button>
            </div>
            <form onSubmit={handleAddPayment} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-sage-800 mb-1">Amount (INR) *</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-sage-300 rounded-xl font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-sage-800 mb-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2 border border-sage-300 rounded-xl"
                  >
                    <option value="UPI">UPI / GPay / PhonePe</option>
                    <option value="Bank Transfer">NEFT / Bank Transfer</option>
                    <option value="Cash">Cash</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Card">Card</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-sage-800 mb-1">Billing Month *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. October 2026"
                    value={billingMonth}
                    onChange={(e) => setBillingMonth(e.target.value)}
                    className="w-full px-3 py-2 border border-sage-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-sage-800 mb-1">Receipt Number *</label>
                <input
                  type="text"
                  required
                  value={receiptNumber}
                  onChange={(e) => setReceiptNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-sage-300 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-sage-800 mb-1">Remarks</label>
                <input
                  type="text"
                  placeholder="Optional note"
                  value={paymentRemarks}
                  onChange={(e) => setPaymentRemarks(e.target.value)}
                  className="w-full px-3 py-2 border border-sage-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPaymentModalOpen(false)}
                  className="px-4 py-2 border border-sage-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-terracotta-600 text-white font-semibold rounded-xl"
                >
                  Issue Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Attach Document */}
      {documentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl border border-sage-200 space-y-4">
            <div className="flex items-center justify-between border-b border-sage-200 pb-3">
              <h3 className="text-base font-serif font-bold text-sage-900">Attach Document</h3>
              <button onClick={() => setDocumentModalOpen(false)}>
                <X className="w-4 h-4 text-sage-500" />
              </button>
            </div>
            <form onSubmit={handleAddDocument} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-sage-800 mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Echo Cardiogram Report, Consent Agreement"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-sage-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-sage-800 mb-1">Document Type</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full px-3 py-2 border border-sage-300 rounded-xl"
                >
                  <option value="Medical Report">Medical Report</option>
                  <option value="ID Proof">Government ID Proof</option>
                  <option value="Consent Form">Consent / Admission Form</option>
                  <option value="Legal Document">Power of Attorney / Legal</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-sage-800 mb-1">File URL / Storage Link *</label>
                <input
                  type="text"
                  required
                  placeholder="https://..."
                  value={docUrl}
                  onChange={(e) => setDocUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-sage-300 rounded-xl font-mono"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDocumentModalOpen(false)}
                  className="px-4 py-2 border border-sage-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sage-700 text-white font-semibold rounded-xl"
                >
                  Save Attachment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Delete */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl border border-sage-200">
            <h3 className="text-lg font-serif font-bold text-red-600 mb-2">
              Archive Resident Dossier?
            </h3>
            <p className="text-xs text-sage-600 mb-4 leading-relaxed">
              This action will soft-delete the record for {resident.fullName} ({resident.admissionNumber}) and free up Room {resident.roomNumber || 'unassigned'}.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 text-xs border border-sage-300 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteResident}
                className="px-4 py-2 text-xs font-semibold bg-red-600 text-white rounded-xl hover:bg-red-700"
              >
                Confirm Archive
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
