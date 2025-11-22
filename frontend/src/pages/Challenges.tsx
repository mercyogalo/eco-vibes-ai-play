import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Footprints, Trees, Award, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Target className="w-8 h-8 text-primary" />
            Daily Eco Challenge
          </h1>
          <p className="text-muted-foreground">Track your daily actions and reduce your carbon footprint.</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Today's Challenge Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          <Card className="h-full border-border bg-white/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Log Your Activity</CardTitle>
              <CardDescription>Every step counts towards a greener planet.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="steps" className="flex items-center gap-2">
                    <Footprints className="w-4 h-4 text-primary" />
                    Steps Taken
                  </Label>
                  <Input
                    id="steps"
                    type="number"
                    placeholder="e.g. 10000"
                    value={steps}
                    onChange={(e) => setSteps(e.target.value)}
                    className="text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="distance" className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    Distance (km)
                  </Label>
                  <Input
                    id="distance"
                    type="number"
                    step="0.1"
                    placeholder="e.g. 5.0"
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                    className="text-lg"
                  />
                </div>
              </div>

              <div className="bg-primary/5 p-6 rounded-xl border border-primary/10">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-primary">Daily Goal Progress</span>
                  <span className="text-sm font-bold text-primary">{Math.min(Math.round((stepsNum / 10000) * 100), 100)}%</span>
                </div>
                <Progress value={(stepsNum / 10000) * 100} className="h-3" />
                <p className="text-xs text-muted-foreground mt-2 text-right">Target: 10,000 steps</p>
              </div>

              <Button onClick={handleSave} disabled={loading} className="w-full bg-primary hover:bg-primary/90 h-12 text-lg">
                {loading ? "Saving..." : "Save Progress"}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Impact Stats Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6 text-center">
              <div className="mx-auto bg-white w-12 h-12 rounded-full flex items-center justify-center mb-3 shadow-sm">
                <Trees className="w-6 h-6 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">CO₂ Saved</p>
              <p className="text-4xl font-bold text-primary my-2">{estimatedCO2} <span className="text-lg font-normal text-muted-foreground">kg</span></p>
              <p className="text-xs text-muted-foreground">
                Equivalent to {treesEquivalent} trees planted
              </p>
            </CardContent>
          </Card>

          <Card className="border-accent/20 bg-accent/5">
            <CardContent className="pt-6 text-center">
              <div className="mx-auto bg-white w-12 h-12 rounded-full flex items-center justify-center mb-3 shadow-sm">
                <Award className="w-6 h-6 text-accent" />
              </div>
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Points Earned</p>
              <p className="text-4xl font-bold text-accent my-2">{Math.floor(stepsNum / 100)}</p>
              <p className="text-xs text-muted-foreground">
                100 steps = 1 point
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Challenges;
