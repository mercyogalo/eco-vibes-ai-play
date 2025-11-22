import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Camera, ThumbsUp, MapPin, Calendar, Plus, X, AlertTriangle, Filter } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";

interface Report {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  image_urls: string[] | null;
  video_url: string | null;
  status: string;
  upvotes: number;
  created_at: string;
  profiles?: {
    full_name: string | null;
  };
}

const EcoExposed = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    checkUser();
    fetchReports();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ?? null);
  };

  const fetchReports = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("eco_reports")
      .select(`
        *,
        profiles:user_id (full_name)
      `)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setReports(data);
    }
    setLoading(false);
  };

  const handleSubmitReport = async () => {
    if (!user) {
      toast({ title: "Please log in to submit a report", variant: "destructive" });
      return;
    }

    if (!title || !description || !category || !location) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("eco_reports").insert({
      user_id: user.id,
      title,
      description,
      category,
      location,
      image_urls: imageUrls.length > 0 ? imageUrls : null,
      video_url: videoUrl || null,
    });

    if (error) {
      toast({ title: "Error submitting report", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Report submitted successfully!" });
      setIsDialogOpen(false);
      resetForm();
      fetchReports();
    }
    setSubmitting(false);
  };

  const handleUpvote = async (reportId: string) => {
    if (!user) {
      toast({ title: "Please log in to verify reports", variant: "destructive" });
      return;
    }

    const { error } = await supabase.from("report_verifications").insert({
      report_id: reportId,
      user_id: user.id,
      verified: true,
    });

    if (error) {
      if (error.code === "23505") {
        toast({ title: "You've already verified this report" });
      } else {
        toast({ title: "Error verifying report", variant: "destructive" });
      }
    } else {
      toast({ title: "Thank you for verifying!" });
      fetchReports();
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("");
    setLocation("");
    setImageUrls([]);
    setVideoUrl("");
  };

  const addImageUrl = () => {
    setImageUrls([...imageUrls, ""]);
  };

  const updateImageUrl = (index: number, value: string) => {
    const newUrls = [...imageUrls];
    newUrls[index] = value;
    setImageUrls(newUrls);
  };

  const removeImageUrl = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified": return "bg-green-500/10 text-green-600 border-green-200";
      case "rejected": return "bg-red-500/10 text-red-600 border-red-200";
      default: return "bg-yellow-500/10 text-yellow-600 border-yellow-200";
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Camera className="w-8 h-8 text-primary" />
            EcoExposed
          </h1>
          <p className="text-muted-foreground">Community-driven environmental monitoring.</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-destructive hover:bg-destructive/90 text-white shadow-lg hover:shadow-xl transition-all">
              <Plus className="w-4 h-4 mr-2" />
              Report Issue
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Report Environmental Issue</DialogTitle>
              <DialogDescription>
                Help expose environmental problems in your community. Your report matters.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Brief title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="land_grabbing">Land Grabbing</SelectItem>
                      <SelectItem value="pollution">Pollution</SelectItem>
                      <SelectItem value="illegal_logging">Illegal Logging</SelectItem>
                      <SelectItem value="government_irregularity">Government Irregularity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Where is this happening?"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what's happening in detail..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Evidence (Images)</Label>
                {imageUrls.map((url, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={url}
                      onChange={(e) => updateImageUrl(index, e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeImageUrl(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addImageUrl} className="w-full border-dashed">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Image URL
                </Button>
              </div>

              <Button onClick={handleSubmitReport} disabled={submitting} className="w-full bg-primary hover:bg-primary/90">
                {submitting ? "Submitting..." : "Submit Report"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Reports Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-80 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : reports.length === 0 ? (
        <Card className="bg-muted/30 border-dashed">
          <CardContent className="py-12 text-center">
            <Camera className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-muted-foreground">No reports yet. Be the first to report an issue!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {reports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-300 border-border/50 bg-card border-border">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge className={getStatusColor(report.status)} variant="outline">
                        {report.status}
                      </Badge>
                      <Badge variant="secondary" className="capitalize bg-secondary/20 text-secondary-foreground hover:bg-secondary/30">
                        {report.category.replace("_", " ")}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg line-clamp-1">{report.title}</CardTitle>
                    <CardDescription className="text-xs flex items-center gap-1">
                      <span>by {report.profiles?.full_name || "Anonymous"}</span>
                      <span>•</span>
                      <span>{new Date(report.created_at).toLocaleDateString()}</span>
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4 flex-1 flex flex-col">
                    <p className="text-sm text-muted-foreground line-clamp-3 flex-1">{report.description}</p>

                    {report.image_urls && report.image_urls.length > 0 && (
                      <div className="grid grid-cols-2 gap-2">
                        {report.image_urls.slice(0, 2).map((url, idx) => (
                          <div key={idx} className="aspect-video rounded-md overflow-hidden bg-muted">
                            <img
                              src={url}
                              alt={`Evidence ${idx + 1}`}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate max-w-[120px]">{report.location}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-8 gap-2 ${report.status === 'verified' ? 'text-green-600' : ''}`}
                        onClick={() => handleUpvote(report.id)}
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span>Verify ({report.upvotes})</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default EcoExposed;