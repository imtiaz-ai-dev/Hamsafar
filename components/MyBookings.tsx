import React, { useState, useEffect } from 'react';
import { Booking, User } from '../types';
import { Calendar, MapPin, Clock, CheckCircle, XCircle, AlertCircle, Phone, User as UserIcon, CreditCard } from 'lucide-react';

interface MyBookingsProps {
  user: User;
}

const MyBookings: React.FC<MyBookingsProps> = ({ user }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('hamsafar_bookings');
    if (saved) {
      const all = JSON.parse(saved);
      setBookings(all.filter((b: Booking) => b.userId === user.id));
    }
  }, [user.id]);

  const getStatusIcon = (status?: string) => {
    if (status === 'available') return <CheckCircle size={20} className="text-green-500" />;
    if (status === 'not-available') return <XCircle size={20} className="text-red-500" />;
    return <AlertCircle size={20} className="text-yellow-500" />;
  };

  const getStatusText = (status?: string) => {
    if (status === 'available') return 'Available';
    if (status === 'not-available') return 'Not Available';
    return 'Pending';
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-slate-800">My Bookings</h2>
      {bookings.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center text-slate-400">
          <Calendar size={48} className="mx-auto mb-4 opacity-50" />
          <p>No bookings yet</p>
        </div>
      ) : (
        bookings.map(booking => (
          <div key={booking.id} className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-slate-100">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {getStatusIcon(booking.serviceStatus)}
                <div>
                  <p className="font-bold text-slate-800">{getStatusText(booking.serviceStatus)}</p>
                  <p className="text-xs text-slate-500">Service Status</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {booking.serviceType && (
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    booking.serviceType === 'local' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'
                  }`}>
                    {booking.serviceType === 'local' ? '🏙️ Local' : '⭐ Special'}
                  </span>
                )}
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
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
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-green-500" />
                <span className="text-slate-600">From:</span>
                <span className="font-medium">{booking.pickup}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-red-500" />
                <span className="text-slate-600">To:</span>
                <span className="font-medium">{booking.destination}</span>
              </div>
              <div className="flex items-center gap-4 text-slate-600">
                <span className="flex items-center gap-1">
                  <Calendar size={14} /> {booking.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={14} /> {booking.time}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard size={16} className="text-blue-500" />
                <span className="text-slate-600">Payment:</span>
                <span className={`font-medium ${
                  booking.paymentMethod === 'online' ? 'text-blue-600' : 'text-green-600'
                }`}>
                  {booking.paymentMethod === 'online' ? '💳 Online' : '💵 Cash'}
                </span>
              </div>
            </div>

            {booking.driverName && (
              <div className="mt-4 bg-purple-50 p-3 rounded-xl border border-purple-200">
                <p className="text-xs text-purple-600 font-semibold mb-2 flex items-center gap-1">
                  <UserIcon size={14} /> Driver Information
                </p>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-800">{booking.driverName}</p>
                  <a href={`tel:${booking.driverPhone}`} className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1">
                    <Phone size={14} /> {booking.driverPhone}
                  </a>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default MyBookings;
