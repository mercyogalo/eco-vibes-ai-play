import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2, Send, Users, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

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

      // Optimistic update
      setPosts(posts.map(p =>
        p.id === postId ? { ...p, likes_count: (p.likes_count || 0) + 1 } : p
      ));

      await supabase
        .from("community_posts")
        .update({ likes_count: posts.find(p => p.id === postId).likes_count + 1 })
        .eq("id", postId);

      toast({ title: "Liked!" });
    } catch (error: any) {
      // Already liked or error
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Users className="w-8 h-8 text-primary" />
            Community Hub
          </h1>
          <p className="text-muted-foreground">Connect, share, and inspire change.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Create Post */}
          <Card className="border-border bg-white/50 backdrop-blur-sm shadow-sm">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <Avatar>
                  <AvatarFallback className="bg-primary/10 text-primary">ME</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-4">
                  <Textarea
                    placeholder="Share your eco-achievement or thoughts..."
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    rows={3}
                    className="bg-transparent border-border/50 focus:border-primary resize-none"
                  />
                  <div className="flex justify-end">
                    <Button
                      onClick={handleCreatePost}
                      disabled={loading || !newPost.trim()}
                      className="bg-primary hover:bg-primary/90 rounded-full px-6"
                    >
                      {loading ? "Posting..." : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Post
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Posts Feed */}
          <div className="space-y-4">
            <AnimatePresence>
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="border-border/50 hover:border-primary/20 transition-colors bg-white/80 backdrop-blur-sm">
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={post.profiles?.avatar_url} />
                          <AvatarFallback className="bg-secondary text-secondary-foreground">
                            {post.profiles?.full_name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-sm text-foreground">{post.profiles?.full_name || "Anonymous"}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-foreground/90 whitespace-pre-wrap text-sm leading-relaxed">{post.content}</p>

                      <div className="flex items-center space-x-6 pt-4 border-t border-border/30">
                        <button
                          onClick={() => handleLike(post.id)}
                          className="flex items-center space-x-2 text-muted-foreground hover:text-red-500 transition-colors group"
                        >
                          <div className="p-2 rounded-full group-hover:bg-red-500/10 transition-colors">
                            <Heart className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-medium">{post.likes_count || 0}</span>
                        </button>

                        <button className="flex items-center space-x-2 text-muted-foreground hover:text-blue-500 transition-colors group">
                          <div className="p-2 rounded-full group-hover:bg-blue-500/10 transition-colors">
                            <MessageCircle className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-medium">{post.comments_count || 0}</span>
                        </button>

                        <button className="flex items-center space-x-2 text-muted-foreground hover:text-green-500 transition-colors group ml-auto">
                          <div className="p-2 rounded-full group-hover:bg-green-500/10 transition-colors">
                            <Share2 className="w-4 h-4" />
                          </div>
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Sidebar / Trending */}
        <div className="hidden lg:block space-y-6">
          <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-border/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Trending Topics</h3>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {["#ClimateAction", "#NairobiCleanup", "#TreePlanting", "#SayNoToPlastic", "#Wildlife"].map(tag => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <h3 className="font-semibold text-sm">Community Guidelines</h3>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                <li>Be respectful and kind</li>
                <li>Share verified information</li>
                <li>Focus on environmental solutions</li>
                <li>No hate speech or harassment</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Community;
