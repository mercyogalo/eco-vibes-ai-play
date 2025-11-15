import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TreePine, MapPin, Users, FileSignature, Calendar, TrendingUp } from "lucide-react";
import Navbar from "@/components/Navbar";

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-2">
            <BarChart3 className="w-10 h-10 text-primary" />
            Impact Tracker
          </h1>
          <p className="text-muted-foreground text-lg">See the collective impact of our community</p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading impact data...</div>
        ) : (
          <>
            {/* Main Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
              {statCards.map((stat) => (
                <Card key={stat.title} className="hover:shadow-lg transition">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-1">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">{stat.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Total Points Hero */}
            <Card className="mb-8 bg-gradient-to-r from-primary/10 to-primary/5">
              <CardContent className="py-8">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h2 className="text-4xl font-bold mb-2">{stats.totalPoints.toLocaleString()}</h2>
                  <p className="text-lg text-muted-foreground">Total Community Points Earned</p>
                </div>
              </CardContent>
            </Card>

            {/* Milestones */}
            <Card>
              <CardHeader>
                <CardTitle>Community Milestones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {milestones.map((milestone) => (
                    <div
                      key={milestone.label}
                      className={`p-4 rounded-lg border-2 transition ${
                        milestone.achieved
                          ? "border-primary bg-primary/5"
                          : "border-muted bg-muted/50"
                      }`}
                    >
                      <div className="text-center">
                        <div
                          className={`text-3xl font-bold mb-1 ${
                            milestone.achieved ? "text-primary" : "text-muted-foreground"
                          }`}
                        >
                          {milestone.value}
                        </div>
                        <p className="text-sm text-muted-foreground">{milestone.label}</p>
                        {milestone.achieved && (
                          <div className="mt-2 text-xs text-primary font-semibold">✓ ACHIEVED</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Impact Statement */}
            <Card className="mt-8 bg-muted/50">
              <CardContent className="py-8">
                <p className="text-center text-lg text-muted-foreground">
                  Together, our community has made a <span className="font-bold text-primary">measurable impact</span> on
                  environmental protection. Every action counts, and these numbers prove that{" "}
                  <span className="font-bold text-primary">Gen Z is taking charge</span> of our planet's future.
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default ImpactTracker;