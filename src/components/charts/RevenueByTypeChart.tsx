"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Booking = {
  id: number;
  appointmentType: string;
  estimatedRevenue: number;
  bookedDate: string;
};

type RevenueByTypeChartProps = {
  bookings: Booking[];
};

export default function RevenueByTypeChart({
  bookings,
}: RevenueByTypeChartProps) {
  const data = bookings.reduce<
    {
      appointmentType: string;
      revenue: number;
      bookings: number;
    }[]
  >((result, booking) => {
    const existingType = result.find(
      (item) => item.appointmentType === booking.appointmentType
    );

    if (existingType) {
      existingType.revenue += booking.estimatedRevenue;
      existingType.bookings += 1;
    } else {
      result.push({
        appointmentType: booking.appointmentType,
        revenue: booking.estimatedRevenue,
        bookings: 1,
      });
    }

    return result;
  }, []);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Revenue by Appointment Type
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Estimated value of each appointment category
        </p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="appointmentType"
              tick={{ fontSize: 12 }}
            />

            <YAxis
              tickFormatter={(value: number) => `$${value}`}
            />

            <Tooltip
              formatter={(value, name) => {
                if (name === "revenue") {
                  return [
                    `$${Number(value).toLocaleString()}`,
                    "Estimated Revenue",
                  ];
                }

                return [value, name];
              }}
            />

            <Bar
              dataKey="revenue"
              fill="currentColor"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}