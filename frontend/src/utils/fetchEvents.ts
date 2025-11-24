export interface LiveEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  image_url: string;
  event_date: string;
  external_link: string;
  event_type: string;
  points_reward: number;
  current_participants: number;
  max_participants: number;
}

// Sources: Eventbrite + Meetup (Nairobi filtered)
export const fetchNairobiEvents = async (): Promise<LiveEvent[]> => {
  try {
    // EVENTBRITE NAIROBI EVENTS
    const eventbrite = await fetch(
      "https://www.eventbriteapi.com/v3/events/search/?q=nairobi&location.address=nairobi&token=R2L4VWV2XDY3HBFK5TGL",
      { method: "GET" }
    ).then((res) => res.json());

    const ebEvents =
      eventbrite.events?.map((event: any) => ({
        id: event.id,
        title: event.name?.text || "Nairobi Event",
        description: event.description?.text || "",
        location: event.venue?.address?.localized_address_display || "Nairobi, Kenya",
        image_url: event.logo?.url || "/placeholder-event.jpg",
        event_date: event.start?.local || new Date().toISOString(),
        external_link: event.url,
        event_type: "community",
        points_reward: 50,
        current_participants: Math.floor(Math.random() * 100),
        max_participants: 150,
      })) || [];

    // MEETUP NAIROBI EVENTS
    const meetup = await fetch(
      "https://api.meetup.com/find/upcoming_events?&sign=true&lat=-1.286389&lon=36.817223",
      { method: "GET" }
    ).then((res) => res.json());

    const meetupEvents =
      meetup.events?.map((event: any) => ({
        id: event.id,
        title: event.name || "Meetup Event",
        description: event.description || "",
        location: event.venue?.name || "Nairobi",
        image_url: event.featured_photo?.photo_link || "/placeholder-event.jpg",
        event_date: event.local_date || new Date().toISOString(),
        external_link: event.link,
        event_type: "meetup",
        points_reward: 50,
        current_participants: event.yes_rsvp_count || 0,
        max_participants: event.rsvp_limit || 60,
      })) || [];

    return [...ebEvents, ...meetupEvents];
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};
