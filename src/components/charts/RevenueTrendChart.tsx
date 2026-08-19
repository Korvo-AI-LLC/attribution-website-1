"use client";
import type { Booking } from "@/types/booking";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";


type RevenueTrendChartProps = {
  bookings: Booking[];
};

export default function RevenueTrendChart({
  bookings,
}: RevenueTrendChartProps) {
  const data = bookings
    .slice()
    .sort(
      (a, b) =>
        new Date(a.bookedDate).getTime() -
        new Date(b.bookedDate).getTime()
    )
    .reduce<
      {
        date: string;
        revenue: number;
      }[]
    >((result, booking) => {
      const existingDate = result.find(
        (item) => item.date === booking.bookedDate
      );

      if (existingDate) {
        existingDate.revenue += booking.estimatedRevenue;
      } else {
        result.push({
          date: booking.bookedDate,
          revenue: booking.estimatedRevenue,
        });
      }

      return result;
    }, []);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Revenue Trend
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Estimated revenue from successful bookings
        </p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="date"
              tickFormatter={(value: string) =>
                new Intl.DateTimeFormat("en-US", {
                  month: "short",
                  day: "numeric",
                  timeZone: "UTC",
                }).format(new Date(`${value}T00:00:00Z`))
              }
            />

            <YAxis
              tickFormatter={(value: number) => `$${value}`}
            />

            <Tooltip
              formatter={(value) => [
                `$${Number(value).toLocaleString()}`,
                "Estimated Revenue",
              ]}
            />

            <Line
              type="monotone"
              dataKey="revenue"
              stroke="currentColor"
              strokeWidth={3}
              dot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}