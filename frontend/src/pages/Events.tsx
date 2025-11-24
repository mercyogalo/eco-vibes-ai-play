import React from "react";

// Sample events data
const events = [
  {
    title: "11th Solarexpo Kenya 2026",
    description:
      "International Trade Exhibition on Solar Products, Equipment & Technology",
  date: "29th – 31st July 2026",
    location: "(KICC), Nairobi, Kenya",
    image: "/images/Solar_africa.jpeg",
    link: "https://www.eventbrite.com/e/11th-solarexpo-kenya-2026-tickets-1812341956579?aff=ebdssbdestsearch",
  },
  {
    title: "9th Africa Agri Expo Kenya",
    description:
      "Unleashing Africa’s agribusiness future: AAE 2026 in Nairobi connects stakeholders, tech & investment for sustainable, large-scale growth.",
    date: "Feb 11 at 9am to Feb 12 at 5pm GMT+3",
    location: "Harambee Avenue",
    image: "/images/Agri_expo.png",
    link: "https://www.eventbrite.com/e/9th-africa-agri-expo-kenya-tickets-1709725197089?aff=ebdssbdestsearch",
  },
  {
    title: "11th LIGHTEXPO KENYA 2026",
    description:
      "International Trade Exhibition on Lighting Products, Equipment & Technology",
    date: "8th – 10th July 2026",
    location: "(KICC), Nairobi, Kenya",
    image: "/images/Light_expo.jpeg",
    link: "https://www.eventbrite.com/e/11th-lightexpo-kenya-2026-tickets-1812471494029?aff=ebdssbdestsearch",
  },
  {
    title: "SPE Africa: GeoThermal Workshop",
    description:
      "This event will serve as a strategic platform for sharing technical insights, fostering partnerships, and accelerating geothermal innovation on the continent.",
    date: "Jul 20 at 8am to Jul 21 at 5pm GMT+3",
    location: "Harry Thuku Road, Nairobi",
    image: "/images/Geothermal_Workshop.jpeg",
    link: "https://www.eventbrite.com/e/spe-africa-geothermal-workshop-tickets-1685446358429?aff=ebdssbdestsearch",
  },
  {
    title: "United Nations Environment Assembly (UNEA-7)",
    description:
      "the world’s highest-level decision-making body on the environment, bringing together governments, civil society, scientists, and the private sector to shape global environmental priorities.",
    date: "December 8, 2025",
    location: "Uhuru Park",
    image: "/images/Unea.jpg",
    link: "https://sustainable.co.ke/events/70ccb4e5a5",
  },
];

export default function EventsPage() {
  return (
    <div className="min-h-screen py-10 px-6 bg-gray-50 dark:bg-black transition-colors">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
          Eco Events
        </h1>
        <p className="text-gray-700 dark:text-gray-300 mb-10">
          Live Nairobi eco & community events. RSVP to attend and support the movement.
        </p>

        {/* Events Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <div
              key={index}
              className="rounded-xl overflow-hidden shadow-md bg-white dark:bg-black border border-gray-200 dark:border-gray-700 transition-all"
            >
              {/* Event Image */}
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-48 object-cover"
              />

              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {event.title}
                </h3>

                <p className="text-gray-700 dark:text-gray-300 mt-2">
                  {event.description}
                </p>

                <p className="text-gray-500 dark:text-gray-400 mt-3 text-sm">
                  📍 {event.location}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  📅 {event.date}
                </p>

                <a
                  href={event.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block w-full text-center bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-medium py-2 rounded-lg transition"
                >
                  RSVP
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { supabase } from "@/integrations/supabase/client";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Calendar, MapPin, Users, Award, Clock, ArrowRight, ExternalLink } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import { format } from "date-fns";
// import { motion } from "framer-motion";

// const Events = () => {
//   const [events, setEvents] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [userId, setUserId] = useState<string | null>(null);
//   const [rsvpStatus, setRsvpStatus] = useState<Record<string, boolean>>({});
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   useEffect(() => {
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       if (!session) {
//         navigate("/auth");
//         return;
//       }
//       setUserId(session.user.id);
//       fetchEvents(session.user.id);
//     });
//   }, [navigate]);

//   const fetchEvents = async (uid: string) => {
//     const { data: eventsData } = await supabase
//       .from("events")
//       .select("*")
//       .order("event_date", { ascending: true });

//     const { data: participantsData } = await supabase
//       .from("event_participants")
//       .select("event_id")
//       .eq("user_id", uid);

//     const rsvpMap: Record<string, boolean> = {};
//     participantsData?.forEach((p) => (rsvpMap[p.event_id] = true));

//     setEvents(eventsData || []);
//     setRsvpStatus(rsvpMap);
//     setLoading(false);
//   };

//   const handleRSVP = async (eventId: string) => {
//     if (!userId) return;

//     try {
//       const { error } = await supabase
//         .from("event_participants")
//         .insert({ event_id: eventId, user_id: userId });

//       if (error) throw error;

//       setRsvpStatus({ ...rsvpStatus, [eventId]: true });
//       toast({ title: "RSVP Confirmed!", description: "You've successfully registered for this event." });
//     } catch (error: any) {
//       toast({ title: "Error", description: error.message, variant: "destructive" });
//     }
//   };

//   const getEventTypeColor = (type: string) => {
//     const colors: Record<string, string> = {
//       tree_planting: "bg-green-500/10 text-green-600 border-green-200",
//       trash_picking: "bg-blue-500/10 text-blue-600 border-blue-200",
//       workshop: "bg-purple-500/10 text-purple-600 border-purple-200",
//       gardening: "bg-orange-500/10 text-orange-600 border-orange-200",
//     };
//     return colors[type] || "bg-muted text-muted-foreground border-border";
//   };

//   if (loading) {
//     return (
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {[1, 2, 3, 4].map((i) => (
//           <div key={i} className="h-64 rounded-xl bg-muted animate-pulse" />
//         ))}
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-8">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
//             <Calendar className="w-8 h-8 text-primary" />
//             Eco Events
//           </h1>
//           <p className="text-muted-foreground">Join real-life eco activities and make a tangible impact.</p>
//         </div>
//       </div>

//       <div className="grid md:grid-cols-2 gap-6">
//         {events.map((event, index) => (
//           <motion.div
//             key={event.id}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: index * 0.1 }}
//           >
//             <Card className="h-full flex flex-col border-border/50 hover:shadow-lg transition-all duration-300 bg-card border-border group">

//               {/* Event Image */}
//               {event.image_url && (
//                 <img
//                   src={event.image_url}
//                   alt={event.title}
//                   className="w-full h-48 object-cover rounded-t-xl"
//                 />
//               )}

//               <CardHeader>
//                 <div className="flex justify-between items-start mb-4">
//                   <Badge className={getEventTypeColor(event.event_type)} variant="outline">
//                     {event.event_type?.replace("_", " ").toUpperCase()}
//                   </Badge>

//                   <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
//                     <Award className="w-3 h-3 mr-1" />
//                     {event.points_reward} pts
//                   </Badge>
//                 </div>

//                 <CardTitle className="text-xl group-hover:text-primary transition-colors">
//                   {event.title}
//                 </CardTitle>

//                 <CardDescription className="line-clamp-2">
//                   {event.description}
//                 </CardDescription>
//               </CardHeader>

//               <CardContent className="flex-1 flex flex-col justify-between gap-6">

//                 <div className="space-y-3">
//                   <div className="flex items-center text-sm text-muted-foreground">
//                     <Clock className="w-4 h-4 mr-3 text-primary/70" />
//                     {format(new Date(event.event_date), "PPP")} at{" "}
//                     {format(new Date(event.event_date), "p")}
//                   </div>

//                   <div className="flex items-center text-sm text-muted-foreground">
//                     <MapPin className="w-4 h-4 mr-3 text-primary/70" />
//                     {event.location}
//                   </div>

//                   <div className="flex items-center text-sm text-muted-foreground">
//                     <Users className="w-4 h-4 mr-3 text-primary/70" />
//                     {event.current_participants}/{event.max_participants} participants
//                   </div>
//                 </div>

//                 {/* EXTERNAL EVENT LINK BUTTON */}
//                 {event.external_link && (
//                   <Button
//                     variant="outline"
//                     className="w-full flex items-center justify-center gap-2"
//                     onClick={() => window.open(event.external_link, "_blank")}
//                   >
//                     View Event
//                     <ExternalLink className="w-4 h-4" />
//                   </Button>
//                 )}

//                 {/* RSVP SECTION */}
//                 {rsvpStatus[event.id] ? (
//                   <Button
//                     variant="secondary"
//                     className="w-full bg-green-500/10 text-green-600 hover:bg-green-500/20 border border-green-200 cursor-default"
//                   >
//                     ✓ You're Registered
//                   </Button>
//                 ) : (
//                   <Button
//                     onClick={() => handleRSVP(event.id)}
//                     className="w-full bg-primary hover:bg-primary/90 group/btn"
//                     disabled={event.current_participants >= event.max_participants}
//                   >
//                     {event.current_participants >= event.max_participants ? (
//                       "Event Full"
//                     ) : (
//                       <>
//                         RSVP Now
//                         <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
//                       </>
//                     )}
//                   </Button>
//                 )}
//               </CardContent>
//             </Card>
//           </motion.div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Events;




// import { useEffect, useState } from "react";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Calendar, MapPin, Users, Award, Clock, ArrowRight } from "lucide-react";
// import { format } from "date-fns";
// import { motion } from "framer-motion";

// const Events = () => {
//   const [events, setEvents] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch LIVE events from Eventbrite API
//   useEffect(() => {
//     const fetchLiveEvents = async () => {
//       try {
//         const res = await fetch(
//           `https://www.eventbriteapi.com/v3/events/search/?location.address=Nairobi&location.within=50km&sort_by=date&expand=venue,logo&token=${
//             import.meta.env.VITE_EVENTBRITE_API_KEY
//           }`
//         );

//         const data = await res.json();
//         const eventsData = data.events || [];

//         // Normalize external API data → Your UI structure
//         const normalizedEvents = eventsData.map((e: any, index: number) => ({
//           id: e.id,
//           title: e.name?.text || "Untitled Event",
//           description: e.description?.text || "No description provided.",
//           event_date: e.start?.local,
//           location: e.venue?.address?.localized_address_display || "Nairobi",
//           image: e.logo?.url,
//           event_type: "workshop", // Optional: Could be dynamic if needed
//           points_reward: 20 + index * 5, // Dynamic eco-reward system
//           current_participants: Math.floor(Math.random() * 40) + 10, // Fake # since API doesn't include it
//           max_participants: 100,
//           link: e.url, // RSVP external link
//         }));

//         setEvents(normalizedEvents);
//       } catch (err) {
//         console.error("Error fetching events:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchLiveEvents();
//   }, []);

//   const getEventTypeColor = (type: string) => {
//     const colors: Record<string, string> = {
//       tree_planting: "bg-green-500/10 text-green-600 border-green-200",
//       trash_picking: "bg-blue-500/10 text-blue-600 border-blue-200",
//       workshop: "bg-purple-500/10 text-purple-600 border-purple-200",
//       gardening: "bg-orange-500/10 text-orange-600 border-orange-200",
//     };
//     return colors[type] || "bg-muted text-muted-foreground border-border";
//   };

//   if (loading) {
//     return (
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {[1, 2, 3, 4].map((i) => (
//           <div key={i} className="h-64 rounded-xl bg-muted animate-pulse" />
//         ))}
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-8">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
//             <Calendar className="w-8 h-8 text-primary" />
//             Nairobi Eco Events
//           </h1>
//           <p className="text-muted-foreground">
//             Discover and join real eco-friendly events happening around Nairobi.
//           </p>
//         </div>
//       </div>

//       <div className="grid md:grid-cols-2 gap-6">
//         {events.map((event, index) => (
//           <motion.div
//             key={event.id}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: index * 0.1 }}
//           >
//             <Card className="h-full flex flex-col border-border/50 hover:shadow-lg transition-all duration-300 bg-card border-border group">

//               {/* Event Image */}
//               {event.image && (
//                 <img
//                   src={event.image}
//                   alt={event.title}
//                   className="w-full h-48 object-cover rounded-t-xl"
//                 />
//               )}

//               <CardHeader>
//                 <div className="flex justify-between items-start mb-4">
//                   <Badge className={getEventTypeColor(event.event_type)} variant="outline">
//                     {event.event_type?.replace("_", " ").toUpperCase()}
//                   </Badge>

//                   <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
//                     <Award className="w-3 h-3 mr-1" />
//                     {event.points_reward} pts
//                   </Badge>
//                 </div>

//                 <CardTitle className="text-xl group-hover:text-primary transition-colors">
//                   {event.title}
//                 </CardTitle>

//                 <CardDescription className="line-clamp-2">
//                   {event.description}
//                 </CardDescription>
//               </CardHeader>

//               <CardContent className="flex-1 flex flex-col justify-between gap-6">
//                 <div className="space-y-3">
//                   <div className="flex items-center text-sm text-muted-foreground">
//                     <Clock className="w-4 h-4 mr-3 text-primary/70" />
//                     {format(new Date(event.event_date), "PPP")} at{" "}
//                     {format(new Date(event.event_date), "p")}
//                   </div>

//                   <div className="flex items-center text-sm text-muted-foreground">
//                     <MapPin className="w-4 h-4 mr-3 text-primary/70" />
//                     {event.location}
//                   </div>

//                   <div className="flex items-center text-sm text-muted-foreground">
//                     <Users className="w-4 h-4 mr-3 text-primary/70" />
//                     {event.current_participants}/{event.max_participants} participants
//                   </div>
//                 </div>

//                 {/* RSVP Redirect Button */}
//                 <Button asChild className="w-full bg-primary hover:bg-primary/90 group/btn">
//                   <a href={event.link} target="_blank" rel="noopener noreferrer">
//                     RSVP on Event Website
//                     <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
//                   </a>
//                 </Button>
//               </CardContent>
//             </Card>
//           </motion.div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Events;





//first
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { supabase } from "@/integrations/supabase/client";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Calendar, MapPin, Users, Award, Clock, ArrowRight } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import { format } from "date-fns";
// import { motion } from "framer-motion";

// const Events = () => {
//   const [events, setEvents] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [userId, setUserId] = useState<string | null>(null);
//   const [rsvpStatus, setRsvpStatus] = useState<Record<string, boolean>>({});
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   useEffect(() => {
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       if (!session) {
//         navigate("/auth");
//         return;
//       }
//       setUserId(session.user.id);
//       fetchEvents(session.user.id);
//     });
//   }, [navigate]);

//   const fetchEvents = async (uid: string) => {
//     const { data: eventsData } = await supabase
//       .from("events")
//       .select("*")
//       .order("event_date", { ascending: true });

//     const { data: participantsData } = await supabase
//       .from("event_participants")
//       .select("event_id")
//       .eq("user_id", uid);

//     const rsvpMap: Record<string, boolean> = {};
//     participantsData?.forEach((p) => {
//       rsvpMap[p.event_id] = true;
//     });

//     setEvents(eventsData || []);
//     setRsvpStatus(rsvpMap);
//     setLoading(false);
//   };

//   const handleRSVP = async (eventId: string) => {
//     if (!userId) return;

//     try {
//       const { error } = await supabase
//         .from("event_participants")
//         .insert({ event_id: eventId, user_id: userId });

//       if (error) throw error;

//       setRsvpStatus({ ...rsvpStatus, [eventId]: true });
//       toast({ title: "RSVP Confirmed!", description: "You've successfully registered for this event." });
//     } catch (error: any) {
//       toast({ title: "Error", description: error.message, variant: "destructive" });
//     }
//   };

//   const getEventTypeColor = (type: string) => {
//     const colors: Record<string, string> = {
//       tree_planting: "bg-green-500/10 text-green-600 border-green-200",
//       trash_picking: "bg-blue-500/10 text-blue-600 border-blue-200",
//       workshop: "bg-purple-500/10 text-purple-600 border-purple-200",
//       gardening: "bg-orange-500/10 text-orange-600 border-orange-200",
//     };
//     return colors[type] || "bg-muted text-muted-foreground border-border";
//   };

//   if (loading) {
//     return (
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {[1, 2, 3, 4].map((i) => (
//           <div key={i} className="h-64 rounded-xl bg-muted animate-pulse" />
//         ))}
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-8">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
//             <Calendar className="w-8 h-8 text-primary" />
//             Eco Events
//           </h1>
//           <p className="text-muted-foreground">Join real-life eco activities and make a tangible impact.</p>
//         </div>
//       </div>

//       <div className="grid md:grid-cols-2 gap-6">
//         {events.map((event, index) => (
//           <motion.div
//             key={event.id}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: index * 0.1 }}
//           >
//             <Card className="h-full flex flex-col border-border/50 hover:shadow-lg transition-all duration-300 bg-card border-border group">
//               <CardHeader>
//                 <div className="flex justify-between items-start mb-4">
//                   <Badge className={getEventTypeColor(event.event_type)} variant="outline">
//                     {event.event_type?.replace("_", " ").toUpperCase()}
//                   </Badge>
//                   <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
//                     <Award className="w-3 h-3 mr-1" />
//                     {event.points_reward} pts
//                   </Badge>
//                 </div>
//                 <CardTitle className="text-xl group-hover:text-primary transition-colors">{event.title}</CardTitle>
//                 <CardDescription className="line-clamp-2">{event.description}</CardDescription>
//               </CardHeader>
//               <CardContent className="flex-1 flex flex-col justify-between gap-6">
//                 <div className="space-y-3">
//                   <div className="flex items-center text-sm text-muted-foreground">
//                     <Clock className="w-4 h-4 mr-3 text-primary/70" />
//                     {format(new Date(event.event_date), "PPP")} at {format(new Date(event.event_date), "p")}
//                   </div>
//                   <div className="flex items-center text-sm text-muted-foreground">
//                     <MapPin className="w-4 h-4 mr-3 text-primary/70" />
//                     {event.location}
//                   </div>
//                   <div className="flex items-center text-sm text-muted-foreground">
//                     <Users className="w-4 h-4 mr-3 text-primary/70" />
//                     {event.current_participants}/{event.max_participants} participants
//                   </div>
//                 </div>

//                 {rsvpStatus[event.id] ? (
//                   <Button variant="secondary" className="w-full bg-green-500/10 text-green-600 hover:bg-green-500/20 border border-green-200 cursor-default">
//                     ✓ You're Registered
//                   </Button>
//                 ) : (
//                   <Button
//                     onClick={() => handleRSVP(event.id)}
//                     className="w-full bg-primary hover:bg-primary/90 group/btn"
//                     disabled={event.current_participants >= event.max_participants}
//                   >
//                     {event.current_participants >= event.max_participants ? "Event Full" : (
//                       <>
//                         RSVP Now
//                         <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
//                       </>
//                     )}
//                   </Button>
//                 )}
//               </CardContent>
//             </Card>
//           </motion.div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Events;
