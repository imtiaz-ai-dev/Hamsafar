import React, { useState, useEffect } from 'react';
import { Route } from '../types';
import { MapPin, Plus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

const RouteManager: React.FC = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [newRoute, setNewRoute] = useState({ from: '', to: '', serviceType: 'local' as 'local' | 'special' });

  useEffect(() => {
    const saved = localStorage.getItem('hamsafar_routes');
    if (saved) setRoutes(JSON.parse(saved));
  }, []);

  const addRoute = () => {
    if (!newRoute.from || !newRoute.to) return;
    const route: Route = {
      id: Math.random().toString(36).substr(2, 9),
      from: newRoute.from,
      to: newRoute.to,
      serviceType: newRoute.serviceType,
      isActive: true,
      createdAt: new Date().toISOString()
    };
    const updated = [...routes, route];
    setRoutes(updated);
    localStorage.setItem('hamsafar_routes', JSON.stringify(updated));
    setNewRoute({ from: '', to: '', serviceType: 'local' });
  };

  const toggleRoute = (id: string) => {
    const updated = routes.map(r => r.id === id ? { ...r, isActive: !r.isActive } : r);
    setRoutes(updated);
    localStorage.setItem('hamsafar_routes', JSON.stringify(updated));
  };

  const deleteRoute = (id: string) => {
    if (confirm('Delete this route?')) {
      const updated = routes.filter(r => r.id !== id);
      setRoutes(updated);
      localStorage.setItem('hamsafar_routes', JSON.stringify(updated));
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
      <h2 className="text-xl font-bold text-slate-800 mb-4">Manage Routes</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-6">
        <input
          placeholder="From (e.g., Karachi)"
          value={newRoute.from}
          onChange={e => setNewRoute({...newRoute, from: e.target.value})}
          className="px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          placeholder="To (e.g., Lahore)"
          value={newRoute.to}
          onChange={e => setNewRoute({...newRoute, to: e.target.value})}
          className="px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={newRoute.serviceType}
          onChange={e => setNewRoute({...newRoute, serviceType: e.target.value as any})}
          className="px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="local">🏙️ Local</option>
          <option value="special">⭐ Special</option>
        </select>
        <button onClick={addRoute} className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 flex items-center justify-center gap-2">
          <Plus size={18} /> Add
        </button>
      </div>

      <div className="space-y-2">
        {routes.map(route => (
          <div key={route.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-3">
              <MapPin size={16} className="text-blue-500" />
              <span className="font-medium">{route.from} → {route.to}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${route.serviceType === 'local' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>
                {route.serviceType === 'local' ? '🏙️ Local' : '⭐ Special'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => toggleRoute(route.id)} className="p-2 hover:bg-slate-200 rounded-lg">
                {route.isActive ? <ToggleRight size={20} className="text-green-500" /> : <ToggleLeft size={20} className="text-slate-400" />}
              </button>
              <button onClick={() => deleteRoute(route.id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RouteManager;
