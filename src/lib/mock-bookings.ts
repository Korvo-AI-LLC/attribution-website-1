import type { Booking } from "@/types/booking";

export const mockBookings: Booking[] = [
  {
    id: 1,
    appointmentType: "New Patient",
    estimatedRevenue: 175,
    bookedDate: "2026-08-01",
    bookedTime: "9:00 AM",
  },
  {
    id: 2,
    appointmentType: "Established Patient",
    estimatedRevenue: 100,
    bookedDate: "2026-08-02",
    bookedTime: "10:30 AM",
  },
  {
    id: 3,
    appointmentType: "Ingrown Toenail",
    estimatedRevenue: 425,
    bookedDate: "2026-08-03",
    bookedTime: "11:00 AM",
  },
  {
    id: 4,
    appointmentType: "New Patient",
    estimatedRevenue: 175,
    bookedDate: "2026-08-04",
    bookedTime: "1:30 PM",
  },
  {
    id: 5,
    appointmentType: "Orthotics",
    estimatedRevenue: 115,
    bookedDate: "2026-08-05",
    bookedTime: "2:15 PM",
  },
  {
    id: 6,
    appointmentType: "Established Patient",
    estimatedRevenue: 100,
    bookedDate: "2026-08-05",
    bookedTime: "3:00 PM",
  },
  {
    id: 7,
    appointmentType: "Pre-Surgical",
    estimatedRevenue: 115,
    bookedDate: "2026-08-06",
    bookedTime: "4:00 PM",
  },
];