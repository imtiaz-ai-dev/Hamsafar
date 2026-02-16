import React, { useState, useEffect } from 'react';
import { User } from './types';
import Auth from './components/Auth';
import BookingForm from './components/BookingForm';
import AdminPanel from './components/AdminPanel';
import RouteManager from './components/RouteManager';
import MyBookings from './components/MyBookings';
import { Car, MapPin, History, LogOut, ShieldCheck, LayoutDashboard, Globe } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'booking' | 'history' | 'routes'>('booking');
  const [lang, setLang] = useState<'en' | 'ur'>('en');

  const t = {
    en: {
      welcome: 'Safar ho asaan, Hamsafar ke sath!',
      subtitle: 'Book your next ride in seconds',
      newBooking: 'New Booking',
      myBookings: 'My Bookings',
      routes: 'Routes',
      bookings: 'Bookings',
      logout: 'Logout',
      howItWorks: 'How it works',
      needHelp: 'Need Help?',
      support247: '24/7 support available',
      contactSupport: 'Contact Support'
    },
    ur: {
      welcome: 'سفر ہو آسان، ہمسفر کے ساتھ!',
      subtitle: 'اپنی اگلی سواری سیکنڈوں میں بک کریں',
      newBooking: 'نئی بکنگ',
      myBookings: 'میری بکنگز',
      routes: 'راستے',
      bookings: 'بکنگز',
      logout: 'لاگ آؤٹ',
      howItWorks: 'کیسے کام کرتا ہے',
      needHelp: 'مدد چاہیے؟',
      support247: '24/7 سپورٹ دستیاب',
      contactSupport: 'سپورٹ سے رابطہ کریں'
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('hamsafar_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('hamsafar_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('hamsafar_user');
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  // Admin View
  if (user.role === 'admin') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <header className="bg-white border-b border-slate-100 sticky top-0 z-50 px-4 sm:px-6 lg:px-8 py-4 shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-xl text-white">
                <LayoutDashboard size={20} className="sm:w-6 sm:h-6" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-slate-800">Admin Panel</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setLang(lang === 'en' ? 'ur' : 'en')} className="p-2 hover:bg-slate-100 rounded-xl">
                <Globe size={18} />
              </button>
              <button onClick={handleLogout} className="p-2 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                <LogOut size={18} className="sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
          <div className="max-w-7xl mx-auto flex gap-2 mt-4">
            <button onClick={() => setView('routes')} className={`px-4 py-2 rounded-xl text-sm font-medium ${view === 'routes' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
              {t[lang].routes}
            </button>
            <button onClick={() => setView('booking')} className={`px-4 py-2 rounded-xl text-sm font-medium ${view === 'booking' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
              {t[lang].bookings}
            </button>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {view === 'routes' ? <RouteManager /> : <AdminPanel />}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-xl text-white">
              <Car size={20} className="sm:w-6 sm:h-6" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-slate-800">Hamsafar</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button onClick={() => setLang(lang === 'en' ? 'ur' : 'en')} className="p-2 hover:bg-slate-100 rounded-xl" title="Change Language">
              <Globe size={18} className="sm:w-5 sm:h-5" />
            </button>
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-sm font-bold text-slate-700">{user.name}</span>
              <span className="text-xs text-slate-500">{user.phone}</span>
            </div>
            <button onClick={handleLogout} className="p-2 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors" title={t[lang].logout}>
              <LogOut size={18} className="sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto flex gap-2 mt-3">
          <button onClick={() => setView('booking')} className={`px-4 py-2 rounded-xl text-sm font-medium ${view === 'booking' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
            {t[lang].newBooking}
          </button>
          <button onClick={() => setView('history')} className={`px-4 py-2 rounded-xl text-sm font-medium ${view === 'history' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
            {t[lang].myBookings}
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-6 sm:gap-8">
          <div className="relative overflow-hidden bg-slate-900 rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-8 lg:p-12 text-white">
            <div className="relative z-10 max-w-lg">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-3 sm:mb-4" style={lang === 'ur' ? {direction: 'rtl'} : {}}>
                {t[lang].welcome} 🌟
              </h1>
              <p className="text-slate-300 text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 leading-relaxed" style={lang === 'ur' ? {direction: 'rtl'} : {}}>
                {t[lang].subtitle}
              </p>
              <div className="flex flex-wrap gap-2 sm:gap-4">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/10 text-xs sm:text-sm">
                  <ShieldCheck size={14} className="sm:w-4 sm:h-4 text-blue-400" /> Trusted Drivers
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/10 text-xs sm:text-sm">
                  <MapPin size={14} className="sm:w-4 sm:h-4 text-green-400" /> Verified Routes
                </div>
              </div>
            </div>
            <div className="absolute right-[-10%] bottom-[-20%] opacity-20 pointer-events-none transform rotate-12 hidden lg:block">
              <Car size={300} strokeWidth={1} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
            <div className="lg:col-span-8">
              {view === 'booking' ? (
                <BookingForm user={user} lang={lang} onBookingComplete={() => {
                  alert(lang === 'en' ? "Request sent to WhatsApp!" : "درخواست واٹس ایپ پر بھیج دی گئی!");
                }} />
              ) : (
                <MyBookings user={user} />
              )}
            </div>
            
            <div className="lg:col-span-4 space-y-4 sm:space-y-6">
              <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-xl shadow-slate-200/50">
                <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-3 sm:mb-4 flex items-center gap-2">
                  <History size={18} className="sm:w-5 sm:h-5 text-blue-500" /> {t[lang].howItWorks}
                </h3>
                <ol className="space-y-3 sm:space-y-4">
                  {[
                    "Fill in your trip details.",
                    "Review the AI message.",
                    "Send to WhatsApp.",
                    "Drivers will respond."
                  ].map((step, i) => (
                    <li key={i} className="flex gap-2 sm:gap-3">
                      <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                        {i + 1}
                      </span>
                      <p className="text-xs sm:text-sm text-slate-600 leading-tight">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-white shadow-xl shadow-blue-200">
                <h3 className="text-base sm:text-lg font-bold mb-2">{t[lang].needHelp}</h3>
                <p className="text-blue-100 text-xs sm:text-sm mb-3 sm:mb-4 leading-snug">
                  {t[lang].support247}
                </p>
                <button className="w-full bg-white text-blue-700 py-2 sm:py-3 rounded-xl font-bold text-xs sm:text-sm hover:bg-blue-50 transition-colors">
                  {t[lang].contactSupport}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-auto py-6 sm:py-8 px-4 text-center text-slate-400 text-xs sm:text-sm border-t border-slate-100 bg-white">
        <p>© {new Date().getFullYear()} Hamsafar Cab Service. All rights reserved.</p>
        <p className="mt-1">Powered by Gemini AI</p>
      </footer>
    </div>
  );
};

export default App;
