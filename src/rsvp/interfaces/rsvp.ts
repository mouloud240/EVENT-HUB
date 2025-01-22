export interface EventRsvpQueryResult {
  event_id: string; // The ID of the event
  capacity: number; // The capacity of the event
  pending_rsvps_count: number; // Count of pending RSVPs
  accepted_rsvps_count: number; // Count of accepted RSVPs
  user_rsvp_count: number; // Count of RSVPs for the specific user
}
