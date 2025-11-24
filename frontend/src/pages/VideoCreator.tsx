import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Video, Sparkles, TrendingUp, Upload, PlayCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

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
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    checkUser();
    fetchVideos();
    fetchChallenges();
    fetchTemplates();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const userData = session?.user ?? null;
    setUser(userData);
  };

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

  const handleUploadVideo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!videoFile) {
      toast({ title: "Please select a video file", variant: "destructive" });
      return;
    }

    if (!title || !category) {
      toast({ title: "Please fill in title and category", variant: "destructive" });
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
      formData.append("hashtags", JSON.stringify(["#EcoPulse", `#${category}`, "#GenZActivism"]));

      if (selectedChallenge) {
        formData.append("challengeId", selectedChallenge);
      }

      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        toast({ title: "Video uploaded successfully!", description: "Your video is ready for sharing" });
        resetForm();
        fetchVideos();
      } else {
        toast({ title: "Upload failed", description: data.error || "Unknown error", variant: "destructive" });
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({ title: "Error uploading video", description: "Could not connect to server", variant: "destructive" });
    } finally {
      setUploading(false);
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
      case "deforestation": return "🌳";
      case "pollution": return "🌊";
      case "land-grabbing": return "📍";
      case "challenge": return "🎯";
      case "education": return "📚";
      default: return "🎬";
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-primary" />
            Video Creator Studio
          </h1>
          <p className="text-muted-foreground">Create, edit, and share impactful environmental stories.</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Video Upload Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          <Card className="border-border bg-card border-border shadow-sm">
            <CardHeader>
              <CardTitle>Upload New Content</CardTitle>
              <CardDescription>Share your voice with the world</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleUploadVideo} className="space-y-6">
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer relative">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center gap-2">
                    <div className="p-4 bg-primary/10 rounded-full text-primary">
                      <Upload className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {videoFile ? videoFile.name : "Drag & drop or click to upload"}
                      </p>
                      <p className="text-sm text-muted-foreground">MP4, MOV up to 50MB</p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Video title"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add context and hashtags..."
                    rows={3}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {templates.length > 0 && (
                    <div className="space-y-2">
                      <Label>Template (Optional)</Label>
                      <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select style" />
                        </SelectTrigger>
                        <SelectContent>
                          {templates.map((t) => (
                            <SelectItem key={t._id} value={t._id}>{t.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {challenges.length > 0 && (
                    <div className="space-y-2">
                      <Label>Challenge (Optional)</Label>
                      <Select value={selectedChallenge} onValueChange={setSelectedChallenge}>
                        <SelectTrigger>
                          <SelectValue placeholder="Join challenge" />
                        </SelectTrigger>
                        <SelectContent>
                          {challenges.map((c) => (
                            <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={uploading || !videoFile}
                  className="w-full bg-primary hover:bg-primary/90 h-12 text-lg"
                >
                  {uploading ? (
                    <>
                      <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Video className="w-5 h-5 mr-2" />
                      Upload & Share
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Trending Videos */}
          <Card className="border-border/50 bg-card border-border h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Trending Now
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />)}
                </div>
              ) : videos.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No trending videos yet.</p>
              ) : (
                <div className="space-y-4">
                  {videos.slice(0, 5).map((video) => (
                    <div key={video._id} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border/50 hover:shadow-md transition-all cursor-pointer group">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                        {getPlatformIcon(video.category)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">{video.title}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                          <span className="flex items-center gap-1"><PlayCircle className="w-3 h-3" /> {video.views}</span>
                          <span>•</span>
                          <span>{video.username}</span>
                        </div>
                      </div>
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

export default VideoCreator;