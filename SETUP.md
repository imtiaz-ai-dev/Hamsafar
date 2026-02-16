# Hamsafar Cab Service - Setup Guide

## Features Implemented ✅

1. **Simple Login** - Sirf name aur phone number (no verification)
2. **Admin Panel** - Admin login: phone `03001234567`, name `admin`
3. **Full Mobile Responsive** - All screens optimized for mobile
4. **Google Maps Integration** - Real location search with autocomplete
5. **48 Hour Restriction** - Booking sirf 48 hours ke baad ki date ke liye
6. **Receipt System** - Booking confirmation receipt with all details
7. **Vehicle Types** - Bike, Car, Van, Hiace, Coaster options
8. **Service Status** - Available, Pending, Not Available tracking
9. **WhatsApp Group Link** - Direct link to group: https://chat.whatsapp.com/D4vGHSI5EXgB679we7HWw8

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Google Maps API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Maps JavaScript API** and **Places API**
4. Create API Key (Credentials → Create Credentials → API Key)
5. Restrict your API key:
   - Application restrictions: HTTP referrers
   - API restrictions: Maps JavaScript API, Places API

### 3. Add API Key

Open `index.html` and replace `YOUR_GOOGLE_MAPS_API_KEY` with your actual API key:

```html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_ACTUAL_API_KEY&libraries=places"></script>
```

### 4. Setup Gemini API

1. Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Open `.env.local` file
3. Add your key:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

### 5. Run the App

```bash
npm run dev
```

## How to Use

### For Customers:
1. Login with your name and phone number
2. Select vehicle type (Bike, Car, Van, Hiace, Coaster)
3. Enter pickup and destination (use autocomplete)
4. Select date (minimum 48 hours from now)
5. Choose seats and time
6. Click "Send to WhatsApp Group"
7. View your booking receipt
8. Message will be sent to WhatsApp group automatically

### For Admin:
1. Login with:
   - Phone: `03001234567`
   - Name: `admin`
2. View all bookings with complete details
3. Update service status (Available/Pending/Not Available)
4. Confirm or cancel bookings
5. Delete bookings
6. See vehicle types and passenger counts

## Features Details

### Vehicle Types
- 🏍️ **Bike** - For 1-2 passengers
- 🚗 **Car** - For 1-4 passengers
- 🚐 **Van** - For 5-8 passengers
- 🚌 **Hiace** - For 10-15 passengers
- 🚍 **Coaster** - For 20-50 passengers

### Service Status
- **⏳ Pending** - Waiting for driver confirmation
- **✓ Available** - Driver confirmed and available
- **✗ Not Available** - No drivers available for this route

### Receipt System
- Automatic receipt generation after booking
- Shows all booking details
- Displays service status
- Includes booking ID for reference
- Mobile-friendly modal design

### WhatsApp Integration
- Direct link to group: https://chat.whatsapp.com/D4vGHSI5EXgB679we7HWw8
- Pre-filled message with booking details
- Opens in new tab
- Works on mobile and desktop

### 48-Hour Restriction
- Users cannot book rides less than 48 hours in advance
- Date picker automatically sets minimum date
- Validation on form submission

### Google Maps Autocomplete
- Real-time location search
- Pakistan locations prioritized
- Formatted addresses saved

### Mobile Responsive
- Optimized for all screen sizes
- Touch-friendly buttons
- Responsive grid layouts
- Mobile-first design

### Admin Panel
- View all bookings
- Update booking status
- Delete bookings
- Mobile responsive table

## Storage

All bookings are stored in browser's localStorage:
- Key: `hamsafar_bookings`
- Format: JSON array of booking objects

## Notes

- No backend required - everything runs in browser
- Data persists in localStorage
- Admin credentials are hardcoded (change in production)
- Google Maps API key should be restricted in production

## Support

For issues or questions, contact support.
