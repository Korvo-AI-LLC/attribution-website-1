import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getAppointmentValue } from "@/lib/appointment-values";
import { fromZonedTime } from "date-fns-tz";

export async function POST(request: NextRequest) {
  try {
    // 1. Verify webhook secret
    const secret = request.headers.get("x-webhook-secret");

    if (secret !== process.env.TRILLET_WEBHOOK_SECRET) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Read Trillet's native webhook payload
    const payload = await request.json();

    // 3. Get the Trillet call ID
    const callId = payload.call_metadata?.callId;

    // 4. Get tool calls made during the conversation
    const toolCalls = payload.analytics?.tool_calls ?? [];

    // 5. Find a Google Calendar booking that actually succeeded
    const successfulBooking = toolCalls.find(
      (tool: any) =>
        tool.name === "google_book_event" &&
        typeof tool.output === "string" &&
        tool.output.toLowerCase().includes("booked successfully")
    );

    // Ignore calls where no appointment was successfully booked
    if (!callId || !successfulBooking) {
      return NextResponse.json({
        success: true,
        ignored: true,
        reason: "No successful appointment booking found",
      });
    }

    // 6. Parse arguments sent to Google Calendar
    let bookingArgs: any = {};

    try {
      bookingArgs = JSON.parse(successfulBooking.arguments || "{}");
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Unable to parse booking arguments",
        },
        { status: 400 }
      );
    }

    const rawStartTime = bookingArgs.start_time;
    const summary = bookingArgs.summary || "";

    // 7. Convert timezone-less Trillet/Google time
    // from Pacific local time into a proper UTC timestamp.
    let bookedDatetime: string | null = null;

    if (rawStartTime) {
      const hasTimezone =
        rawStartTime.endsWith("Z") ||
        /[+-]\d{2}:\d{2}$/.test(rawStartTime);

      if (hasTimezone) {
        // Already contains timezone information
        bookedDatetime = new Date(rawStartTime).toISOString();
      } else {
        // Trillet/Google sends local clinic time without timezone.
        // Interpret it as America/Los_Angeles.
        bookedDatetime = fromZonedTime(
          rawStartTime,
          "America/Los_Angeles"
        ).toISOString();
      }
    }

    // 8. Extract patient name from calendar summary
    const patientMatch = summary.match(/Patient:\s*([^|]+)/i);

    const patientName =
      patientMatch?.[1]?.trim() || null;

    // 9. Extract appointment type from calendar summary
    const typeMatch = summary.match(/Type:\s*([^|]+)/i);

    const appointmentType =
      typeMatch?.[1]?.trim();

    // Make sure required booking values exist
    if (!appointmentType || !bookedDatetime) {
      return NextResponse.json({
        success: true,
        ignored: true,
        reason: "Booking information was incomplete",
      });
    }

    // 10. Calculate estimated revenue
    const estimatedRevenue =
      getAppointmentValue(appointmentType);

    // 11. Save booking into Supabase
    const { data, error } = await supabaseAdmin
      .from("booked_appointments")
      .upsert(
        {
          external_call_id: callId,
          patient_name: patientName,
          appointment_type: appointmentType,
          estimated_revenue: estimatedRevenue,
          booked_datetime: bookedDatetime,
          booking_status: "booked",
          source: "trillet",
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "external_call_id",
        }
      )
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);

      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    // 12. Successful booking stored
    return NextResponse.json({
      success: true,
      booking: data,
    });

  } catch (error) {
    console.error("Webhook error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Invalid request",
      },
      { status: 400 }
    );
  }
}