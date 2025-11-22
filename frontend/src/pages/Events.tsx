import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Award, Clock, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { motion } from "framer-motion";

const Events = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [rsvpStatus, setRsvpStatus] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      setUserId(session.user.id);
      fetchEvents(session.user.id);
    });
  }, [navigate]);

  const fetchEvents = async (uid: string) => {
    const { data: eventsData } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: true });

    const { data: participantsData } = await supabase
      .from("event_participants")
      .select("event_id")
      .eq("user_id", uid);

    const rsvpMap: Record<string, boolean> = {};
    participantsData?.forEach((p) => {
      rsvpMap[p.event_id] = true;
    });

    setEvents(eventsData || []);
    setRsvpStatus(rsvpMap);
    setLoading(false);
  };

  const handleRSVP = async (eventId: string) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from("event_participants")
        .insert({ event_id: eventId, user_id: userId });

      if (error) throw error;

      setRsvpStatus({ ...rsvpStatus, [eventId]: true });
      toast({ title: "RSVP Confirmed!", description: "You've successfully registered for this event." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const getEventTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      tree_planting: "bg-green-500/10 text-green-600 border-green-200",
      trash_picking: "bg-blue-500/10 text-blue-600 border-blue-200",
      workshop: "bg-purple-500/10 text-purple-600 border-purple-200",
      gardening: "bg-orange-500/10 text-orange-600 border-orange-200",
    };
    return colors[type] || "bg-muted text-muted-foreground border-border";
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-64 rounded-xl bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Calendar className="w-8 h-8 text-primary" />
            Eco Events
          </h1>
          <p className="text-muted-foreground">Join real-life eco activities and make a tangible impact.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full flex flex-col border-border/50 hover:shadow-lg transition-all duration-300 bg-white/50 backdrop-blur-sm group">
              <CardHeader>
                <div className="flex justify-between items-start mb-4">
                  <Badge className={getEventTypeColor(event.event_type)} variant="outline">
                    {event.event_type?.replace("_", " ").toUpperCase()}
                  </Badge>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    <Award className="w-3 h-3 mr-1" />
                    {event.points_reward} pts
                  </Badge>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">{event.title}</CardTitle>
                <CardDescription className="line-clamp-2">{event.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 mr-3 text-primary/70" />
                    {format(new Date(event.event_date), "PPP")} at {format(new Date(event.event_date), "p")}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-3 text-primary/70" />
                    {event.location}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="w-4 h-4 mr-3 text-primary/70" />
                    {event.current_participants}/{event.max_participants} participants
                  </div>
                </div>

                {rsvpStatus[event.id] ? (
                  <Button variant="secondary" className="w-full bg-green-500/10 text-green-600 hover:bg-green-500/20 border border-green-200 cursor-default">
                    ✓ You're Registered
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleRSVP(event.id)}
                    className="w-full bg-primary hover:bg-primary/90 group/btn"
                    disabled={event.current_participants >= event.max_participants}
                  >
                    {event.current_participants >= event.max_participants ? "Event Full" : (
                      <>
                        RSVP Now
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Events;
