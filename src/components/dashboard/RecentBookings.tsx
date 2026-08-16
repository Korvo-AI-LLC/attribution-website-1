import type { Booking } from "@/types/booking";

type RecentBookingsProps = {
  bookings: Booking[];
};

export default function RecentBookings({
  bookings,
}: RecentBookingsProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-5">
        <h2 className="text-lg font-semibold text-slate-900">
          Recent Bookings
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-sm text-slate-500">
            <tr>
              <th className="px-6 py-4 font-medium">
                Patient Name
              </th>

              <th className="px-6 py-4 font-medium">
                Appointment Type
              </th>

              <th className="px-6 py-4 font-medium">
                Booked Date
              </th>

              <th className="px-6 py-4 font-medium">
                Booked Time
              </th>

              <th className="px-6 py-4 font-medium">
                Estimated Revenue
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200">
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td className="px-6 py-4 font-medium text-slate-900">
                  {booking.patientName}
                </td>

                <td className="px-6 py-4 font-medium text-slate-900">
                  {booking.appointmentType}
                </td>

                <td className="px-6 py-4 text-slate-600">
                  {booking.bookedDate}
                </td>

                <td className="px-6 py-4 text-slate-600">
                  {booking.bookedTime}
                </td>

                <td className="px-6 py-4 font-medium text-slate-900">
                  ${booking.estimatedRevenue.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}