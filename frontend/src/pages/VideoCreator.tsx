// Updated VideoCreator.tsx - Integrated with Backend API
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Video, Sparkles, TrendingUp, Instagram, Youtube } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

// Backend API URL
const API_BASE_URL = "http://localhost:5000/api/videos";

interface VideoContent {
  _id: string;
  title: string;
  description: string | null;
  path: string | null;
  platform?: string | null;
  views: number;
  likes: number;
  shares: number;
  category: string;
  username: string;
  status: string;
  createdAt: string;
}

interface Challenge {
  _id: string;
  name: string;
  description: string;
  category: string;
  participants: number;
  status: string;
}

interface Template {
  _id: string;
  name: string;
  category: string;
  duration: number;
  style: string;
}

const VideoCreator = () => {
  const [user, setUser] = useState<any>(null);
  const [videos, setVideos] = useState<VideoContent[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [selectedChallenge, setSelectedChallenge] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [generating, setGenerating] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    checkUser();
    fetchVideos();
    fetchChallenges();
    fetchTemplates();
  }, []);

  // ========== AUTH ==========
  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const userData = session?.user ?? null;
    setUser(userData);
    
    // If no user, you can still create videos with anonymous ID
    if (!userData) {
      console.log("No user logged in - using anonymous session");
    }
  };

  // ========== FETCH DATA FROM BACKEND ==========
  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/trending`);
      const data = await response.json();
      
      if (data.success) {
        setVideos(data.videos);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
      toast({ 
        title: "Error loading videos", 
        description: "Could not connect to backend",
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchChallenges = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/challenges`);
      const data = await response.json();
      
      if (data.success) {
        setChallenges(data.challenges);
      }
    } catch (error) {
      console.error("Error fetching challenges:", error);
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/templates`);
      const data = await response.json();
      
      if (data.success) {
        setTemplates(data.templates);
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  };

  // ========== UPLOAD VIDEO ==========
  const handleUploadVideo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!videoFile) {
      toast({ 
        title: "Please select a video file", 
        variant: "destructive" 
      });
      return;
    }

    if (!title || !category) {
      toast({ 
        title: "Please fill in title and category", 
        variant: "destructive" 
      });
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("video", videoFile);
      formData.append("userId", user?.id || `anonymous_${Date.now()}`);
      formData.append("username", user?.email?.split("@")[0] || "eco_warrior");
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("hashtags", JSON.stringify([
        "#EcoPulse",
        `#${category}`,
        "#GenZActivism"
      ]));
      
      if (selectedChallenge) {
        formData.append("challengeId", selectedChallenge);
      }

      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        toast({ 
          title: "Video uploaded successfully!", 
          description: "Your video is ready for sharing"
        });
        resetForm();
        fetchVideos();
        
        // Join challenge if selected
        if (selectedChallenge) {
          await joinChallenge(selectedChallenge);
        }
      } else {
        toast({ 
          title: "Upload failed", 
          description: data.error || "Unknown error",
          variant: "destructive" 
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({ 
        title: "Error uploading video", 
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive" 
      });
    } finally {
      setUploading(false);
    }
  };

  // ========== JOIN CHALLENGE ==========
  const joinChallenge = async (challengeId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/challenges/${challengeId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id || `anonymous_${Date.now()}`,
          username: user?.email?.split("@")[0] || "eco_warrior",
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({ 
          title: `Joined ${data.challenge.name}!`,
          description: "Your participation has been recorded"
        });
        fetchChallenges();
      }
    } catch (error) {
      console.error("Error joining challenge:", error);
    }
  };

  // ========== SHARE VIDEO ==========
  const handleShareVideo = async (videoId: string, platforms: string[]) => {
    try {
      const response = await fetch(`${API_BASE_URL}/video/${videoId}/share`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platforms,
          caption: `🌍 Check out my environmental activism video! Join #EcoPulse to make a difference! #GenZForChange`,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({ 
          title: "Video shared successfully!", 
          description: `Posted to ${platforms.join(", ")}`
        });
      }
    } catch (error) {
      console.error("Share error:", error);
      toast({ 
        title: "Error sharing video", 
        variant: "destructive" 
      });
    }
  };

  // ========== REPORT IMPACT ==========
  const handleReportImpact = async (type: string, count: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/impact/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id || `anonymous_${Date.now()}`,
          username: user?.email?.split("@")[0] || "eco_warrior",
          type, // tree_planted, cleanup_attended, petition_signed, etc
          count,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({ 
          title: "Impact recorded!", 
          description: `Your ${type.replace(/_/g, " ")} has been recorded`
        });
      }
    } catch (error) {
      console.error("Impact report error:", error);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("");
    setSelectedTemplate("");
    setSelectedChallenge("");
    setVideoFile(null);
  };

  const getPlatformIcon = (category: string | null) => {
    switch (category) {
      case "deforestation":
        return "🌳";
      case "pollution":
        return "🌊";
      case "land-grabbing":
        return "📍";
      case "challenge":
        return "🎯";
      case "education":
        return "📚";
      default:
        return "🎬";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-2">
            <Sparkles className="w-10 h-10 text-primary" />
            EcoPulse Video Creator
          </h1>
          <p className="text-muted-foreground text-lg">Create environmental awareness content for social media</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Video Upload Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Upload Video</CardTitle>
                <CardDescription>Share your environmental activism content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleUploadVideo} className="space-y-4">
                  {/* Video File Upload */}
                  <div>
                    <Label htmlFor="video">Video File *</Label>
                    <input
                      id="video"
                      type="file"
                      accept="video/*"
                      onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                      className="block w-full text-sm text-slate-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-primary file:text-primary-foreground
                        hover:file:bg-primary/90
                        cursor-pointer"
                    />
                    {videoFile && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Selected: {videoFile.name}
                      </p>
                    )}
                  </div>

                  {/* Title */}
                  <div>
                    <Label htmlFor="title">Video Title *</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Give your video a catchy title"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Add context, hashtags, or a call-to-action"
                      rows={2}
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select issue type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="deforestation">🌳 Deforestation</SelectItem>
                        <SelectItem value="pollution">🌊 Pollution</SelectItem>
                        <SelectItem value="land-grabbing">📍 Land Grabbing</SelectItem>
                        <SelectItem value="challenge">🎯 Challenge</SelectItem>
                        <SelectItem value="education">📚 Education</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Template Selection */}
                  {templates.length > 0 && (
                    <div>
                      <Label>Video Templates</Label>
                      <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a template (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          {templates.map((template) => (
                            <SelectItem key={template._id} value={template._id}>
                              {template.name} ({template.duration}s)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Challenge Selection */}
                  {challenges.length > 0 && (
                    <div>
                      <Label>Join a Challenge (optional)</Label>
                      <Select value={selectedChallenge} onValueChange={setSelectedChallenge}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a challenge" />
                        </SelectTrigger>
                        <SelectContent>
                          {challenges.map((challenge) => (
                            <SelectItem key={challenge._id} value={challenge._id}>
                              {challenge.name} ({challenge.participants} joined)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={uploading || !videoFile}
                    className="w-full"
                  >
                    {uploading ? (
                      <>
                        <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Video className="w-4 h-4 mr-2" />
                        Upload & Share
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleReportImpact("tree_planted", 1)}
                >
                  🌱 Plant Tree
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleReportImpact("cleanup_attended", 1)}
                >
                  🧹 Cleanup Event
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleReportImpact("petition_signed", 1)}
                >
                  ✍️ Sign Petition
                </Button>
              </CardContent>
            </Card>

            {/* Recent Videos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Trending Now</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-sm text-muted-foreground">Loading...</p>
                ) : videos.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No videos yet</p>
                ) : (
                  <div className="space-y-3">
                    {videos.slice(0, 5).map((video) => (
                      <div key={video._id} className="flex items-start gap-3 p-2 bg-muted rounded">
                        <span className="text-lg">{getPlatformIcon(video.category)}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{video.title}</p>
                          <p className="text-xs text-muted-foreground">
                            👁️ {video.views} | ❤️ {video.likes} | 📤 {video.shares}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Platform Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-2">
                  <p>Total Videos: <span className="font-bold">{videos.length}</span></p>
                  <p>Active Challenges: <span className="font-bold">{challenges.length}</span></p>
                  <p>Available Templates: <span className="font-bold">{templates.length}</span></p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCreator;