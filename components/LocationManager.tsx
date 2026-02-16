import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Trash2 } from 'lucide-react';

interface Location {
  id: string;
  name: string;
  createdAt: string;
}

const LocationManager: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [newLocation, setNewLocation] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('hamsafar_locations');
    if (saved) {
      setLocations(JSON.parse(saved));
    }
  }, []);

  const addLocation = () => {
    if (!newLocation.trim()) return;
    
    const location: Location = {
      id: Date.now().toString(),
      name: newLocation.trim(),
      createdAt: new Date().toISOString()
    };
    
    const updated = [...locations, location];
    setLocations(updated);
    localStorage.setItem('hamsafar_locations', JSON.stringify(updated));
    setNewLocation('');
  };

  const deleteLocation = (id: string) => {
    const updated = locations.filter(l => l.id !== id);
    setLocations(updated);
    localStorage.setItem('hamsafar_locations', JSON.stringify(updated));
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-green-100 p-3 rounded-2xl text-green-600">
          <MapPin size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Manage Locations</h2>
          <p className="text-slate-500 text-sm">Add locations for users to select</p>
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Enter location name..."
          value={newLocation}
          onChange={(e) => setNewLocation(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addLocation()}
          className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
        />
        <button
          onClick={addLocation}
          className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 flex items-center gap-2 font-semibold"
        >
          <Plus size={20} /> Add
        </button>
      </div>

      <div className="space-y-2">
        {locations.length === 0 ? (
          <p className="text-center text-slate-400 py-8">No locations added yet</p>
        ) : (
          locations.map((location) => (
            <div key={location.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100">
              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-green-600" />
                <span className="font-medium text-slate-700">{location.name}</span>
              </div>
              <button
                onClick={() => deleteLocation(location.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LocationManager;
