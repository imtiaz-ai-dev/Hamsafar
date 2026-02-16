import React from 'react';
import { Booking } from '../types';
import { CheckCircle, MapPin, Calendar, Clock, Users, Car, Phone, User, X } from 'lucide-react';

interface ReceiptProps {
  booking: Booking;
  onClose: () => void;
}

const Receipt: React.FC<ReceiptProps> = ({ booking, onClose }) => {
  const vehicleIcons: Record<string, string> = {
    bike: '🏍️',
    car: '🚗',
    van: '🚐',
    hiace: '🚌',
    coaster: '🚍'
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle size={32} />
            <div>
              <h2 className="text-2xl font-bold">Booking Confirmed!</h2>
              <p className="text-green-100 text-sm">Receipt #{booking.id?.slice(0, 8).toUpperCase()}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* User Info */}
          <div className="bg-slate-50 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <User size={18} className="text-blue-500" />
              <span className="font-semibold text-slate-800">Passenger Details</span>
            </div>
            <p className="text-slate-700 font-medium">{booking.userName}</p>
            <p className="text-slate-500 text-sm flex items-center gap-1">
              <Phone size={14} /> {booking.userPhone}
            </p>
          </div>

          {/* Trip Details */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-green-500 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-slate-400 uppercase font-semibold">Pickup</p>
                <p className="text-slate-700 font-medium">{booking.pickup}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-red-500 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-slate-400 uppercase font-semibold">Destination</p>
                <p className="text-slate-700 font-medium">{booking.destination}</p>
              </div>
            </div>
          </div>

          {/* Booking Info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 rounded-xl p-3">
              <div className="flex items-center gap-2 text-blue-600 mb-1">
                <Calendar size={16} />
                <span className="text-xs font-semibold">Date</span>
              </div>
              <p className="text-slate-800 font-medium text-sm">{booking.date}</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-3">
              <div className="flex items-center gap-2 text-purple-600 mb-1">
                <Clock size={16} />
                <span className="text-xs font-semibold">Time</span>
              </div>
              <p className="text-slate-800 font-medium text-sm">{booking.time}</p>
            </div>
            <div className="bg-orange-50 rounded-xl p-3">
              <div className="flex items-center gap-2 text-orange-600 mb-1">
                <Users size={16} />
                <span className="text-xs font-semibold">Seats</span>
              </div>
              <p className="text-slate-800 font-medium text-sm">{booking.seats} Seat{booking.seats > 1 ? 's' : ''}</p>
            </div>
            <div className="bg-green-50 rounded-xl p-3">
              <div className="flex items-center gap-2 text-green-600 mb-1">
                <span className="text-lg">{vehicleIcons[booking.vehicleType]}</span>
                <span className="text-xs font-semibold">Vehicle</span>
              </div>
              <p className="text-slate-800 font-medium text-sm capitalize">{booking.vehicleType}</p>
            </div>
          </div>

          {booking.notes && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
              <p className="text-xs text-amber-600 font-semibold mb-1">Special Requirements</p>
              <p className="text-slate-700 text-sm">{booking.notes}</p>
            </div>
          )}

          {/* Status */}
          <div className="border-t border-slate-200 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-600 text-sm">Service Status</span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                booking.serviceStatus === 'available' ? 'bg-green-100 text-green-700' :
                booking.serviceStatus === 'not-available' ? 'bg-red-100 text-red-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {booking.serviceStatus === 'available' ? '✓ Available' :
                 booking.serviceStatus === 'not-available' ? '✗ Not Available' :
                 '⏳ Pending'}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 text-center border-t border-slate-200">
          <p className="text-xs text-slate-500">
            Drivers will contact you on WhatsApp soon
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Booked on {new Date(booking.createdAt!).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
