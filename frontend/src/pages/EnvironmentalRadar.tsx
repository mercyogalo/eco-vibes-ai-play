import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, FileText, Video, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import api from "../utils/api";
import { motion } from "framer-motion";

interface Policy {
  _id: string;
  title: string;
  content: string;
  summary: string;
  videoUrl: string;
  date: string;
  source: string;
  status: string; // "POSITIVE" | "NEGATIVE" | "UNKNOWN"
}

const EnvironmentalRadar = () => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    setLoading(true);
    try {
      const res = await api.get("/policies/");
      const data = await res.data;
      if (Array.isArray(data)) {
        setPolicies(
          data.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
        );
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
    setLoading(false);
  };

  const filteredPolicies = policies.filter(policy =>
    policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    policy.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <AlertTriangle className="w-8 h-8 text-primary" />
            Environmental Radar
          </h1>
          <p className="text-muted-foreground">Real-time tracking of environmental policies and alerts.</p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search alerts..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : filteredPolicies.length === 0 ? (
        <Card className="bg-muted/50 border-dashed">
          <CardContent className="py-12 text-center">
            <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-muted-foreground">No environmental alerts found matching your criteria.</p>
          </CardContent>
        </Card>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
        >
          {filteredPolicies.map((policy) => (
            <motion.div key={policy._id} variants={item}>
              <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-300 border-border/50 bg-white/50 backdrop-blur-sm group">
                <CardHeader className="space-y-4">
                  <div className="flex justify-between items-start gap-2">
                    <Badge
                      className={
                        policy.status === "NEGATIVE"
                          ? "bg-red-500/10 text-red-600 hover:bg-red-500/20 border-red-200"
                          : policy.status === "POSITIVE"
                            ? "bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-200"
                            : "bg-gray-500/10 text-gray-600 hover:bg-gray-500/20 border-gray-200"
                      }
                      variant="outline"
                    >
                      {policy.status || "UNKNOWN"}
                    </Badge>
                    <span className="text-xs text-muted-foreground whitespace-nowrap bg-secondary/20 px-2 py-1 rounded-full">
                      {new Date(policy.date).toLocaleDateString()}
                    </span>
                  </div>

                  <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                    {policy.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4 flex-1 flex flex-col">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                      {policy.summary}
                    </p>

                    {policy.videoUrl && (
                      <div className="rounded-lg overflow-hidden border border-border bg-black/5 aspect-video mb-4 relative group/video">
                        <video
                          controls
                          className="w-full h-full object-cover"
                          src={policy.videoUrl}
                        />
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      <span className="truncate max-w-[150px]">{policy.source}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 text-xs">
                      Read More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default EnvironmentalRadar;
