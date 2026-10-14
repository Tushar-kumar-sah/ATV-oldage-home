'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  UserPlus,
  Heart,
  Shield,
  Phone,
  Activity,
  CreditCard,
  Plus,
  Trash2,
  CheckCircle2,
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

export default function NewResidentPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<RoomOption[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 1. Personal
  const [fullName, setFullName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [bloodGroup, setBloodGroup] = useState('B+');
  const [maritalStatus, setMaritalStatus] = useState('Widowed');
  const [languagesString, setLanguagesString] = useState('Hindi, English');

  // 2. ID Details
  const [idType, setIdType] = useState('Aadhaar');
  const [idNumber, setIdNumber] = useState('');
  const [idDocumentUrl, setIdDocumentUrl] = useState('');

  // 3. Admission & Room
  const [admissionDate, setAdmissionDate] = useState(new Date().toISOString().slice(0, 10));
  const [roomId, setRoomId] = useState('');
  const [bedNumber, setBedNumber] = useState('Bed 1');
  const [status, setStatus] = useState('Active');
  const [monthlyFee, setMonthlyFee] = useState<number>(15000);
  const [securityDeposit, setSecurityDeposit] = useState<number>(30000);

  // 4. Emergency Contacts (Array)
  const [emergencyContacts, setEmergencyContacts] = useState([
    {
      name: '',
      relation: 'Son',
      phone: '',
      alternatePhone: '',
      email: '',
      address: '',
      isPrimary: true,
    },
  ]);

  // 5. Medical
  const [conditionsString, setConditionsString] = useState('Hypertension, Mild Arthritis');
  const [allergiesString, setAllergiesString] = useState('Penicillin');
  const [dietaryNeeds, setDietaryNeeds] = useState('Low sodium, Diabetic-friendly');
  const [mobilityLevel, setMobilityLevel] = useState<'Independent' | 'Assisted Walking' | 'Wheelchair' | 'Bedridden'>('Independent');

  const [medications, setMedications] = useState([
    {
      name: 'Amlodipine',
      dosage: '5mg',
      frequency: 'Once Daily',
      timing: 'Morning after breakfast',
      instructions: 'For blood pressure control',
    },
  ]);

  const [doctorName, setDoctorName] = useState('Dr. Arvind Sharma');
  const [doctorPhone, setDoctorPhone] = useState('+91 98765 43210');
  const [doctorHospital, setDoctorHospital] = useState('City Geriatric Clinic');

  const [insuranceProvider, setInsuranceProvider] = useState('Star Health Senior Red Carpet');
  const [insurancePolicy, setInsurancePolicy] = useState('SH-9928172');

  // Load available rooms
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

  // Update monthly fee when room is selected
  const handleRoomSelect = (selectedId: string) => {
    setRoomId(selectedId);
    const room = rooms.find((r) => r._id === selectedId);
    if (room && room.monthlyRate) {
      setMonthlyFee(room.monthlyRate);
    }
  };

  // Add / Remove contact
  const addContact = () => {
    setEmergencyContacts([
      ...emergencyContacts,
      {
        name: '',
        relation: 'Daughter',
        phone: '',
        alternatePhone: '',
        email: '',
        address: '',
        isPrimary: false,
      },
    ]);
  };

  const removeContact = (index: number) => {
    if (emergencyContacts.length <= 1) return;
    setEmergencyContacts(emergencyContacts.filter((_, i) => i !== index));
  };

  const updateContact = (index: number, field: string, value: any) => {
    const updated = [...emergencyContacts];
    (updated[index] as any)[field] = value;
    setEmergencyContacts(updated);
  };

  // Add / Remove medication
  const addMedication = () => {
    setMedications([
      ...medications,
      {
        name: '',
        dosage: '',
        frequency: 'Twice Daily',
        timing: 'After meals',
        instructions: '',
      },
    ]);
  };

  const removeMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const updateMedication = (index: number, field: string, value: string) => {
    const updated = [...medications];
    (updated[index] as any)[field] = value;
    setMedications(updated);
  };

  // Form Submit
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
        languages: languagesString
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        idType,
        idNumber,
        idDocumentUrl,
        admissionDate,
        roomId: roomId || null,
        bedNumber,
        status,
        monthlyFee: Number(monthlyFee),
        securityDeposit: Number(securityDeposit),
        emergencyContacts,
        conditions: conditionsString
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        allergies: allergiesString
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        medications,
        primaryDoctor: {
          name: doctorName,
          phone: doctorPhone,
          clinicOrHospital: doctorHospital,
        },
        insurance: {
          provider: insuranceProvider,
          policyNumber: insurancePolicy,
        },
        dietaryNeeds,
        mobilityLevel,
      };

      const res = await fetch('/api/residents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to admit resident');
      }

      const data = await res.json();
      router.push(`/admin/residents/${data.resident._id}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error admitting resident');
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/residents"
          className="inline-flex items-center text-xs font-semibold text-sage-700 hover:text-sage-900"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Directory
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-sage-200 shadow-xs overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-sage-800 text-cream-50">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-terracotta-500 flex items-center justify-center text-white">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-serif font-bold text-white">
                Admit New Resident
              </h1>
              <p className="text-xs text-sage-200">
                Complete personal, medical, emergency, and room admission details
              </p>
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="m-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-sm text-red-800">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-10">
          {/* SECTION 1: Personal Details */}
          <div>
            <h2 className="text-base font-serif font-bold text-sage-900 flex items-center gap-2 border-b border-sage-200 pb-2 mb-4">
              <Heart className="w-4 h-4 text-terracotta-500" />
              <span>1. Personal Information</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-sage-800 mb-1">
                  Full Legal Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Chandra Verma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-sage-300 rounded-xl focus:ring-2 focus:ring-sage-500 bg-cream-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-sage-800 mb-1">
                  Date of Birth * (Auto Age)
                </label>
                <input
                  type="date"
                  required
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-sage-300 rounded-xl focus:ring-2 focus:ring-sage-500 bg-cream-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-sage-800 mb-1">
                  Gender *
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-sage-300 rounded-xl focus:ring-2 focus:ring-sage-500 bg-cream-50/50"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-sage-800 mb-1">
                  Blood Group
                </label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-sage-300 rounded-xl focus:ring-2 focus:ring-sage-500 bg-cream-50/50"
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
                <label className="block text-xs font-semibold text-sage-800 mb-1">
                  Marital Status
                </label>
                <select
                  value={maritalStatus}
                  onChange={(e) => setMaritalStatus(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-sage-300 rounded-xl focus:ring-2 focus:ring-sage-500 bg-cream-50/50"
                >
                  <option value="Widowed">Widowed</option>
                  <option value="Married">Married</option>
                  <option value="Single">Single</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-sage-800 mb-1">
                  Languages Spoken (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Hindi, English, Gujarati"
                  value={languagesString}
                  onChange={(e) => setLanguagesString(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-sage-300 rounded-xl focus:ring-2 focus:ring-sage-500 bg-cream-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-sage-800 mb-1">
                  Photo URL (Optional)
                </label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-sage-300 rounded-xl focus:ring-2 focus:ring-sage-500 bg-cream-50/50"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Government ID & Security */}
          <div>
            <h2 className="text-base font-serif font-bold text-sage-900 flex items-center gap-2 border-b border-sage-200 pb-2 mb-4">
              <Shield className="w-4 h-4 text-terracotta-500" />
              <span>2. Government Identification (Encrypted at Rest)</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-sage-800 mb-1">
                  ID Type *
                </label>
                <select
                  value={idType}
                  onChange={(e) => setIdType(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-sage-300 rounded-xl focus:ring-2 focus:ring-sage-500 bg-cream-50/50"
                >
                  <option value="Aadhaar">Aadhaar Card (12 digits)</option>
                  <option value="Passport">Passport</option>
                  <option value="Voter ID">Voter ID</option>
                  <option value="PAN">PAN Card</option>
                  <option value="Other">Other Government ID</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-sage-800 mb-1">
                  ID Number * (AES-256-GCM Encrypted)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 5421 9876 1234"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-sage-300 rounded-xl focus:ring-2 focus:ring-sage-500 bg-cream-50/50 font-mono"
                />
                <span className="text-[10px] text-sage-500">
                  Stored securely encrypted. Only masked format shown by default.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-sage-800 mb-1">
                  Scanned Document URL / Cloudinary Link
                </label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={idDocumentUrl}
                  onChange={(e) => setIdDocumentUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-sage-300 rounded-xl focus:ring-2 focus:ring-sage-500 bg-cream-50/50"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: Admission & Room Assignment */}
          <div>
            <h2 className="text-base font-serif font-bold text-sage-900 flex items-center gap-2 border-b border-sage-200 pb-2 mb-4">
              <CreditCard className="w-4 h-4 text-terracotta-500" />
              <span>3. Admission, Room & Financial Agreement</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-sage-800 mb-1">
                  Admission Date *
                </label>
                <input
                  type="date"
                  required
                  value={admissionDate}
                  onChange={(e) => setAdmissionDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-sage-300 rounded-xl focus:ring-2 focus:ring-sage-500 bg-cream-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-sage-800 mb-1">
                  Assign Room
                </label>
                <select
                  value={roomId}
                  onChange={(e) => handleRoomSelect(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-sage-300 rounded-xl focus:ring-2 focus:ring-sage-500 bg-cream-50/50"
                >
                  <option value="">No Room Assigned Yet</option>
                  {rooms.map((r) => {
                    const isAvailable = r.occupiedBeds < r.capacity;
                    return (
                      <option
                        key={r._id}
                        value={r._id}
                        disabled={!isAvailable && r.status === 'Full'}
                      >
                        Room {r.roomNumber} ({r.roomType}) - Floor {r.floor} [
                        {r.occupiedBeds}/{r.capacity} beds]
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-sage-800 mb-1">
                  Bed Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bed 1"
                  value={bedNumber}
                  onChange={(e) => setBedNumber(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-sage-300 rounded-xl focus:ring-2 focus:ring-sage-500 bg-cream-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-sage-800 mb-1">
                  Status *
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-sage-300 rounded-xl focus:ring-2 focus:ring-sage-500 bg-cream-50/50 font-semibold"
                >
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Discharged">Discharged</option>
                  <option value="Deceased">Deceased</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-sage-800 mb-1">
                  Monthly Fee (INR) *
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={monthlyFee}
                  onChange={(e) => setMonthlyFee(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-sage-300 rounded-xl focus:ring-2 focus:ring-sage-500 bg-cream-50/50 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-sage-800 mb-1">
                  Security Deposit (INR)
                </label>
                <input
                  type="number"
                  min={0}
                  value={securityDeposit}
                  onChange={(e) => setSecurityDeposit(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-sage-300 rounded-xl focus:ring-2 focus:ring-sage-500 bg-cream-50/50 font-mono"
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: Family & Emergency Contacts */}
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
                <span>Add Another Contact</span>
              </button>
            </div>

            <div className="space-y-4">
              {emergencyContacts.map((contact, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-cream-50/80 border border-sage-200 space-y-3 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-sage-800">
                      Contact #{idx + 1}{' '}
                      {contact.isPrimary && (
                        <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-terracotta-100 text-terracotta-800">
                          Primary Contact
                        </span>
                      )}
                    </span>
                    {emergencyContacts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeContact(idx)}
                        className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-sage-700 mb-1">
                        Contact Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Vikas Verma"
                        value={contact.name}
                        onChange={(e) => updateContact(idx, 'name', e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs border border-sage-300 rounded-lg bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-sage-700 mb-1">
                        Relation *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Son / Daughter"
                        value={contact.relation}
                        onChange={(e) => updateContact(idx, 'relation', e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs border border-sage-300 rounded-lg bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-sage-700 mb-1">
                        Primary Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 00000"
                        value={contact.phone}
                        onChange={(e) => updateContact(idx, 'phone', e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs border border-sage-300 rounded-lg bg-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-sage-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="contact@gmail.com"
                        value={contact.email}
                        onChange={(e) => updateContact(idx, 'email', e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs border border-sage-300 rounded-lg bg-white"
                      />
                    </div>

                    <div className="md:col-span-3">
                      <label className="block text-[11px] font-semibold text-sage-700 mb-1">
                        Residential Address
                      </label>
                      <input
                        type="text"
                        placeholder="City, State, Pincode"
                        value={contact.address}
                        onChange={(e) => updateContact(idx, 'address', e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs border border-sage-300 rounded-lg bg-white"
                      />
                    </div>

                    <div className="flex items-center pt-4">
                      <label className="flex items-center space-x-2 text-xs text-sage-800 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={contact.isPrimary}
                          onChange={(e) => updateContact(idx, 'isPrimary', e.target.checked)}
                          className="rounded border-sage-300 text-sage-600 focus:ring-sage-500"
                        />
                        <span className="font-medium">Set as primary emergency contact</span>
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 5: Medical, Dietary & Mobility */}
          <div>
            <h2 className="text-base font-serif font-bold text-sage-900 flex items-center gap-2 border-b border-sage-200 pb-2 mb-4">
              <Activity className="w-4 h-4 text-terracotta-500" />
              <span>5. Medical Health, Medications & Mobility</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-sage-800 mb-1">
                  Mobility Level *
                </label>
                <select
                  value={mobilityLevel}
                  onChange={(e) => setMobilityLevel(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-sage-300 rounded-xl focus:ring-2 focus:ring-sage-500 bg-cream-50/50"
                >
                  <option value="Independent">Independent (Walks without support)</option>
                  <option value="Assisted Walking">Assisted Walking (Requires cane / walker)</option>
                  <option value="Wheelchair">Wheelchair (Requires assistance for movement)</option>
                  <option value="Bedridden">Bedridden (Full care required)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-sage-800 mb-1">
                  Dietary Needs & Restrictions
                </label>
                <input
                  type="text"
                  placeholder="e.g. Low salt, pure vegetarian, soft diet"
                  value={dietaryNeeds}
                  onChange={(e) => setDietaryNeeds(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-sage-300 rounded-xl focus:ring-2 focus:ring-sage-500 bg-cream-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-sage-800 mb-1">
                  Known Medical Conditions (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Hypertension, Type 2 Diabetes, Arthritis"
                  value={conditionsString}
                  onChange={(e) => setConditionsString(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-sage-300 rounded-xl focus:ring-2 focus:ring-sage-500 bg-cream-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-sage-800 mb-1">
                  Allergies (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sulfa drugs, Peanuts, Dust"
                  value={allergiesString}
                  onChange={(e) => setAllergiesString(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-sage-300 rounded-xl focus:ring-2 focus:ring-sage-500 bg-cream-50/50"
                />
              </div>
            </div>

            {/* Medications Array */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-sage-900">
                  Current Medications & Prescriptions
                </span>
                <button
                  type="button"
                  onClick={addMedication}
                  className="text-xs font-semibold text-sage-700 hover:text-sage-900 flex items-center gap-1 bg-sage-100 hover:bg-sage-200 px-3 py-1 rounded-lg"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Medication</span>
                </button>
              </div>

              <div className="space-y-3">
                {medications.map((med, mIdx) => (
                  <div
                    key={mIdx}
                    className="p-3 rounded-xl bg-cream-50/60 border border-sage-200 grid grid-cols-1 md:grid-cols-5 gap-2 items-center"
                  >
                    <div>
                      <input
                        type="text"
                        placeholder="Drug Name (e.g. Metformin)"
                        value={med.name}
                        onChange={(e) => updateMedication(mIdx, 'name', e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs border border-sage-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Dose (e.g. 500mg)"
                        value={med.dosage}
                        onChange={(e) => updateMedication(mIdx, 'dosage', e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs border border-sage-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Frequency (e.g. Twice Daily)"
                        value={med.frequency}
                        onChange={(e) => updateMedication(mIdx, 'frequency', e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs border border-sage-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Timing (e.g. Post Lunch)"
                        value={med.timing}
                        onChange={(e) => updateMedication(mIdx, 'timing', e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs border border-sage-300 rounded-lg bg-white"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="Notes"
                        value={med.instructions}
                        onChange={(e) => updateMedication(mIdx, 'instructions', e.target.value)}
                        className="flex-1 px-2.5 py-1.5 text-xs border border-sage-300 rounded-lg bg-white"
                      />
                      {medications.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMedication(mIdx)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Doctor & Insurance */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-sage-100">
              <div>
                <label className="block text-xs font-semibold text-sage-800 mb-1">
                  Primary Attending Doctor
                </label>
                <input
                  type="text"
                  placeholder="Doctor's name"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-sage-300 rounded-xl bg-cream-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-sage-800 mb-1">
                  Doctor Emergency Phone
                </label>
                <input
                  type="text"
                  placeholder="Doctor's contact"
                  value={doctorPhone}
                  onChange={(e) => setDoctorPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-sage-300 rounded-xl bg-cream-50/50 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-sage-800 mb-1">
                  Clinic or Hospital Affiliation
                </label>
                <input
                  type="text"
                  placeholder="Hospital name"
                  value={doctorHospital}
                  onChange={(e) => setDoctorHospital(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-sage-300 rounded-xl bg-cream-50/50"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-6 border-t border-sage-200 flex items-center justify-end space-x-4">
            <Link
              href="/admin/residents"
              className="px-5 py-2.5 text-xs font-semibold text-sage-700 hover:bg-sage-100 rounded-xl border border-sage-300 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 text-xs font-semibold text-white bg-sage-700 hover:bg-sage-800 rounded-xl shadow-sm transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>{submitting ? 'Admitting Resident...' : 'Complete Admission'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
