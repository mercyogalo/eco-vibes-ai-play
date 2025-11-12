import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

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
      tree_planting: "bg-accent/10 text-accent border-accent/20",
      trash_picking: "bg-primary/10 text-primary border-primary/20",
      workshop: "bg-secondary/20 text-secondary-foreground border-secondary/40",
      gardening: "bg-muted text-muted-foreground border-border",
    };
    return colors[type] || "bg-muted text-muted-foreground border-border";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Environmental Events in Nairobi</h1>
          <p className="text-muted-foreground">Join real-life eco activities and make a tangible impact</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge className={getEventTypeColor(event.event_type)}>
                    {event.event_type?.replace("_", " ").toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    <Award className="w-3 h-3 mr-1" />
                    {event.points_reward} pts
                  </Badge>
                </div>
                <CardTitle className="text-xl">{event.title}</CardTitle>
                <CardDescription>{event.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-2" />
                    {format(new Date(event.event_date), "PPP")} at {format(new Date(event.event_date), "p")}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2" />
                    {event.location}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="w-4 h-4 mr-2" />
                    {event.current_participants}/{event.max_participants} participants
                  </div>
                </div>
                {rsvpStatus[event.id] ? (
                  <Badge className="w-full justify-center bg-accent text-accent-foreground">
                    ✓ You're Registered
                  </Badge>
                ) : (
                  <Button
                    onClick={() => handleRSVP(event.id)}
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={event.current_participants >= event.max_participants}
                  >
                    {event.current_participants >= event.max_participants ? "Event Full" : "RSVP Now"}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events;
