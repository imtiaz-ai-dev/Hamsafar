
import { GoogleGenAI, Type } from "@google/genai";
import { Booking, User } from "../types";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

export const optimizeBookingMessage = async (booking: Booking, user: User): Promise<string> => {
  if (!ai) {
    return `*🚕 New Ride Request!*\n\n*Customer:* ${user.name}\n*Phone:* ${user.phone}\n*From:* ${booking.pickup}\n*To:* ${booking.destination}\n*Seats:* ${booking.seats}\n*Vehicle:* ${booking.vehicleType}\n*When:* ${booking.date} at ${booking.time}\n*Payment:* ${booking.paymentMethod === 'online' ? 'Online' : 'Cash'}\n${booking.notes ? `\n*Notes:* ${booking.notes}` : ''}\n\nDrivers please reply if available!`;
  }
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a professional and clear WhatsApp booking message for a cab driver group.
      Details:
      - Customer: ${user.name} (${user.phone})
      - From: ${booking.pickup}
      - To: ${booking.destination}
      - Seats Required: ${booking.seats}
      - Date: ${booking.date}
      - Time: ${booking.time}
      - Additional Notes: ${booking.notes || 'None'}

      Make it punchy, using emojis for clarity. Ensure the pickup and destination are very prominent. Use Urdu and English mixed (Roman Urdu) for better local driver understanding if appropriate.`,
    });
    return response.text || "";
  } catch (error) {
    console.error("Gemini Error:", error);
    // Fallback template
    return `*🚕 New Ride Request!*\n\n*Customer:* ${user.name}\n*From:* ${booking.pickup}\n*To:* ${booking.destination}\n*Seats:* ${booking.seats}\n*When:* ${booking.date} at ${booking.time}\n\nDrivers please reply if available!`;
  }
};

export const getTravelTips = async (from: string, to: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide 2-3 short, helpful travel tips or estimated travel duration for a trip from ${from} to ${to} in the context of Pakistan/local travel. Keep it very brief.`,
    });
    return response.text || "";
  } catch {
    return "";
  }
};
