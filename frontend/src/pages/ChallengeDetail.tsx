import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import api from "@/utils/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Target, Users, Calendar, Award } from "lucide-react";

const ChallengeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [challenge, setChallenge] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setUserId(session.user.id);
    });
  }, []);

  useEffect(() => {
    if (!id) return;
    fetchChallenge(id);
  }, [id]);

  const fetchChallenge = async (cid: string) => {
    try {
      const res = await api.get(`/videos/challenges/${cid}`);
      setChallenge(res.data.challenge || res.data);
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to load challenge", variant: "destructive" });
    }
  };

  const handleJoin = async () => {
    if (!userId) return navigate("/auth");
    setLoading(true);
    try {
      const session = await supabase.auth.getSession();
      const username = session?.data?.session?.user?.user_metadata?.full_name || session?.data?.session?.user?.email || userId;
      const res = await api.post(`/videos/challenges/${id}/join`, { userId, username });
      toast({ title: "Joined", description: res.data.message || "You joined the challenge" });
      fetchChallenge(id!);
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to join", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (!challenge) {
    return (
      <div className="py-8">
        <p className="text-center text-sm text-muted-foreground">Loading challenge...</p>
      </div>
    );
  }

  const joined = userId
    ? (challenge.joinedUsers || []).some((u: any) => {
        if (!u) return false;
        return typeof u === "string" ? u === userId : u.userId === userId;
      })
    : false;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Target className="w-8 h-8 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">{challenge.name}</h2>
          <p className="text-sm text-muted-foreground">{challenge.category} • {challenge.difficulty}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>About this challenge</CardTitle>
              <CardDescription>{challenge.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm">Prize</Label>
                <div className="text-lg">{challenge.prize || "—"}</div>
              </div>

              <div className="flex gap-4">
                <div>
                  <Label className="text-sm">Deadline</Label>
                  <div>{challenge.deadline ? new Date(challenge.deadline).toLocaleString() : "No deadline"}</div>
                </div>
                <div>
                  <Label className="text-sm">Participants</Label>
                  <div>{challenge.participants || 0}</div>
                </div>
                <div>
                  <Label className="text-sm">Videos</Label>
                  <div>{challenge.videos || 0}</div>
                </div>
              </div>

              <div>
                <Label className="text-sm">Joined Users</Label>
                {(challenge.joinedUsers || []).length === 0 && <div className="text-sm text-muted-foreground">No participants yet</div>}
                <ul className="mt-2 space-y-1">
                  {(challenge.joinedUsers || []).map((u: any, idx: number) => {
                    const label = typeof u === "string" ? u : u.username || u.userId;
                    const key = typeof u === "string" ? u : u.userId || idx;
                    return (
                      <li key={key} className="text-sm">{label}</li>
                    );
                  })}
                </ul>
              </div>

              <div className="flex gap-3">
                {!joined ? (
                  <Button onClick={handleJoin} disabled={loading}>{loading ? "Joining..." : "Join Challenge"}</Button>
                ) : (
                  <Button onClick={() => navigate(`/video-creator?challengeId=${challenge._id || challenge.id}`)}>Create Video for this Challenge</Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2"><Users className="w-4 h-4"/> <div>{challenge.participants || 0} participants</div></div>
              <div className="flex items-center gap-2"><Calendar className="w-4 h-4"/> <div>{challenge.deadline ? new Date(challenge.deadline).toLocaleDateString() : "No deadline"}</div></div>
              <div className="flex items-center gap-2"><Award className="w-4 h-4"/> <div>{challenge.prize || "No prize"}</div></div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default ChallengeDetail;
