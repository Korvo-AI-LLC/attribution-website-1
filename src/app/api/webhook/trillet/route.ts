import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getAppointmentValue } from "@/lib/appointment-values";

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

    const bookedDatetime = bookingArgs.start_time;
    const summary = bookingArgs.summary || "";

    // 7. Extract patient name from calendar summary
    const patientMatch = summary.match(/Patient:\s*([^|]+)/i);

    const patientName =
      patientMatch?.[1]?.trim() || null;

    // 8. Extract appointment type from calendar summary
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

    // 9. Calculate estimated revenue
    const estimatedRevenue =
      getAppointmentValue(appointmentType);

    // 10. Save booking into Supabase
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

    // 11. Successful booking stored
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