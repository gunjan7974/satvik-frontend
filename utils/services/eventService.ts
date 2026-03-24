// import { api } from '../api';

// export const eventService = {
//   getAllEvents: async () => {
//     const response = await api.get('/events');
//     return response.data;
//   },

//   getEventById: async (id: string) => {
//     const response = await api.get(`/events/${id}`);
//     return response.data;
//   },

//   createBooking: async (bookingData: any) => {
//     const response = await api.post('/events/booking', bookingData);
//     return response.data;
//   },

//   updateBooking: async (id: string, updateData: any) => {
//     const response = await api.put(`/events/booking/${id}`, updateData);
//     return response.data;
//   }
// };