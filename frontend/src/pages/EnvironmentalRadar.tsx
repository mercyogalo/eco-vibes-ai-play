import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, MapPin, Users, FileText } from "lucide-react";
import Navbar from "@/components/Navbar";

interface Alert {
  id: string;
  title: string;
  description: string;
  category: string;
  severity: string;
  source: string | null;
  location: string | null;
  responsible_party: string | null;
  action_needed: string | null;
  alert_date: string;
  created_at: string;
}

const EnvironmentalRadar = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, [filter]);

  const fetchAlerts = async () => {
    setLoading(true);
    let query = supabase
      .from("environmental_alerts")
      .select("*")
      .order("alert_date", { ascending: false });

    if (filter !== "all") {
      query = query.eq("category", filter);
    }

    const { data, error } = await query;
    if (!error && data) {
      setAlerts(data);
    }
    setLoading(false);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-destructive text-destructive-foreground";
      case "high": return "bg-orange-500 text-white";
      case "medium": return "bg-yellow-500 text-black";
      case "low": return "bg-blue-500 text-white";
      default: return "bg-muted";
    }
  };

  const categories = [
    { value: "all", label: "All Alerts" },
    { value: "regulation", label: "Regulations" },
    { value: "incident", label: "Incidents" },
    { value: "deforestation", label: "Deforestation" },
    { value: "pollution", label: "Pollution" },
    { value: "land_grabbing", label: "Land Grabbing" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-2">
            <AlertTriangle className="w-10 h-10 text-destructive" />
            Environmental Radar
          </h1>
          <p className="text-muted-foreground text-lg">Real-time alerts on environmental changes, incidents, and regulations</p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setFilter(cat.value)}
              className={`px-4 py-2 rounded-lg transition ${
                filter === cat.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Alerts Grid */}
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading alerts...</div>
        ) : alerts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No alerts found for this category.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {alerts.map((alert) => (
              <Card key={alert.id} className="hover:shadow-lg transition">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge className={getSeverityColor(alert.severity)}>
                      {alert.severity.toUpperCase()}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {new Date(alert.alert_date).toLocaleDateString()}
                    </span>
                  </div>
                  <CardTitle className="text-xl">{alert.title}</CardTitle>
                  <CardDescription className="text-sm capitalize">
                    {alert.category.replace("_", " ")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-1">What happened?</h4>
                    <p className="text-sm text-muted-foreground">{alert.description}</p>
                  </div>

                  {alert.location && (
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">{alert.location}</p>
                    </div>
                  )}

                  {alert.responsible_party && (
                    <div className="flex items-start gap-2">
                      <Users className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-sm">Who is responsible?</h4>
                        <p className="text-sm text-muted-foreground">{alert.responsible_party}</p>
                      </div>
                    </div>
                  )}

                  {alert.action_needed && (
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <h4 className="font-semibold text-sm mb-1 text-primary">What you can do:</h4>
                      <p className="text-sm">{alert.action_needed}</p>
                    </div>
                  )}

                  {alert.source && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <FileText className="w-3 h-3" />
                      Source: {alert.source}
                    </div>
                  )}
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