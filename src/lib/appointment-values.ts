export const APPOINTMENT_VALUES: Record<string, number> = {
  "New Patient": 175,
  "Established Patient": 100,
  "Ingrown Toenail": 425,
  "Orthotics": 115,
  "Pre-Surgical": 115,
  "Post-Op": 115,
};

export function getAppointmentValue(type: string): number {
  return APPOINTMENT_VALUES[type] ?? 115;
}