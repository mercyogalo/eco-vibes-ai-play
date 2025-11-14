import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

const Community = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState("");
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
      fetchPosts();
    });
  }, [navigate]);

  const fetchPosts = async () => {
    const { data } = await supabase
      .from("community_posts")
      .select(`
        *,
        profiles (full_name, avatar_url)
      `)
      .order("created_at", { ascending: false })
      .limit(20);

    setPosts(data || []);
  };

  const handleCreatePost = async () => {
    if (!userId || !newPost.trim()) return;
    setLoading(true);

    try {
      const { error } = await supabase
        .from("community_posts")
        .insert({
          user_id: userId,
          content: newPost,
        });

      if (error) throw error;

      setNewPost("");
      toast({ title: "Post Created!", description: "Your post has been shared with the community." });
      fetchPosts();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from("post_likes")
        .insert({ post_id: postId, user_id: userId });

      if (error) throw error;

      await supabase
        .from("community_posts")
        .update({ likes_count: posts.find(p => p.id === postId).likes_count + 1 })
        .eq("id", postId);

      fetchPosts();
      toast({ title: "Liked!" });
    } catch (error: any) {
      // Already liked or error
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Community Feed</h1>
          <p className="text-muted-foreground">Share your eco-journey and inspire others</p>
        </div>

        {/* Create Post */}
        <Card className="mb-6 border-border">
          <CardContent className="pt-6">
            <Textarea
              placeholder="Share your eco-achievement or thoughts..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              rows={3}
              className="mb-3"
            />
            <Button
              onClick={handleCreatePost}
              disabled={loading || !newPost.trim()}
              className="bg-primary hover:bg-primary/90"
            >
              <Send className="w-4 h-4 mr-2" />
              Post
            </Button>
          </CardContent>
        </Card>

        {/* Posts */}
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id} className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {post.profiles?.full_name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-card-foreground">{post.profiles?.full_name || "Anonymous"}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-card-foreground mb-4 whitespace-pre-wrap">{post.content}</p>
                <div className="flex items-center space-x-6 text-muted-foreground">
                  <button
                    onClick={() => handleLike(post.id)}
                    className="flex items-center space-x-1 hover:text-destructive transition"
                  >
                    <Heart className="w-5 h-5" />
                    <span>{post.likes_count}</span>
                  </button>
                  <button className="flex items-center space-x-1 hover:text-primary transition">
                    <MessageCircle className="w-5 h-5" />
                    <span>{post.comments_count}</span>
                  </button>
                  <button className="flex items-center space-x-1 hover:text-accent transition">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Community;
