
import React, { useState, useEffect, useRef } from 'react';
import Input from './Input';
import Button from './Button';
import Receipt from './Receipt';
import { User, Booking } from '../types';
import { optimizeBookingMessage, getTravelTips } from '../services/geminiService';
import { MapPin, Users, Calendar, Clock, Send, MessageSquareText, AlertCircle, Car } from 'lucide-react';

interface BookingFormProps {
  user: User;
  lang: 'en' | 'ur';
  onBookingComplete: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ user, lang, onBookingComplete }) => {
  const pickupRef = useRef<HTMLInputElement>(null);
  const destRef = useRef<HTMLInputElement>(null);
  
  const getMinDate = () => {
    const date = new Date();
    date.setHours(date.getHours() + 48);
    return date.toISOString().split('T')[0];
  };
  
  const [booking, setBooking] = useState<Booking>({
    pickup: '',
    destination: '',
    seats: 1,
    date: getMinDate(),
    time: '09:00',
    vehicleType: 'car',
    paymentMethod: 'physical',
    notes: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [tips, setTips] = useState<string>('');
  const [showReceipt, setShowReceipt] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
  const [showUrgentSlots, setShowUrgentSlots] = useState(false);
  const [serviceStatus, setServiceStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');

  useEffect(() => {
    const checkAvailability = () => {
      const hour = new Date().getHours();
      setServiceStatus(hour >= 6 && hour < 23 ? 'available' : 'unavailable');
    };
    checkAvailability();
    const interval = setInterval(checkAvailability, 60000);
    return () => clearInterval(interval);
  }, []);

  // Generate urgent time slots (within 48 hours)
  const getUrgentTimeSlots = () => {
    const slots = [];
    const now = new Date();
    
    for (let i = 1; i <= 48; i += 3) { // Every 3 hours
      const slotTime = new Date(now.getTime() + i * 60 * 60 * 1000);
      slots.push({
        date: slotTime.toISOString().split('T')[0],
        time: slotTime.toTimeString().slice(0, 5),
        label: `${slotTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at ${slotTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
      });
    }
    return slots;
  };

  useEffect(() => {
    // Google Maps Autocomplete (optional)
    if (typeof window !== 'undefined' && window.google && window.google.maps && window.google.maps.places) {
      try {
        const pickupAutocomplete = new google.maps.places.Autocomplete(pickupRef.current!, {
          componentRestrictions: { country: 'pk' }
        });
        const destAutocomplete = new google.maps.places.Autocomplete(destRef.current!, {
          componentRestrictions: { country: 'pk' }
        });
        
        pickupAutocomplete.addListener('place_changed', () => {
          const place = pickupAutocomplete.getPlace();
          if (place.formatted_address) {
            setBooking(prev => ({ ...prev, pickup: place.formatted_address! }));
          }
        });
        
        destAutocomplete.addListener('place_changed', () => {
          const place = destAutocomplete.getPlace();
          if (place.formatted_address) {
            setBooking(prev => ({ ...prev, destination: place.formatted_address! }));
          }
        });
      } catch (error) {
        console.log('Google Maps not loaded, using regular input');
      }
    }
  }, []);

  useEffect(() => {
    if (booking.pickup.length > 3 && booking.destination.length > 3) {
      const timer = setTimeout(async () => {
        const result = await getTravelTips(booking.pickup, booking.destination);
        setTips(result);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [booking.pickup, booking.destination]);

  const handleSubmitBooking = async () => {
    if (!booking.pickup || !booking.destination) {
      alert("براہ کرم pickup اور destination درج کریں");
      return;
    }

    if (serviceStatus === 'unavailable') {
      alert("معذرت! اس وقت کوئی ڈرائیور دستیاب نہیں ہے۔ براہ کرم بعد میں کوشش کریں۔");
      return;
    }

    const selectedDate = new Date(booking.date + 'T' + booking.time);
    const minDate = new Date();
    minDate.setHours(minDate.getHours() + 48);
    
    if (selectedDate < minDate) {
      setShowUrgentSlots(true);
      return;
    }

    setIsLoading(true);
    try {
      const bookingData: Booking = {
        ...booking,
        id: Math.random().toString(36).substr(2, 9),
        userId: user.id,
        userName: user.name,
        userPhone: user.phone,
        status: 'pending',
        serviceStatus: 'pending',
        rideStatus: 'pending',
        createdAt: new Date().toISOString()
      };
      
      const saved = localStorage.getItem('hamsafar_bookings');
      const bookings = saved ? JSON.parse(saved) : [];
      bookings.push(bookingData);
      localStorage.setItem('hamsafar_bookings', JSON.stringify(bookings));
      
      setCurrentBooking(bookingData);
      setShowReceipt(true);
      
      const message = await optimizeBookingMessage(booking, user);
      const encodedMessage = encodeURIComponent(message);
      const whatsappGroupLink = 'https://chat.whatsapp.com/D4vGHSI5EXgB679we7HWw8';
      window.open(`${whatsappGroupLink}?text=${encodedMessage}`, '_blank');
      
      alert("✅ آپ کی بکنگ کامیابی سے جمع ہو گئی! ہمارا ٹیم جلد آپ سے رابطہ کرے گا۔");
      onBookingComplete();
    } catch (error) {
      alert("کچھ غلط ہو گیا۔ براہ کرم دوبارہ کوشش کریں۔");
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setBooking(prev => ({ ...prev, pickup: `Location: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}` }));
      });
    }
  };

  return (
    <>
      {showReceipt && currentBooking && (
        <Receipt booking={currentBooking} onClose={() => setShowReceipt(false)} />
      )}

      {showUrgentSlots && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-800">⚡ Urgent Booking</h3>
              <button onClick={() => setShowUrgentSlots(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>
            <p className="text-sm text-slate-600 mb-4">
              Bookings within 48 hours require special approval. Select a time slot:
            </p>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {getUrgentTimeSlots().map((slot, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setBooking({ ...booking, date: slot.date, time: slot.time });
                    setShowUrgentSlots(false);
                  }}
                  className="w-full text-left p-3 rounded-xl border-2 border-slate-200 hover:border-orange-500 hover:bg-orange-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-800">{slot.label}</span>
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-semibold">
                      Urgent
                    </span>
                  </div>
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-4 text-center">
              Note: Urgent bookings may have limited driver availability
            </p>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl shadow-slate-200 w-full border border-slate-100">
      <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="bg-blue-100 p-2 sm:p-3 rounded-xl sm:rounded-2xl text-blue-600">
          <Send size={20} className="sm:w-6 sm:h-6" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800">New Booking</h2>
          <p className="text-slate-500 text-sm">Enter your trip details</p>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 p-3 sm:p-4 rounded-xl sm:rounded-2xl mb-6 flex gap-2 sm:gap-3">
        <AlertCircle size={18} className="text-yellow-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-xs sm:text-sm text-yellow-800">
            <strong>Note:</strong> Bookings within 48 hours require urgent approval.
          </p>
          <button 
            onClick={() => setShowUrgentSlots(true)}
            className="text-xs text-orange-600 font-semibold underline mt-1 hover:text-orange-700"
          >
            View urgent time slots →
          </button>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="text-sm font-semibold text-slate-600 ml-1 mb-1.5 block">Pickup Location</label>
            <input
              ref={pickupRef}
              type="text"
              placeholder="Search location..."
              value={booking.pickup}
              onChange={(e) => setBooking({...booking, pickup: e.target.value})}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-700"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-600 ml-1 mb-1.5 block">Destination</label>
            <input
              ref={destRef}
              type="text"
              placeholder="Search location..."
              value={booking.destination}
              onChange={(e) => setBooking({...booking, destination: e.target.value})}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-700"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-600 ml-1 flex items-center gap-1">
              <Car size={14} /> Vehicle Type
            </label>
            <select 
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-700"
              value={booking.vehicleType}
              onChange={(e) => setBooking({...booking, vehicleType: e.target.value as any})}
            >
              <option value="bike">🏍️ Bike</option>
              <option value="car">🚗 Car</option>
              <option value="van">🚐 Van</option>
              <option value="hiace">🚌 Hiace</option>
              <option value="coaster">🚍 Coaster</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-600 ml-1 flex items-center gap-1">
              <Users size={14} /> Seats
            </label>
            <select 
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-700"
              value={booking.seats}
              onChange={(e) => setBooking({...booking, seats: parseInt(e.target.value)})}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 30, 40, 50].map(n => (
                <option key={n} value={n}>{n} Seat{n > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
          <Input 
            label="Time" 
            type="time" 
            value={booking.time}
            onChange={(e) => setBooking({...booking, time: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <Input 
            label="Date" 
            type="date" 
            min={getMinDate()}
            value={booking.date}
            onChange={(e) => setBooking({...booking, date: e.target.value})}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-600 ml-1">💳 Payment Method</label>
            <select 
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-700"
              value={booking.paymentMethod}
              onChange={(e) => setBooking({...booking, paymentMethod: e.target.value as any})}
            >
              <option value="physical">💵 Physical (Cash)</option>
              <option value="online">💳 Online Payment</option>
            </select>
          </div>
        </div>

        <Input 
          label="Additional Requirements (Optional)" 
          placeholder="AC needed? Luggage?" 
          value={booking.notes}
          onChange={(e) => setBooking({...booking, notes: e.target.value})}
        />

        <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl text-sm text-blue-800">
          <strong>Payment Info:</strong> {booking.paymentMethod === 'online' ? 'WhatsApp pe account details send honge' : 'Driver ko cash payment karein'}
        </div>

        {tips && (
          <div className="bg-blue-50 border border-blue-100 p-3 sm:p-4 rounded-xl sm:rounded-2xl flex gap-2 sm:gap-3">
            <div className="text-blue-500 mt-1 flex-shrink-0">
              <MessageSquareText size={16} className="sm:w-5 sm:h-5" />
            </div>
            <div className="text-xs sm:text-sm text-blue-800 leading-relaxed italic">
              {tips}
            </div>
          </div>
        )}

        <div className={`p-4 rounded-2xl flex items-center gap-3 ${
          serviceStatus === 'available' 
            ? 'bg-green-50 border border-green-200' 
            : serviceStatus === 'unavailable'
            ? 'bg-red-50 border border-red-200'
            : 'bg-gray-50 border border-gray-200'
        }`}>
          <div className={`w-3 h-3 rounded-full ${
            serviceStatus === 'available' ? 'bg-green-500 animate-pulse' : 
            serviceStatus === 'unavailable' ? 'bg-red-500' : 'bg-gray-400'
          }`} />
          <span className={`text-sm font-semibold ${
            serviceStatus === 'available' ? 'text-green-700' : 
            serviceStatus === 'unavailable' ? 'text-red-700' : 'text-gray-600'
          }`}>
            {serviceStatus === 'available' && '✓ ڈرائیورز دستیاب ہیں'}
            {serviceStatus === 'unavailable' && '✗ اس وقت کوئی ڈرائیور دستیاب نہیں'}
            {serviceStatus === 'checking' && 'چیک کر رہے ہیں...'}
          </span>
        </div>

        <Button 
          variant="success" 
          className="w-full py-3 sm:py-4 text-base sm:text-lg" 
          onClick={handleSubmitBooking}
          isLoading={isLoading}
          disabled={serviceStatus === 'unavailable'}
        >
          <Send size={20} className="mr-2" />
          بکنگ جمع کریں
        </Button>
      </div>
    </div>
    </>
  );
};

export default BookingForm;
