import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TreePine, MapPin, Users, FileSignature, Calendar, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface ImpactStats {
  totalReports: number;
  treesPlanted: number;
  landSaved: number;
  petitionsSigned: number;
  eventsAttended: number;
  activeUsers: number;
  totalPoints: number;
}

const ImpactTracker = () => {
  const [stats, setStats] = useState<ImpactStats>({
    totalReports: 0,
    treesPlanted: 0,
    landSaved: 0,
    petitionsSigned: 0,
    eventsAttended: 0,
    activeUsers: 0,
    totalPoints: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);

    // Fetch total reports
    const { count: reportsCount } = await supabase
      .from("eco_reports")
      .select("*", { count: "exact", head: true });

    // Fetch petition signatures
    const { count: signaturesCount } = await supabase
      .from("petition_signatures")
      .select("*", { count: "exact", head: true });

    // Fetch event attendees
    const { count: attendeesCount } = await supabase
      .from("event_participants")
      .select("*", { count: "exact", head: true });

    // Fetch active users
    const { count: usersCount } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });

    // Fetch total points and calculate trees planted
    const { data: pointsData } = await supabase
      .from("profiles")
      .select("total_points");

    let totalPoints = 0;
    if (pointsData) {
      totalPoints = pointsData.reduce((sum, profile) => sum + (profile.total_points || 0), 0);
    }

    // Fetch eco challenges for trees planted estimation
    const { data: challengesData } = await supabase
      .from("eco_challenges")
      .select("points_earned");

    let treesPlanted = 0;
    if (challengesData) {
      // Estimate 1 tree per 100 points earned from challenges
      const challengePoints = challengesData.reduce((sum, challenge) => sum + (challenge.points_earned || 0), 0);
      treesPlanted = Math.floor(challengePoints / 100);
    }

    setStats({
      totalReports: reportsCount || 0,
      treesPlanted,
      landSaved: Math.floor((reportsCount || 0) * 0.5), // Estimate 0.5 acres per report
      petitionsSigned: signaturesCount || 0,
      eventsAttended: attendeesCount || 0,
      activeUsers: usersCount || 0,
      totalPoints,
    });

    setLoading(false);
  };

  const statCards = [
    {
      title: "Reports Submitted",
      value: stats.totalReports,
      icon: FileSignature,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      description: "Environmental issues reported",
    },
    {
      title: "Trees Planted",
      value: stats.treesPlanted,
      icon: TreePine,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      description: "Through community challenges",
    },
    {
      title: "Land Saved",
      value: `${stats.landSaved} acres`,
      icon: MapPin,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      description: "Protected from exploitation",
    },
    {
      title: "Petitions Signed",
      value: stats.petitionsSigned,
      icon: FileSignature,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      description: "Voices for change",
    },
    {
      title: "Events Attended",
      value: stats.eventsAttended,
      icon: Calendar,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      description: "Community gatherings",
    },
    {
      title: "Active Users",
      value: stats.activeUsers,
      icon: Users,
      color: "text-pink-500",
      bgColor: "bg-pink-500/10",
      description: "Growing community",
    },
  ];

  const milestones = [
    { value: 100, label: "Reports", achieved: stats.totalReports >= 100 },
    { value: 500, label: "Trees", achieved: stats.treesPlanted >= 500 },
    { value: 1000, label: "Signatures", achieved: stats.petitionsSigned >= 1000 },
    { value: 50, label: "Acres", achieved: stats.landSaved >= 50 },
  ];

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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="w-8 h-8 text-primary" />
            Impact Tracker
          </h1>
          <p className="text-muted-foreground">Real-time metrics of our collective environmental impact.</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-32 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          {/* Total Points Hero */}
          <motion.div variants={item}>
            <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
              <CardContent className="py-12">
                <div className="text-center space-y-4">
                  <div className="inline-flex p-4 rounded-full bg-white/50 backdrop-blur-sm shadow-sm">
                    <TrendingUp className="w-12 h-12 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-5xl font-bold text-foreground mb-2 tracking-tight">{stats.totalPoints.toLocaleString()}</h2>
                    <p className="text-xl text-muted-foreground">Total Community Points Earned</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Stats Grid */}
          <motion.div variants={item} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {statCards.map((stat) => (
              <Card key={stat.title} className="hover:shadow-lg transition-all duration-300 border-border/50 bg-white/50 backdrop-blur-sm group">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor} group-hover:scale-110 transition-transform`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-1 text-foreground">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* Milestones */}
          <motion.div variants={item}>
            <Card className="border-border/50 bg-white/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Community Milestones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {milestones.map((milestone) => (
                    <div
                      key={milestone.label}
                      className={`p-6 rounded-xl border transition-all duration-300 ${milestone.achieved
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border bg-muted/20 opacity-70"
                        }`}
                    >
                      <div className="text-center space-y-2">
                        <div
                          className={`text-3xl font-bold ${milestone.achieved ? "text-primary" : "text-muted-foreground"
                            }`}
                        >
                          {milestone.value}
                        </div>
                        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{milestone.label}</p>
                        {milestone.achieved && (
                          <div className="inline-flex items-center gap-1 text-xs text-primary font-bold bg-primary/10 px-2 py-1 rounded-full">
                            <span>✓ ACHIEVED</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ImpactTracker;