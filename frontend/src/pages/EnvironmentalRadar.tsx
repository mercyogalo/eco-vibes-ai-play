import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, FileText, Video } from "lucide-react";
import api from "../utils/api";

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-2">
          <AlertTriangle className="w-10 h-10 text-destructive" />
          Environmental Radar
        </h1>
        <p className="text-muted-foreground text-lg mb-10">
          Updated environmental policies affecting Kenyan communities
        </p>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">
            Loading policies...
          </div>
        ) : policies.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p>No environmental policies found.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {policies.map((policy) => (
              <Card key={policy._id} className="hover:shadow-lg transition">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge
                      className={
                        policy.status === "NEGATIVE"
                          ? "bg-red-600 text-white"
                          : policy.status === "POSITIVE"
                          ? "bg-green-600 text-white"
                          : "bg-gray-400 text-white"
                      }
                    >
                      {policy.status || "UNKNOWN"}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {new Date(policy.date).toLocaleDateString()}
                    </span>
                  </div>

                  <CardTitle className="text-xl">{policy.title}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Summary</h4>
                    <p className="text-sm text-muted-foreground">{policy.summary}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-1">Full Content</h4>
                    <p className="text-sm text-muted-foreground line-clamp-4">
                      {policy.content}
                    </p>
                  </div>

                  {policy.videoUrl && (
                    <div>
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <Video className="w-4 h-4" /> Summary Video
                      </h4>
                      <video
                        controls
                        className="w-full rounded-lg border"
                        src={policy.videoUrl}
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <FileText className="w-3 h-3" />
                    Source: {policy.source}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnvironmentalRadar;
