
export interface User {
  id: string;
  name: string;
  phone: string;
  role: 'customer' | 'admin';
}

export interface Route {
  id: string;
  from: string;
  to: string;
  serviceType: 'local' | 'special';
  isActive: boolean;
  createdAt: string;
}

export interface Booking {
  id?: string;
  userId?: string;
  userName?: string;
  userPhone?: string;
  pickup: string;
  destination: string;
  seats: number;
  date: string;
  time: string;
  vehicleType: 'bike' | 'car' | 'van' | 'hiace' | 'coaster';
  notes?: string;
  status?: 'pending' | 'confirmed' | 'cancelled';
  serviceStatus?: 'available' | 'pending' | 'not-available';
  serviceType?: 'local' | 'special';
  paymentMethod?: 'online' | 'physical';
  driverName?: string;
  driverPhone?: string;
  rideStatus?: 'pending' | 'driver-assigned' | 'on-the-way' | 'completed';
  createdAt?: string;
}

export interface AppState {
  user: User | null;
  currentBooking: Booking | null;
}
