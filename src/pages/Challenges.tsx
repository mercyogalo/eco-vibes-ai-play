import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Footprints, Trees, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Challenges = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [todayChallenge, setTodayChallenge] = useState<any>(null);
  const [steps, setSteps] = useState("");
  const [distance, setDistance] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      setUserId(session.user.id);
      fetchTodayChallenge(session.user.id);
    });
  }, [navigate]);

  const fetchTodayChallenge = async (uid: string) => {
    const today = new Date().toISOString().split("T")[0];
    const { data } = await supabase
      .from("eco_challenges")
      .select("*")
      .eq("user_id", uid)
      .eq("challenge_date", today)
      .single();

    setTodayChallenge(data);
    if (data) {
      setSteps(data.steps_taken.toString());
      setDistance(data.distance_km.toString());
    }
  };

  const handleSave = async () => {
    if (!userId) return;
    setLoading(true);

    try {
      const stepsNum = parseInt(steps) || 0;
      const distanceNum = parseFloat(distance) || 0;
      const co2Saved = (distanceNum * 0.12).toFixed(2); // Rough estimate
      const pointsEarned = Math.floor(stepsNum / 100);

      const today = new Date().toISOString().split("T")[0];

      if (todayChallenge) {
        const { error } = await supabase
          .from("eco_challenges")
          .update({
            steps_taken: stepsNum,
            distance_km: distanceNum,
            co2_saved_kg: parseFloat(co2Saved),
            points_earned: pointsEarned,
          })
          .eq("id", todayChallenge.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("eco_challenges")
          .insert({
            user_id: userId,
            challenge_date: today,
            steps_taken: stepsNum,
            distance_km: distanceNum,
            co2_saved_kg: parseFloat(co2Saved),
            points_earned: pointsEarned,
          });

        if (error) throw error;
      }

      toast({ title: "Challenge Updated!", description: `You earned ${pointsEarned} points!` });
      fetchTodayChallenge(userId);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const stepsNum = parseInt(steps) || 0;
  const distanceNum = parseFloat(distance) || 0;
  const estimatedCO2 = (distanceNum * 0.12).toFixed(2);
  const treesEquivalent = (parseFloat(estimatedCO2) / 21).toFixed(2);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Walk for the Planet 🌍</h1>
          <p className="text-muted-foreground">Track your daily eco-friendly actions and see your impact</p>
        </div>

        {/* Today's Challenge Card */}
        <Card className="mb-6 border-primary/20">
          <CardHeader>
            <CardTitle>Today's Eco Challenge</CardTitle>
            <CardDescription>Log your steps and see the environmental impact you're making</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="steps">Steps Taken</Label>
                <Input
                  id="steps"
                  type="number"
                  placeholder="10000"
                  value={steps}
                  onChange={(e) => setSteps(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="distance">Distance (km)</Label>
                <Input
                  id="distance"
                  type="number"
                  step="0.1"
                  placeholder="5.0"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                />
              </div>
            </div>

            <Button onClick={handleSave} disabled={loading} className="w-full bg-primary hover:bg-primary/90">
              {loading ? "Saving..." : "Save Progress"}
            </Button>
          </CardContent>
        </Card>

        {/* Impact Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-accent/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Footprints className="w-8 h-8 text-accent" />
                <TrendingUp className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">Steps Today</p>
              <p className="text-3xl font-bold text-accent">{stepsNum.toLocaleString()}</p>
              <Progress value={(stepsNum / 10000) * 100} className="mt-2 h-2" />
              <p className="text-xs text-muted-foreground mt-1">Goal: 10,000 steps</p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Trees className="w-8 h-8 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">CO₂ Saved</p>
              <p className="text-3xl font-bold text-primary">{estimatedCO2} kg</p>
              <p className="text-xs text-muted-foreground mt-2">
                Equivalent to {treesEquivalent} trees planted
              </p>
            </CardContent>
          </Card>

          <Card className="border-secondary/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Award className="w-8 h-8 text-secondary-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">Points Earned</p>
              <p className="text-3xl font-bold text-secondary-foreground">{Math.floor(stepsNum / 100)}</p>
              <p className="text-xs text-muted-foreground mt-2">
                100 steps = 1 point
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Challenges;
