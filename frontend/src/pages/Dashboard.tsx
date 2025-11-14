import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Leaf, Trophy, Video, TrendingUp, Calendar, Users, Award, Zap } from "lucide-react";

const topics = [
  { id: "climate_change", name: "Climate Change", icon: TrendingUp, color: "bg-destructive/10 text-destructive" },
  { id: "wildlife", name: "Wildlife Conservation", icon: Leaf, color: "bg-accent/10 text-accent" },
  { id: "plastic", name: "Plastic Pollution", icon: Users, color: "bg-primary/10 text-primary" },
  { id: "renewable", name: "Renewable Energy", icon: Zap, color: "bg-secondary/20 text-secondary-foreground" },
];

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      fetchProfile(session.user.id);
    });
  }, [navigate]);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    setProfile(data);
  };

  const toggleTopic = (topicId: string) => {
    setSelectedTopics(prev =>
      prev.includes(topicId) ? prev.filter(t => t !== topicId) : [...prev, topicId]
    );
  };

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Welcome back, {profile.full_name || "Eco Champion"}! 👋
          </h1>
          <p className="text-muted-foreground">Continue your journey to make the planet greener</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-primary/20 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Points</p>
                  <p className="text-3xl font-bold text-primary">{profile.total_points}</p>
                </div>
                <Trophy className="w-12 h-12 text-primary/20" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-secondary/20 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Level</p>
                  <p className="text-3xl font-bold text-secondary-foreground">{profile.level}</p>
                </div>
                <Award className="w-12 h-12 text-secondary/40" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-accent/20 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Next Level</p>
                  <Progress value={(profile.total_points % 100)} className="mt-2 h-2" />
                  <p className="text-xs text-muted-foreground mt-1">{100 - (profile.total_points % 100)} pts to go</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Badges Earned</p>
                  <p className="text-3xl font-bold text-foreground">0</p>
                </div>
                <Leaf className="w-12 h-12 text-muted-foreground/20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Topic Selection */}
        <Card className="mb-8 border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="w-6 h-6 text-primary" />
              Select Your Interests
            </CardTitle>
            <CardDescription>
              Choose topics you care about to get personalized content and AI-generated videos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {topics.map((topic) => {
                const Icon = topic.icon;
                const isSelected = selectedTopics.includes(topic.id);
                return (
                  <Card
                    key={topic.id}
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      isSelected ? "border-primary shadow-lg" : "border-border"
                    }`}
                    onClick={() => toggleTopic(topic.id)}
                  >
                    <CardContent className="pt-6 text-center">
                      <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center ${topic.color}`}>
                        <Icon className="w-8 h-8" />
                      </div>
                      <h3 className="font-semibold text-card-foreground">{topic.name}</h3>
                      {isSelected && (
                        <Badge className="mt-2 bg-primary text-primary-foreground">Selected</Badge>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-primary/20 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/video-creator")}>
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Video className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-card-foreground">Create AI Video</h3>
              <p className="text-muted-foreground text-sm">Generate personalized videos to share on social media</p>
              <Button className="mt-4 w-full bg-primary hover:bg-primary/90">
                Get Started
              </Button>
            </CardContent>
          </Card>

          <Card className="border-accent/20 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/events")}>
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-card-foreground">Join Events</h3>
              <p className="text-muted-foreground text-sm">Participate in real-life eco activities in Nairobi</p>
              <Button className="mt-4 w-full bg-accent hover:bg-accent/90">
                View Events
              </Button>
            </CardContent>
          </Card>

          <Card className="border-secondary/20 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/challenges")}>
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-secondary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-card-foreground">Track Challenge</h3>
              <p className="text-muted-foreground text-sm">Log your daily eco-friendly actions and compete</p>
              <Button className="mt-4 w-full bg-secondary hover:bg-secondary/80">
                Start Tracking
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
