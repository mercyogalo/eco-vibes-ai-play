import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Award, Leaf, User, Edit2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const Profile = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [badges, setBadges] = useState<any[]>([]);
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      setUserId(session.user.id);
      fetchProfile(session.user.id);
      fetchBadges(session.user.id);
    });
  }, [navigate]);

  const fetchProfile = async (uid: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", uid)
      .single();

    if (data) {
      setProfile(data);
      setFullName(data.full_name || "");
      setBio(data.bio || "");
    }
  };

  const fetchBadges = async (uid: string) => {
    const { data } = await supabase
      .from("user_badges")
      .select(`
        *,
        badges (*)
      `)
      .eq("user_id", uid);

    setBadges(data || []);
  };

  const handleUpdateProfile = async () => {
    if (!userId) return;
    setLoading(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          bio: bio,
        })
        .eq("id", userId);

      if (error) throw error;

      toast({ title: "Profile Updated!", description: "Your changes have been saved." });
      fetchProfile(userId);
      setIsEditing(false);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <User className="w-8 h-8 text-primary" />
            Your Profile
          </h1>
          <p className="text-muted-foreground">Manage your account and view your achievements</p>
        </div>
        <Button
          variant={isEditing ? "default" : "outline"}
          onClick={() => isEditing ? handleUpdateProfile() : setIsEditing(true)}
          disabled={loading}
        >
          {isEditing ? (
            <>
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Saving..." : "Save Changes"}
            </>
          ) : (
            <>
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-2"
        >
          <Card className="h-full border-border bg-white/50 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
                <Avatar className="w-32 h-32 border-4 border-primary/10 shadow-xl">
                  <AvatarImage src={profile.avatar_url} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-4xl">
                    {profile.full_name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>

                <div className="text-center md:text-left space-y-4 flex-1">
                  <div>
                    <h2 className="text-3xl font-bold text-foreground">{profile.full_name || "Anonymous"}</h2>
                    <p className="text-muted-foreground">{profile.email}</p>
                  </div>

                  <div className="flex flex-wrap justify-center md:justify-start gap-3">
                    <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-1 text-sm">
                      <Trophy className="w-4 h-4 mr-2" />
                      Level {profile.level}
                    </Badge>
                    <Badge className="bg-accent/10 text-accent border-accent/20 px-3 py-1 text-sm">
                      <Award className="w-4 h-4 mr-2" />
                      {profile.total_points} Points
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={!isEditing}
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about your eco-journey..."
                    rows={4}
                    disabled={!isEditing}
                    className="bg-background/50 resize-none"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Badges Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="h-full border-border bg-white/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-6 h-6 text-primary" />
                Badges
              </CardTitle>
            </CardHeader>
            <CardContent>
              {badges.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <div className="bg-muted/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Leaf className="w-8 h-8 opacity-20" />
                  </div>
                  <p>No badges earned yet.</p>
                  <p className="text-xs mt-2">Complete challenges to earn badges!</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {badges.map((userBadge) => (
                    <div key={userBadge.id} className="flex flex-col items-center p-4 rounded-xl bg-background/50 border border-border/50 hover:border-primary/30 transition-colors text-center">
                      <div className="text-4xl mb-2 filter drop-shadow-sm">{userBadge.badges.icon}</div>
                      <h3 className="font-semibold text-sm text-foreground leading-tight">{userBadge.badges.name}</h3>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
