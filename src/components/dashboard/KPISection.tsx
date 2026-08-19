
import StatCard from "@/components/cards/StatCard";
import type { Booking } from "@/types/booking";

type KPISectionProps = {
  bookings: Booking[];
};

export default function KPISection({ bookings }: KPISectionProps) {
  const totalBookings = bookings.length;

  const totalRevenue = bookings.reduce(
    (sum, booking) => sum + booking.estimatedRevenue,
    0
  );

  const averageBookingValue =
    totalBookings > 0 ? totalRevenue / totalBookings : 0;

  const topBooking = bookings.reduce<Booking | null>((top, booking) => {
    if (!top || booking.estimatedRevenue > top.estimatedRevenue) {
      return booking;
    }

    return top;
  }, null);

  return (
    <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Estimated Revenue"
        value={`$${totalRevenue.toLocaleString()}`}
        subtitle="From agent-booked appointments"
      />

      <StatCard
        title="Appointments Booked"
        value={totalBookings.toString()}
        subtitle="Successful Trillet bookings"
      />

      <StatCard
        title="Average Booking Value"
        value={`$${averageBookingValue.toFixed(2)}`}
        subtitle="Average estimated revenue"
      />

      <StatCard
        title="Highest-Value Booking"
        value={topBooking?.appointmentType ?? "No bookings"}
        subtitle={
          topBooking
            ? `$${topBooking.estimatedRevenue.toLocaleString()}`
            : undefined
        }
      />
    </section>
  );
}