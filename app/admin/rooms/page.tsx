'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  BedDouble,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Layers,
  Sparkles,
  Users,
} from 'lucide-react';

interface BedSlot {
  bedNumber: string;
  isOccupied: boolean;
  residentId?: string;
  residentName?: string;
}

interface RoomItem {
  _id: string;
  roomNumber: string;
  floor: number;
  roomType: 'Single' | 'Double Sharing' | 'Triple Sharing' | 'Special Care';
  capacity: number;
  occupiedBeds: number;
  beds: BedSlot[];
  monthlyRate: number;
  amenities: string[];
  status: 'Available' | 'Full' | 'Maintenance';
  notes?: string;
}

export default function RoomsManagementPage() {
  const { data: session } = useSession();
  const isSuperAdmin = session?.user?.role === 'super_admin';

  const [rooms, setRooms] = useState<RoomItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [floorFilter, setFloorFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<RoomItem | null>(null);

  // Form Fields
  const [roomNumber, setRoomNumber] = useState('');
  const [floor, setFloor] = useState(1);
  const [roomType, setRoomType] = useState<'Single' | 'Double Sharing' | 'Triple Sharing' | 'Special Care'>('Double Sharing');
  const [capacity, setCapacity] = useState(2);
  const [monthlyRate, setMonthlyRate] = useState(15000);
  const [amenitiesString, setAmenitiesString] = useState('AC, Attached Bath, Wheelchair Ramp, Emergency Alarm');
  const [roomStatus, setRoomStatus] = useState<'Available' | 'Full' | 'Maintenance'>('Available');
  const [notes, setNotes] = useState('');

  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (floorFilter !== 'all') params.set('floor', floorFilter);
      if (statusFilter !== 'all') params.set('status', statusFilter);

      const res = await fetch(`/api/rooms?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setRooms(data.rooms || []);
      }
    } catch (err) {
      console.error('Failed to load rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [floorFilter, statusFilter]);

  const handleOpenAddModal = () => {
    setEditingRoom(null);
    setRoomNumber('');
    setFloor(1);
    setRoomType('Double Sharing');
    setCapacity(2);
    setMonthlyRate(15000);
    setAmenitiesString('AC, Attached Bath, Emergency Call Alarm, Wheelchair Accessible');
    setRoomStatus('Available');
    setNotes('');
    setModalOpen(true);
  };

  const handleOpenEditModal = (room: RoomItem) => {
    setEditingRoom(room);
    setRoomNumber(room.roomNumber);
    setFloor(room.floor);
    setRoomType(room.roomType);
    setCapacity(room.capacity);
    setMonthlyRate(room.monthlyRate);
    setAmenitiesString(room.amenities ? room.amenities.join(', ') : '');
    setRoomStatus(room.status);
    setNotes(room.notes || '');
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        roomNumber,
        floor: Number(floor),
        roomType,
        capacity: Number(capacity),
        monthlyRate: Number(monthlyRate),
        amenities: amenitiesString.split(',').map((s) => s.trim()).filter(Boolean),
        status: roomStatus,
        notes,
      };

      const url = editingRoom ? `/api/rooms/${editingRoom._id}` : '/api/rooms';
      const method = editingRoom ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to save room details.');
      }

      setToastMessage({
        type: 'success',
        text: editingRoom ? `Room ${roomNumber} updated successfully.` : `Room ${roomNumber} added.`,
      });
      setModalOpen(false);
      fetchRooms();
    } catch (err: any) {
      setToastMessage({ type: 'error', text: err.message });
    }
  };

  const handleDeleteRoom = async (roomId: string, rNum: string) => {
    if (!confirm(`Are you sure you want to delete Room ${rNum}?`)) return;

    try {
      const res = await fetch(`/api/rooms/${roomId}`, { method: 'DELETE' });
      if (res.ok) {
        setToastMessage({ type: 'success', text: `Room ${rNum} deleted.` });
        fetchRooms();
      } else {
        const err = await res.json();
        setToastMessage({ type: 'error', text: err.error });
      }
    } catch (e: any) {
      setToastMessage({ type: 'error', text: e.message });
    }
  };

  // Group rooms by floor
  const floors = Array.from(new Set(rooms.map((r) => r.floor))).sort((a, b) => a - b);

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
            Rooms & Bed Occupancy
          </h1>
          <p className="text-xs text-sage-600">
            Monitor real-time room capacity, bed allocations, and maintenance schedules
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleOpenAddModal}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-sage-700 hover:bg-sage-800 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add New Room</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-sage-200 shadow-xs flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-sage-800">Filter Floor:</span>
          <select
            value={floorFilter}
            onChange={(e) => setFloorFilter(e.target.value)}
            className="py-1.5 px-3 border border-sage-200 rounded-lg bg-cream-50"
          >
            <option value="all">All Floors</option>
            <option value="1">Ground / Floor 1</option>
            <option value="2">Floor 2</option>
            <option value="3">Floor 3</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <span className="font-semibold text-sage-800">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-1.5 px-3 border border-sage-200 rounded-lg bg-cream-50"
          >
            <option value="all">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Full">Full</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>

        <div className="ml-auto flex items-center space-x-4 text-[11px] text-sage-600">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span> Available Bed
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-sage-700"></span> Occupied Bed
          </span>
        </div>
      </div>

      {/* Rooms Grid Grouped by Floor */}
      {loading ? (
        <div className="py-12 text-center text-sage-500 text-sm">
          <div className="w-8 h-8 border-3 border-sage-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          Loading rooms layout...
        </div>
      ) : floors.length > 0 ? (
        floors.map((fl) => {
          const floorRooms = rooms.filter((r) => r.floor === fl);
          return (
            <div key={fl} className="space-y-3">
              <h2 className="text-sm font-bold text-sage-800 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-terracotta-500" />
                <span>Floor {fl}</span>
                <span className="text-xs font-normal text-sage-500">
                  ({floorRooms.length} room{floorRooms.length > 1 ? 's' : ''})
                </span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {floorRooms.map((room) => {
                  const isFull = room.occupiedBeds >= room.capacity;
                  const isMaintenance = room.status === 'Maintenance';

                  return (
                    <div
                      key={room._id}
                      className={`bg-white rounded-2xl p-5 border shadow-xs transition-shadow flex flex-col justify-between ${
                        isMaintenance
                          ? 'border-amber-300 bg-amber-50/20'
                          : isFull
                          ? 'border-sage-300'
                          : 'border-emerald-200'
                      }`}
                    >
                      <div>
                        {/* Top Card Info */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-serif font-bold text-sage-900">
                              Room {room.roomNumber}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded-md bg-sage-100 text-sage-700 font-medium">
                              {room.roomType}
                            </span>
                          </div>

                          <span
                            className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                              isMaintenance
                                ? 'bg-amber-100 text-amber-800'
                                : isFull
                                ? 'bg-zinc-100 text-zinc-700'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {room.status}
                          </span>
                        </div>

                        <p className="text-xs text-sage-500 mb-4">
                          ₹{room.monthlyRate.toLocaleString('en-IN')}/mo • Capacity: {room.capacity} beds
                        </p>

                        {/* Bed Slots Visuals */}
                        <div className="space-y-2 mb-4">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-sage-600 block">
                            Bed Occupancy ({room.occupiedBeds}/{room.capacity}):
                          </span>
                          <div className="grid grid-cols-2 gap-2">
                            {room.beds?.map((bed, bIdx) => (
                              <div
                                key={bIdx}
                                className={`p-2 rounded-xl border text-xs flex items-center space-x-2 ${
                                  bed.isOccupied
                                    ? 'bg-sage-100 border-sage-300 text-sage-900'
                                    : 'bg-emerald-50/80 border-emerald-200 text-emerald-800'
                                }`}
                              >
                                <BedDouble
                                  className={`w-4 h-4 shrink-0 ${
                                    bed.isOccupied ? 'text-sage-700' : 'text-emerald-600'
                                  }`}
                                />
                                <div className="truncate min-w-0">
                                  <span className="font-semibold block text-[11px]">
                                    {bed.bedNumber}
                                  </span>
                                  <span className="text-[10px] truncate block text-sage-600">
                                    {bed.isOccupied ? (bed.residentName || 'Occupied') : 'Vacant'}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Amenities */}
                        {room.amenities?.length > 0 && (
                          <div className="flex flex-wrap gap-1 text-[10px] text-sage-600 mb-4">
                            {room.amenities.map((am, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-md bg-cream-100 border border-cream-200"
                              >
                                {am}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Card Footer Actions */}
                      <div className="pt-3 border-t border-sage-100 flex items-center justify-between text-xs">
                        <button
                          onClick={() => handleOpenEditModal(room)}
                          className="text-sage-700 hover:text-sage-900 font-medium flex items-center gap-1"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit Details</span>
                        </button>

                        {isSuperAdmin && room.occupiedBeds === 0 && (
                          <button
                            onClick={() => handleDeleteRoom(room._id, room.roomNumber)}
                            className="text-red-600 hover:text-red-800 flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      ) : (
        <div className="p-12 text-center bg-white rounded-2xl border border-sage-200 text-sage-500 text-sm">
          No rooms found matching filters.
        </div>
      )}

      {/* Add / Edit Room Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl border border-sage-200 space-y-4">
            <div className="flex items-center justify-between border-b border-sage-200 pb-3">
              <h3 className="text-base font-serif font-bold text-sage-900">
                {editingRoom ? `Edit Room ${editingRoom.roomNumber}` : 'Add New Room'}
              </h3>
              <button onClick={() => setModalOpen(false)}>
                <X className="w-4 h-4 text-sage-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-sage-800 mb-1">Room Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 101"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-sage-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-sage-800 mb-1">Floor *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={floor}
                    onChange={(e) => setFloor(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-sage-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-sage-800 mb-1">Room Type *</label>
                  <select
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-sage-300 rounded-xl"
                  >
                    <option value="Single">Single (Private)</option>
                    <option value="Double Sharing">Double Sharing</option>
                    <option value="Triple Sharing">Triple Sharing</option>
                    <option value="Special Care">Special Care (ICU / Memory)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-sage-800 mb-1">Capacity (Beds) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-sage-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-sage-800 mb-1">Monthly Rate (INR) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={monthlyRate}
                    onChange={(e) => setMonthlyRate(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-sage-300 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-sage-800 mb-1">Status</label>
                  <select
                    value={roomStatus}
                    onChange={(e) => setRoomStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-sage-300 rounded-xl"
                  >
                    <option value="Available">Available</option>
                    <option value="Full">Full</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-sage-800 mb-1">Amenities (comma separated)</label>
                <input
                  type="text"
                  placeholder="AC, Attached Bath, Wheelchair Accessible, Alarm"
                  value={amenitiesString}
                  onChange={(e) => setAmenitiesString(e.target.value)}
                  className="w-full px-3 py-2 border border-sage-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-sage-800 mb-1">Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Garden facing balcony"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
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
                  Save Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
