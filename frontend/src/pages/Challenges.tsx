import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import api from "@/utils/api";
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
  const [challenges, setChallenges] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newChallenge, setNewChallenge] = useState<any>({
    name: "",
    description: "",
    category: "challenge",
    status: "active",
    deadline: "",
    prize: "",
    icon: "",
    difficulty: "medium",
    createdBy: "",
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      setUserId(session.user.id);
      fetchTodayChallenge(session.user.id);
      fetchChallenges();
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

  const fetchChallenges = async (status?: string) => {
    try {
      const q = status && status !== "all" ? `?status=${status}` : "";
      const res = await api.get(`/videos/challenges${q}`);
      setChallenges(res.data.challenges || res.data || []);
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to load challenges", variant: "destructive" });
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

  const handleCreateChallenge = async () => {
    setCreating(true);
    try {
      const body = { ...newChallenge };
      if (newChallenge.deadline) body.deadline = new Date(newChallenge.deadline);
      const res = await api.post("/videos/challenges", body);
      toast({ title: "Created", description: "Challenge created successfully" });
      setShowCreate(false);
      setNewChallenge({
        name: "",
        description: "",
        category: "challenge",
        status: "active",
        deadline: "",
        prize: "",
        icon: "",
        difficulty: "medium",
        createdBy: "",
      });
      fetchChallenges(statusFilter);
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to create", variant: "destructive" });
    } finally {
      setCreating(false);
    }
  };

  const handleJoin = async (challengeId: string) => {
    if (!userId) return navigate("/auth");
    try {
      const session = await supabase.auth.getSession();
      const username = session?.data?.session?.user?.user_metadata?.full_name || session?.data?.session?.user?.email || userId;
      const res = await api.post(`/videos/challenges/${challengeId}/join`, { userId, username });
      toast({ title: "Joined", description: res.data.message || "You joined the challenge" });
      fetchChallenges(statusFilter);
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to join", variant: "destructive" });
    }
  };

  const stepsNum = parseInt(steps) || 0;
  const distanceNum = parseFloat(distance) || 0;
  const estimatedCO2 = (distanceNum * 0.12).toFixed(2);
  const treesEquivalent = (parseFloat(estimatedCO2) / 21).toFixed(2);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-muted-foreground flex items-center gap-2">
            <Target className="w-8 h-8 text-primary" />
            Challenges
          </h1>
          <p className="text-muted-foreground">Discover, create and join community challenges.</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); fetchChallenges(e.target.value); }}
            className="rounded-md border px-3 py-2 text-primary "
          >
            <option value="all" className="hover:bg-primary">All</option>
            <option value="active" className="hover:bg-primary">Active</option>
            <option value="trending" className="hover:bg-primary">Trending</option>
            <option value="completed" className="hover:bg-primary">Completed</option>
          </select>
          <Button onClick={() => setShowCreate((s) => !s)}>{showCreate ? "Cancel" : "Create Challenge"}</Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {challenges.length === 0 && (
            <Card>
              <CardContent>No challenges found.</CardContent>
            </Card>
          )}

          {challenges.map((c: any) => (
            <Card key={c._id || c.id} className="mb-2">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>
                      <button className="text-left" onClick={() => navigate(`/challenges/${c._id || c.id}`)}>{c.name}</button>
                    </CardTitle>
                    <CardDescription className="max-w-xl">{c.description}</CardDescription>
                    <div className="mt-2 flex gap-2 text-xs text-muted-foreground">
                      <span>Category: {c.category}</span>
                      <span>Difficulty: {c.difficulty}</span>
                      <span>Status: {c.status}</span>
                      {c.deadline && <span>Deadline: {new Date(c.deadline).toLocaleDateString()}</span>}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">Participants</div>
                    <div className="text-2xl font-bold">{c.participants || 0}</div>
                    <div className="text-xs text-muted-foreground">Videos: {c.videos || 0}</div>
                    <div className="mt-3">
                      <Button onClick={() => handleJoin(c._id || c.id)}>Join</Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          {showCreate && (
            <Card>
              <CardHeader>
                <CardTitle>Create Challenge</CardTitle>
                <CardDescription>Fill required fields to create a new challenge.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={newChallenge.name} onChange={(e) => setNewChallenge({ ...newChallenge, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input value={newChallenge.description} onChange={(e) => setNewChallenge({ ...newChallenge, description: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>Category</Label>
                    <select className="w-full rounded-md border px-2 py-2" value={newChallenge.category} onChange={(e) => setNewChallenge({ ...newChallenge, category: e.target.value })}>
                      <option value="deforestation">deforestation</option>
                      <option value="pollution">pollution</option>
                      <option value="land-grabbing">land-grabbing</option>
                      <option value="challenge">challenge</option>
                      <option value="education">education</option>
                    </select>
                  </div>
                  <div>
                    <Label>Difficulty</Label>
                    <select className="w-full rounded-md border px-2 py-2" value={newChallenge.difficulty} onChange={(e) => setNewChallenge({ ...newChallenge, difficulty: e.target.value })}>
                      <option value="easy">easy</option>
                      <option value="medium">medium</option>
                      <option value="hard">hard</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Deadline</Label>
                  <Input type="date" value={newChallenge.deadline} onChange={(e) => setNewChallenge({ ...newChallenge, deadline: e.target.value })} />
                </div>

                <div className="space-y-2">
                  <Label>Prize</Label>
                  <Input value={newChallenge.prize} onChange={(e) => setNewChallenge({ ...newChallenge, prize: e.target.value })} />
                </div>

                <div className="space-y-2">
                  <Label>Created By</Label>
                  <Input value={newChallenge.createdBy} onChange={(e) => setNewChallenge({ ...newChallenge, createdBy: e.target.value })} />
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleCreateChallenge} disabled={creating}>{creating ? "Creating..." : "Create"}</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick impact preview kept for continuity */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6 text-center">
              <div className="mx-auto bg-card w-12 h-12 rounded-full flex items-center justify-center mb-3 shadow-sm">
                <Trees className="w-6 h-6 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">CO₂ Saved</p>
              <p className="text-4xl font-bold text-primary my-2">{estimatedCO2} <span className="text-lg font-normal text-muted-foreground">kg</span></p>
              <p className="text-xs text-muted-foreground">Equivalent to {treesEquivalent} trees planted</p>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default Challenges;
