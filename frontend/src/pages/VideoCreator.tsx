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

interface VideoContent {
  id: string;
  title: string;
  description: string | null;
  video_url: string | null;
  platform: string | null;
  views: number;
  created_at: string;
}

const VideoCreator = () => {
  const [user, setUser] = useState<any>(null);
  const [videos, setVideos] = useState<VideoContent[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [platform, setPlatform] = useState("");
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    checkUser();
    fetchVideos();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ?? null);
  };

  const fetchVideos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("video_content")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setVideos(data);
    }
    setLoading(false);
  };

  const handleGenerateVideo = async () => {
    if (!user) {
      toast({ title: "Please log in to create videos", variant: "destructive" });
      return;
    }

    if (!title || !prompt) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    setGenerating(true);
    
    // Simulate AI video generation
    // In a real implementation, this would call an edge function with AI video generation
    setTimeout(async () => {
      const { error } = await supabase.from("video_content").insert({
        user_id: user.id,
        title,
        description,
        platform,
        video_url: "https://placeholder-video-url.com", // Placeholder
      });

      if (error) {
        toast({ title: "Error creating video", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Video created successfully!" });
        resetForm();
        fetchVideos();
      }
      setGenerating(false);
    }, 3000);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPlatform("");
    setPrompt("");
  };

  const videoTemplates = [
    { id: 1, name: "Climate Action Call", prompt: "Create an inspiring video about taking action against climate change" },
    { id: 2, name: "Tree Planting Challenge", prompt: "Generate a fun challenge video encouraging tree planting" },
    { id: 3, name: "Pollution Awareness", prompt: "Create an educational video about plastic pollution" },
    { id: 4, name: "Eco Tips", prompt: "Make a quick tips video for sustainable living" },
  ];

  const getPlatformIcon = (platform: string | null) => {
    switch (platform) {
      case "tiktok":
        return <Video className="w-5 h-5" />;
      case "instagram":
        return <Instagram className="w-5 h-5" />;
      case "youtube":
        return <Youtube className="w-5 h-5" />;
      default:
        return <Video className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-2">
            <Sparkles className="w-10 h-10 text-primary" />
            AI Video Creator
          </h1>
          <p className="text-muted-foreground text-lg">Generate viral awareness content for social media</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Video Creation Form */}
          <Card>
            <CardHeader>
              <CardTitle>Create New Video</CardTitle>
              <CardDescription>Use AI to generate engaging environmental content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Video Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give your video a catchy title"
                />
              </div>

              <div>
                <Label htmlFor="prompt">Content Prompt *</Label>
                <Textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe what you want the video to be about..."
                  rows={3}
                />
              </div>

              <div>
                <Label>Quick Templates</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {videoTemplates.map((template) => (
                    <Button
                      key={template.id}
                      variant="outline"
                      size="sm"
                      onClick={() => setPrompt(template.prompt)}
                      className="text-xs"
                    >
                      {template.name}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add context or hashtags"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="platform">Target Platform</Label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                    <SelectItem value="instagram">Instagram Reels</SelectItem>
                    <SelectItem value="youtube">YouTube Shorts</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleGenerateVideo}
                disabled={generating}
                className="w-full"
              >
                {generating ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Video
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Video generation takes ~30 seconds. AI will create engaging content based on your prompt.
              </p>
            </CardContent>
          </Card>

          {/* Tips & Stats */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Viral Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    1
                  </div>
                  <p>Keep it short (15-30 seconds) for maximum engagement</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    2
                  </div>
                  <p>Hook viewers in the first 3 seconds</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    3
                  </div>
                  <p>Use trending sounds and effects</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    4
                  </div>
                  <p>Include a clear call-to-action</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    5
                  </div>
                  <p>Post at peak hours (6-9 PM)</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Videos</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-sm text-muted-foreground">Loading videos...</p>
                ) : videos.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No videos yet. Create your first one!</p>
                ) : (
                  <div className="space-y-3">
                    {videos.slice(0, 3).map((video) => (
                      <div key={video.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                        <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center">
                          {getPlatformIcon(video.platform)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{video.title}</p>
                          <p className="text-xs text-muted-foreground">{video.views} views</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCreator;