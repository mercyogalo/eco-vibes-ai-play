import React from "react";
import Footer from "../components/Footer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Lock, Eye, Share2, UserCheck, Globe } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1">
        <div className="max-w-4xl mx-auto py-16 px-6 space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-extrabold text-primary mb-2">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground text-lg">
              Last Updated: November 16, 2025
            </p>
            <p className="text-foreground text-lg leading-relaxed max-w-2xl mx-auto">
              <span className="font-semibold text-primary">EcoPulse</span> values your privacy. This policy explains how we protect your data while you protect the planet.
            </p>
          </div>

          <div className="grid gap-8">
            <Card className="border-border/50 bg-card border-border">
              <CardContent className="p-8 space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Eye className="w-6 h-6" />
                  </div>
                  <h2 className="font-bold text-xl text-foreground">Information We Collect</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  We collect only what's necessary to empower your eco-journey:
                </p>
                <ul className="grid gap-3 mt-2 text-muted-foreground">
                  <li className="flex gap-2"><span className="font-semibold text-foreground">Personal Info:</span> Name, email, and contact details for your account.</li>
                  <li className="flex gap-2"><span className="font-semibold text-foreground">Content Data:</span> Your reports, videos, and posts shared on the platform.</li>
                  <li className="flex gap-2"><span className="font-semibold text-foreground">Usage Data:</span> How you interact with our features to help us improve.</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card border-border">
              <CardContent className="p-8 space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Shield className="w-6 h-6" />
                  </div>
                  <h2 className="font-bold text-xl text-foreground">How We Use Your Data</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Your data fuels the movement. We use it to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-2">
                  <li>Provide, maintain, and enhance the EcoPulse platform.</li>
                  <li>Personalize your experience and recommend relevant eco-actions.</li>
                  <li>Connect you with local events and community initiatives.</li>
                  <li>Analyze impact metrics to show collective progress.</li>
                </ul>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-border/50 bg-card border-border">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Share2 className="w-5 h-5" />
                    </div>
                    <h2 className="font-bold text-lg text-foreground">Data Sharing</h2>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    We do not sell your data. We only share it with service providers who help us operate, or when you explicitly choose to share content publicly.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card border-border">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <h2 className="font-bold text-lg text-foreground">Your Rights</h2>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    You have full control. Access, update, or delete your data anytime. Manage your preferences in your profile settings.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-border/50 bg-card border-border">
              <CardContent className="p-8 space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Globe className="w-6 h-6" />
                  </div>
                  <h2 className="font-bold text-xl text-foreground">Contact Us</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Questions about your privacy? We're here to help.
                </p>
                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <p className="text-foreground font-medium">Email: <span className="text-primary">privacy@ecopulse.com</span></p>
                  <p className="text-foreground font-medium">Location: <span className="text-muted-foreground">Nairobi, Kenya</span></p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
