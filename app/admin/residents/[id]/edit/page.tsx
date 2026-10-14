'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Heart,
  Shield,
  Phone,
  Activity,
  CreditCard,
  Plus,
  Trash2,
  AlertCircle,
} from 'lucide-react';

interface RoomOption {
  _id: string;
  roomNumber: string;
  floor: number;
  roomType: string;
  capacity: number;
  occupiedBeds: number;
  monthlyRate: number;
  status: string;
}

export default function EditResidentPage() {
  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [rooms, setRooms] = useState<RoomOption[]>([]);

  // Form States
  const [fullName, setFullName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [bloodGroup, setBloodGroup] = useState('B+');
  const [maritalStatus, setMaritalStatus] = useState('Widowed');
  const [languagesString, setLanguagesString] = useState('');

  // ID Details
  const [idType, setIdType] = useState('Aadhaar');
  const [idNumber, setIdNumber] = useState('');
  const [idDocumentUrl, setIdDocumentUrl] = useState('');

  // Admission & Room
  const [admissionDate, setAdmissionDate] = useState('');
  const [roomId, setRoomId] = useState('');
  const [bedNumber, setBedNumber] = useState('');
  const [status, setStatus] = useState<'Active' | 'Discharged' | 'Deceased' | 'On Leave'>('Active');
  const [dischargeDate, setDischargeDate] = useState('');
  const [dischargeReason, setDischargeReason] = useState('');
  const [monthlyFee, setMonthlyFee] = useState<number>(15000);
  const [securityDeposit, setSecurityDeposit] = useState<number>(0);

  // Contacts
  const [emergencyContacts, setEmergencyContacts] = useState<any[]>([]);

  // Medical
  const [conditionsString, setConditionsString] = useState('');
  const [allergiesString, setAllergiesString] = useState('');
  const [dietaryNeeds, setDietaryNeeds] = useState('');
  const [mobilityLevel, setMobilityLevel] = useState<'Independent' | 'Assisted Walking' | 'Wheelchair' | 'Bedridden'>('Independent');
  const [medications, setMedications] = useState<any[]>([]);
  const [doctorName, setDoctorName] = useState('');
  const [doctorPhone, setDoctorPhone] = useState('');
  const [doctorHospital, setDoctorHospital] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [roomsRes, residentRes] = await Promise.all([
          fetch('/api/rooms'),
          fetch(`/api/residents/${params.id}`),
        ]);

        if (roomsRes.ok) {
          const roomJson = await roomsRes.json();
          setRooms(roomJson.rooms || []);
        }

        if (residentRes.ok) {
          const r = await residentRes.json();
          setFullName(r.fullName || '');
          setPhotoUrl(r.photoUrl || '');
          setDateOfBirth(r.dateOfBirth ? r.dateOfBirth.slice(0, 10) : '');
          setGender(r.gender || 'Male');
          setBloodGroup(r.bloodGroup || 'B+');
          setMaritalStatus(r.maritalStatus || 'Widowed');
          setLanguagesString(r.languages ? r.languages.join(', ') : '');

          setIdType(r.idType || 'Aadhaar');
          setIdNumber(r.idNumberMasked || '');
          setIdDocumentUrl(r.idDocumentUrl || '');

          setAdmissionDate(r.admissionDate ? r.admissionDate.slice(0, 10) : '');
          setRoomId(r.roomId?._id || r.roomId || '');
          setBedNumber(r.bedNumber || '');
          setStatus(r.status || 'Active');
          setDischargeDate(r.dischargeDate ? r.dischargeDate.slice(0, 10) : '');
          setDischargeReason(r.dischargeReason || '');
          setMonthlyFee(r.monthlyFee || 0);
          setSecurityDeposit(r.securityDeposit || 0);

          setEmergencyContacts(r.emergencyContacts?.length ? r.emergencyContacts : []);
          setConditionsString(r.conditions ? r.conditions.join(', ') : '');
          setAllergiesString(r.allergies ? r.allergies.join(', ') : '');
          setDietaryNeeds(r.dietaryNeeds || '');
          setMobilityLevel(r.mobilityLevel || 'Independent');
          setMedications(r.medications?.length ? r.medications : []);
          setDoctorName(r.primaryDoctor?.name || '');
          setDoctorPhone(r.primaryDoctor?.phone || '');
          setDoctorHospital(r.primaryDoctor?.clinicOrHospital || '');
        }
      } catch (err) {
        console.error('Failed to load resident edit data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [params.id]);

  // Dynamic Contact helpers
  const addContact = () => {
    setEmergencyContacts([
      ...emergencyContacts,
      { name: '', relation: '', phone: '', alternatePhone: '', email: '', address: '', isPrimary: false },
    ]);
  };

  const removeContact = (index: number) => {
    setEmergencyContacts(emergencyContacts.filter((_, i) => i !== index));
  };

  const updateContact = (index: number, field: string, value: any) => {
    const updated = [...emergencyContacts];
    updated[index][field] = value;
    setEmergencyContacts(updated);
  };

  // Dynamic Medication helpers
  const addMedication = () => {
    setMedications([
      ...medications,
      { name: '', dosage: '', frequency: 'Once Daily', timing: 'After breakfast', instructions: '' },
    ]);
  };

  const removeMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const updateMedication = (index: number, field: string, value: string) => {
    const updated = [...medications];
    updated[index][field] = value;
    setMedications(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSubmitting(true);

    try {
      const payload = {
        fullName,
        photoUrl,
        dateOfBirth,
        gender,
        bloodGroup,
        maritalStatus,
        languages: languagesString.split(',').map((s) => s.trim()).filter(Boolean),
        idType,
        idNumber,
        idDocumentUrl,
        admissionDate,
        roomId: roomId || null,
        bedNumber,
        status,
        dischargeDate: dischargeDate || null,
        dischargeReason,
        monthlyFee: Number(monthlyFee),
        securityDeposit: Number(securityDeposit),
        emergencyContacts,
        conditions: conditionsString.split(',').map((s) => s.trim()).filter(Boolean),
        allergies: allergiesString.split(',').map((s) => s.trim()).filter(Boolean),
        medications,
        primaryDoctor: { name: doctorName, phone: doctorPhone, clinicOrHospital: doctorHospital },
        dietaryNeeds,
        mobilityLevel,
      };

      const res = await fetch(`/api/residents/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update resident details');
      }

      router.push(`/admin/residents/${params.id}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error updating resident');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-sage-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sage-600 text-sm font-medium">Loading resident data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      <div className="flex items-center justify-between">
        <Link
          href={`/admin/residents/${params.id}`}
          className="inline-flex items-center text-xs font-semibold text-sage-700 hover:text-sage-900"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Cancel & Return to Dossier
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-sage-200 shadow-xs overflow-hidden">
        <div className="p-6 bg-sage-800 text-cream-50 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-serif font-bold text-white">Edit Resident Record</h1>
            <p className="text-xs text-sage-200">Update status, room, medical notes, or emergency contacts</p>
          </div>
        </div>

        {errorMessage && (
          <div className="m-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-sm text-red-800">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-10">
          {/* Section 1: Personal */}
          <div>
            <h2 className="text-base font-serif font-bold text-sage-900 flex items-center gap-2 border-b border-sage-200 pb-2 mb-4">
              <Heart className="w-4 h-4 text-terracotta-500" />
              <span>1. Personal Information</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-sage-800 mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-sage-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-sage-800 mb-1">Date of Birth *</label>
                <input
                  type="date"
                  required
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-sage-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-sage-800 mb-1">Gender *</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-sage-300 rounded-xl"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-sage-800 mb-1">Blood Group</label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-sage-300 rounded-xl"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="Unknown">Unknown</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-sage-800 mb-1">Marital Status</label>
                <select
                  value={maritalStatus}
                  onChange={(e) => setMaritalStatus(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-sage-300 rounded-xl"
                >
                  <option value="Widowed">Widowed</option>
                  <option value="Married">Married</option>
                  <option value="Single">Single</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-sage-800 mb-1">Languages Spoken</label>
                <input
                  type="text"
                  value={languagesString}
                  onChange={(e) => setLanguagesString(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-sage-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-sage-800 mb-1">Photo URL</label>
                <input
                  type="text"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-sage-300 rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Section 2: ID */}
          <div>
            <h2 className="text-base font-serif font-bold text-sage-900 flex items-center gap-2 border-b border-sage-200 pb-2 mb-4">
              <Shield className="w-4 h-4 text-terracotta-500" />
              <span>2. Government Identification</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-sage-800 mb-1">ID Type</label>
                <select
                  value={idType}
                  onChange={(e) => setIdType(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-sage-300 rounded-xl"
                >
                  <option value="Aadhaar">Aadhaar</option>
                  <option value="Passport">Passport</option>
                  <option value="Voter ID">Voter ID</option>
                  <option value="PAN">PAN</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-sage-800 mb-1">ID Number (Enter new value to update)</label>
                <input
                  type="text"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-sage-300 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-sage-800 mb-1">ID Document URL</label>
                <input
                  type="text"
                  value={idDocumentUrl}
                  onChange={(e) => setIdDocumentUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-sage-300 rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Room & Status */}
          <div>
            <h2 className="text-base font-serif font-bold text-sage-900 flex items-center gap-2 border-b border-sage-200 pb-2 mb-4">
              <CreditCard className="w-4 h-4 text-terracotta-500" />
              <span>3. Room, Status & Finances</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-sage-800 mb-1">Admission Date</label>
                <input
                  type="date"
                  required
                  value={admissionDate}
                  onChange={(e) => setAdmissionDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-sage-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-sage-800 mb-1">Current Room</label>
                <select
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-sage-300 rounded-xl"
                >
                  <option value="">No Room Assigned</option>
                  {rooms.map((r) => (
                    <option key={r._id} value={r._id}>
                      Room {r.roomNumber} ({r.roomType}) - Floor {r.floor} [{r.occupiedBeds}/{r.capacity} beds]
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-sage-800 mb-1">Bed Number</label>
                <input
                  type="text"
                  value={bedNumber}
                  onChange={(e) => setBedNumber(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-sage-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-sage-800 mb-1">Resident Status *</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-sage-300 rounded-xl font-bold"
                >
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Discharged">Discharged</option>
                  <option value="Deceased">Deceased</option>
                </select>
              </div>

              {['Discharged', 'Deceased'].includes(status) && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-sage-800 mb-1">Discharge Date</label>
                    <input
                      type="date"
                      value={dischargeDate}
                      onChange={(e) => setDischargeDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-sage-300 rounded-xl"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-xs font-semibold text-sage-800 mb-1">Discharge Reason / Notes</label>
                    <input
                      type="text"
                      placeholder="e.g. Relocated with family / Hospital transfer"
                      value={dischargeReason}
                      onChange={(e) => setDischargeReason(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-sage-300 rounded-xl"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-semibold text-sage-800 mb-1">Monthly Fee (INR)</label>
                <input
                  type="number"
                  min={0}
                  value={monthlyFee}
                  onChange={(e) => setMonthlyFee(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-sage-300 rounded-xl font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Emergency Contacts */}
          <div>
            <div className="flex items-center justify-between border-b border-sage-200 pb-2 mb-4">
              <h2 className="text-base font-serif font-bold text-sage-900 flex items-center gap-2">
                <Phone className="w-4 h-4 text-terracotta-500" />
                <span>4. Family & Emergency Contacts</span>
              </h2>
              <button
                type="button"
                onClick={addContact}
                className="text-xs font-semibold text-sage-700 hover:text-sage-900 flex items-center gap-1 bg-sage-100 hover:bg-sage-200 px-3 py-1.5 rounded-lg"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Contact</span>
              </button>
            </div>

            <div className="space-y-3">
              {emergencyContacts.map((c, i) => (
                <div key={i} className="p-4 rounded-xl bg-cream-50 border border-sage-200 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs text-sage-800">Contact #{i + 1}</span>
                    {emergencyContacts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeContact(i)}
                        className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                    <div>
                      <label className="block text-sage-700 mb-1">Name *</label>
                      <input
                        type="text"
                        required
                        value={c.name}
                        onChange={(e) => updateContact(i, 'name', e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-sage-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sage-700 mb-1">Relation *</label>
                      <input
                        type="text"
                        required
                        value={c.relation}
                        onChange={(e) => updateContact(i, 'relation', e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-sage-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sage-700 mb-1">Phone *</label>
                      <input
                        type="tel"
                        required
                        value={c.phone}
                        onChange={(e) => updateContact(i, 'phone', e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-sage-300 rounded-lg bg-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-sage-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={c.email || ''}
                        onChange={(e) => updateContact(i, 'email', e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-sage-300 rounded-lg bg-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Medical */}
          <div>
            <h2 className="text-base font-serif font-bold text-sage-900 flex items-center gap-2 border-b border-sage-200 pb-2 mb-4">
              <Activity className="w-4 h-4 text-terracotta-500" />
              <span>5. Medical Health & Prescriptions</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-sage-800 mb-1">Mobility Level</label>
                <select
                  value={mobilityLevel}
                  onChange={(e) => setMobilityLevel(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-sage-300 rounded-xl"
                >
                  <option value="Independent">Independent</option>
                  <option value="Assisted Walking">Assisted Walking</option>
                  <option value="Wheelchair">Wheelchair</option>
                  <option value="Bedridden">Bedridden</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-sage-800 mb-1">Dietary Needs</label>
                <input
                  type="text"
                  value={dietaryNeeds}
                  onChange={(e) => setDietaryNeeds(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-sage-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-sage-800 mb-1">Conditions</label>
                <input
                  type="text"
                  value={conditionsString}
                  onChange={(e) => setConditionsString(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-sage-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-sage-800 mb-1">Allergies</label>
                <input
                  type="text"
                  value={allergiesString}
                  onChange={(e) => setAllergiesString(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-sage-300 rounded-xl"
                />
              </div>
            </div>

            {/* Medications */}
            <div className="pt-2">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-sage-900">Current Medications</span>
                <button
                  type="button"
                  onClick={addMedication}
                  className="text-xs font-semibold text-sage-700 bg-sage-100 hover:bg-sage-200 px-3 py-1 rounded-lg"
                >
                  + Add Drug
                </button>
              </div>

              <div className="space-y-2">
                {medications.map((m, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-cream-50 border border-sage-200 grid grid-cols-1 md:grid-cols-5 gap-2 items-center text-xs">
                    <input
                      type="text"
                      placeholder="Name"
                      value={m.name}
                      onChange={(e) => updateMedication(idx, 'name', e.target.value)}
                      className="px-2 py-1 border border-sage-300 rounded-md bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Dosage"
                      value={m.dosage}
                      onChange={(e) => updateMedication(idx, 'dosage', e.target.value)}
                      className="px-2 py-1 border border-sage-300 rounded-md bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Frequency"
                      value={m.frequency}
                      onChange={(e) => updateMedication(idx, 'frequency', e.target.value)}
                      className="px-2 py-1 border border-sage-300 rounded-md bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Timing"
                      value={m.timing}
                      onChange={(e) => updateMedication(idx, 'timing', e.target.value)}
                      className="px-2 py-1 border border-sage-300 rounded-md bg-white"
                    />
                    <div className="flex items-center space-x-1">
                      <input
                        type="text"
                        placeholder="Instructions"
                        value={m.instructions || ''}
                        onChange={(e) => updateMedication(idx, 'instructions', e.target.value)}
                        className="flex-1 px-2 py-1 border border-sage-300 rounded-md bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => removeMedication(idx)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-6 border-t border-sage-200 flex justify-end space-x-3">
            <Link
              href={`/admin/residents/${params.id}`}
              className="px-5 py-2.5 text-xs font-semibold border border-sage-300 rounded-xl"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 text-xs font-semibold bg-sage-700 text-white rounded-xl hover:bg-sage-800 disabled:opacity-50 flex items-center space-x-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{submitting ? 'Saving Changes...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
