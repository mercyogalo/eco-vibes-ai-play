import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Leaf, Trophy, Video, TrendingUp, Calendar, Users, Award, Zap, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

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
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <Leaf className="w-12 h-12 text-primary animate-bounce" />
          <p className="text-muted-foreground">Loading your eco-profile...</p>
        </div>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Welcome Section */}
      <motion.div variants={item} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground tracking-tight">
            Welcome back, <span className="text-primary">{profile.full_name || "Eco Champion"}</span>! 👋
          </h1>
          <p className="text-muted-foreground text-lg">Your impact matters. Here's your daily overview.</p>
        </div>
        <Button onClick={() => navigate("/impact")} className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all">
          View Full Impact <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Points", value: profile.total_points, icon: Trophy, color: "text-yellow-500", bg: "bg-yellow-500/10" },
          { label: "Current Level", value: profile.level, icon: Award, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Badges Earned", value: "0", icon: Leaf, color: "text-green-500", bg: "bg-green-500/10" },
          { label: "Next Level", value: `${100 - (profile.total_points % 100)} pts`, icon: TrendingUp, color: "text-purple-500", bg: "bg-purple-500/10" },
        ].map((stat, i) => (
          <Card key={i} className="border-border/50 bg-card border-border hover:shadow-lg transition-all duration-300 group">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                {i === 3 && <Progress value={(profile.total_points % 100)} className="w-20 h-2" />}
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={item}>
        <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: "Create AI Video", desc: "Generate personalized eco-videos.", icon: Video, action: () => navigate("/video-creator"), color: "bg-primary" },
            { title: "Join Events", desc: "Find local cleanups and meetups.", icon: Calendar, action: () => navigate("/events"), color: "bg-accent" },
            { title: "Track Challenge", desc: "Log your daily eco-actions.", icon: TrendingUp, action: () => navigate("/challenges"), color: "bg-secondary" },
          ].map((action, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="relative group overflow-hidden rounded-3xl bg-card border border-border shadow-sm cursor-pointer"
              onClick={action.action}
            >
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity ${action.color}`} />
              <div className="p-8">
                <div className={`w-14 h-14 rounded-2xl ${action.color} bg-opacity-10 flex items-center justify-center mb-6 text-foreground`}>
                  <action.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-2">{action.title}</h3>
                <p className="text-muted-foreground mb-6">{action.desc}</p>
                <div className="flex items-center text-primary font-semibold group-hover:translate-x-2 transition-transform">
                  Get Started <ArrowRight className="ml-2 w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Topic Selection */}
      <motion.div variants={item}>
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="w-6 h-6 text-primary" />
              Personalize Your Feed
            </CardTitle>
            <CardDescription>
              Select topics to customize your AI recommendations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {topics.map((topic) => {
                const Icon = topic.icon;
                const isSelected = selectedTopics.includes(topic.id);
                return (
                  <motion.div
                    key={topic.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleTopic(topic.id)}
                    className={`
                      cursor-pointer rounded-xl p-4 border-2 transition-all duration-200
                      flex flex-col items-center text-center gap-3
                      ${isSelected
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-transparent bg-secondary/10 hover:bg-secondary/20"
                      }
                    `}
                  >
                    <div className={`p-3 rounded-full ${topic.color} bg-opacity-20`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="font-semibold text-sm">{topic.name}</span>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
