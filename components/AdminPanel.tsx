import React, { useState, useEffect } from 'react';
import { Booking } from '../types';
import { Calendar, MapPin, Users, Phone, User, Trash2, CheckCircle, XCircle, Clock, Car, CreditCard, UserCheck } from 'lucide-react';

const AdminPanel: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('hamsafar_bookings');
    if (saved) {
      setBookings(JSON.parse(saved));
    }
  }, []);

  const updateBookingStatus = (id: string, status: 'confirmed' | 'cancelled') => {
    const updated = bookings.map(b => b.id === id ? { ...b, status } : b);
    setBookings(updated);
    localStorage.setItem('hamsafar_bookings', JSON.stringify(updated));
  };

  const updateServiceStatus = (id: string, serviceStatus: 'available' | 'pending' | 'not-available') => {
    const updated = bookings.map(b => b.id === id ? { ...b, serviceStatus } : b);
    setBookings(updated);
    localStorage.setItem('hamsafar_bookings', JSON.stringify(updated));
  };

  const updateRideStatus = (id: string, rideStatus: 'pending' | 'driver-assigned' | 'on-the-way' | 'completed') => {
    const updated = bookings.map(b => b.id === id ? { ...b, rideStatus } : b);
    setBookings(updated);
    localStorage.setItem('hamsafar_bookings', JSON.stringify(updated));
  };

  const assignDriver = (id: string) => {
    const driverName = prompt('Driver Name:');
    const driverPhone = prompt('Driver Phone:');
    if (driverName && driverPhone) {
      const updated = bookings.map(b => b.id === id ? { ...b, driverName, driverPhone, rideStatus: 'driver-assigned' as const } : b);
      setBookings(updated);
      localStorage.setItem('hamsafar_bookings', JSON.stringify(updated));
    }
  };

  const deleteBooking = (id: string) => {
    if (confirm('Delete this booking?')) {
      const updated = bookings.filter(b => b.id !== id);
      setBookings(updated);
      localStorage.setItem('hamsafar_bookings', JSON.stringify(updated));
    }
  };

  const vehicleIcons: Record<string, string> = {
    bike: '🏍️',
    car: '🚗',
    van: '🚐',
    hiace: '🚌',
    coaster: '🚍'
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Admin Panel</h1>
        <p className="text-slate-500 mt-1">Manage all bookings</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          {bookings.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <Calendar size={48} className="mx-auto mb-4 opacity-50" />
              <p>No bookings yet</p>
            </div>
          ) : (
            <div className="min-w-full">
              {bookings.map((booking) => (
                <div key={booking.id} className="border-b border-slate-100 p-4 sm:p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start gap-3">
                        <User size={18} className="text-blue-500 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-slate-800">{booking.userName}</p>
                          <p className="text-sm text-slate-500 flex items-center gap-1">
                            <Phone size={14} /> {booking.userPhone}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-start gap-2">
                          <MapPin size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-slate-400">From</p>
                            <p className="text-slate-700 font-medium">{booking.pickup}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-slate-400">To</p>
                            <p className="text-slate-700 font-medium">{booking.destination}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3 text-sm">
                        <span className="flex items-center gap-1 text-slate-600">
                          <Calendar size={14} /> {booking.date}
                        </span>
                        <span className="flex items-center gap-1 text-slate-600">
                          <Clock size={14} /> {booking.time}
                        </span>
                        <span className="flex items-center gap-1 text-slate-600">
                          <Users size={14} /> {booking.seats} seat{booking.seats > 1 ? 's' : ''}
                        </span>
                        <span className="flex items-center gap-1 text-slate-600">
                          <span className="text-base">{vehicleIcons[booking.vehicleType]}</span> {booking.vehicleType}
                        </span>
                      </div>

                      {booking.notes && (
                        <p className="text-sm text-slate-500 italic bg-slate-50 p-2 rounded-lg">
                          {booking.notes}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-2 text-sm">
                        <span className={`px-2 py-1 rounded-lg font-medium ${
                          booking.paymentMethod === 'online' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {booking.paymentMethod === 'online' ? '💳 Online' : '💵 Cash'}
                        </span>
                        <span className={`px-2 py-1 rounded-lg font-medium ${
                          booking.rideStatus === 'completed' ? 'bg-green-100 text-green-700' :
                          booking.rideStatus === 'on-the-way' ? 'bg-blue-100 text-blue-700' :
                          booking.rideStatus === 'driver-assigned' ? 'bg-purple-100 text-purple-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {booking.rideStatus === 'completed' ? '✓ Completed' :
                           booking.rideStatus === 'on-the-way' ? '🚗 On The Way' :
                           booking.rideStatus === 'driver-assigned' ? '👨 Driver Assigned' :
                           '⏳ Pending'}
                        </span>
                      </div>

                      {booking.driverName && (
                        <div className="bg-purple-50 p-3 rounded-lg">
                          <p className="text-xs text-purple-600 font-semibold mb-1">Driver Info</p>
                          <p className="text-sm font-medium text-slate-800">{booking.driverName}</p>
                          <p className="text-sm text-slate-600">{booking.driverPhone}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex lg:flex-col gap-2">
                      <div className="space-y-2">
                        <span className={`block px-3 py-1 rounded-full text-xs font-semibold text-center ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {booking.status || 'pending'}
                        </span>
                        
                        <select
                          value={booking.serviceStatus || 'pending'}
                          onChange={(e) => updateServiceStatus(booking.id!, e.target.value as any)}
                          className={`w-full px-2 py-1 rounded-lg text-xs font-semibold border-2 outline-none ${
                            booking.serviceStatus === 'available' ? 'bg-green-50 text-green-700 border-green-200' :
                            booking.serviceStatus === 'not-available' ? 'bg-red-50 text-red-700 border-red-200' :
                            'bg-yellow-50 text-yellow-700 border-yellow-200'
                          }`}
                        >
                          <option value="pending">⏳ Pending</option>
                          <option value="available">✓ Available</option>
                          <option value="not-available">✗ Not Available</option>
                        </select>

                        <select
                          value={booking.rideStatus || 'pending'}
                          onChange={(e) => updateRideStatus(booking.id!, e.target.value as any)}
                          className="w-full px-2 py-1 rounded-lg text-xs font-semibold border-2 border-blue-200 bg-blue-50 text-blue-700 outline-none"
                        >
                          <option value="pending">Pending</option>
                          <option value="driver-assigned">Driver Assigned</option>
                          <option value="on-the-way">On The Way</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                      
                      <div className="flex lg:flex-col gap-2">
                        {!booking.driverName && (
                          <button
                            onClick={() => assignDriver(booking.id!)}
                            className="p-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
                            title="Assign Driver"
                          >
                            <UserCheck size={18} />
                          </button>
                        )}
                        {booking.status !== 'confirmed' && (
                          <button
                            onClick={() => updateBookingStatus(booking.id!, 'confirmed')}
                            className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                            title="Confirm"
                          >
                            <CheckCircle size={18} />
                          </button>
                        )}
                        {booking.status !== 'cancelled' && (
                          <button
                            onClick={() => updateBookingStatus(booking.id!, 'cancelled')}
                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                            title="Cancel"
                          >
                            <XCircle size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => deleteBooking(booking.id!)}
                          className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
