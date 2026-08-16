import RevenueByTypeChart from "@/components/charts/RevenueByTypeChart";
import RevenueTrendChart from "@/components/charts/RevenueTrendChart";
import KPISection from "@/components/dashboard/KPISection";
import RecentBookings from "@/components/dashboard/RecentBookings";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { supabase } from "@/lib/supabase";
import type { Booking } from "@/types/booking";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { data, error } = await supabase
    .from("booked_appointments")
    .select(
      "id, patient_name, appointment_type, estimated_revenue, booked_datetime, booking_status"
    )
    .eq("booking_status", "booked")
    .order("booked_datetime", { ascending: false });

  if (error) {
    console.error("Failed to load bookings:", error.message);
  }

const bookings: Booking[] = (data ?? []).map((row) => {
  const date = new Date(row.booked_datetime);

  return {
    id: row.id,
    patientName: row.patient_name ?? "Not provided",
    appointmentType: row.appointment_type,
    estimatedRevenue: Number(row.estimated_revenue),

    bookedDate: new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Los_Angeles",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date),

    bookedTime: new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Los_Angeles",
      hour: "numeric",
      minute: "2-digit",
    }).format(date),
  };
});

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="min-w-0 flex-1">
          <Header />

          <div className="space-y-8 p-6 md:p-8">
            <KPISection bookings={bookings} />

            <div className="grid gap-8 xl:grid-cols-2">
              <RevenueTrendChart bookings={bookings} />
              <RevenueByTypeChart bookings={bookings} />
            </div>

            <RecentBookings bookings={bookings} />
          </div>
        </div>
      </div>
    </main>
  );
}