import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Leaf, Users, Trophy, Video, Calendar, TrendingUp } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-secondary py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptMCAxMmMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-20" />
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 animate-fade-in">
            Welcome to EcoVibes
          </h1>
          <p className="text-xl sm:text-2xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto">
            Empowering Young Kenyans to Take Climate Action Through AI, Gamification, and Community
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => window.location.href = '/dashboard'} size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 py-6">
              Start Learning
            </Button>
            <Button onClick={() => window.location.href = '/auth'} size="lg" variant="outline" className="bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20 text-lg px-8 py-6">
              Login / Signup
            </Button>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-foreground mb-4 text-center">The Challenge</h2>
          <p className="text-xl text-muted-foreground mb-12 text-center max-w-3xl mx-auto">
            Young people in Kenya face critical barriers to environmental engagement
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center mb-4">
                  <Leaf className="w-6 h-6 text-destructive" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-card-foreground">Awareness Gap</h3>
                <p className="text-muted-foreground">
                  Limited environmental education and awareness about climate change impacts in Kenya
                </p>
              </CardContent>
            </Card>
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-destructive" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-card-foreground">Low Engagement</h3>
                <p className="text-muted-foreground">
                  Young people lack accessible, engaging platforms to participate in climate action
                </p>
              </CardContent>
            </Card>
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-destructive" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-card-foreground">Untapped Influence</h3>
                <p className="text-muted-foreground">
                  Social media influence for climate awareness remains largely underutilized
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-foreground mb-4 text-center">Our Solution</h2>
          <p className="text-xl text-muted-foreground mb-12 text-center max-w-3xl mx-auto">
            EcoVibes combines cutting-edge technology with community engagement
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-primary/20 hover:border-primary/40 transition-colors hover:shadow-lg">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Video className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-card-foreground">AI-Powered Videos</h3>
                <p className="text-muted-foreground">
                  Personalized video content with voice narration and trending sounds for viral sharing
                </p>
              </CardContent>
            </Card>
            <Card className="border-primary/20 hover:border-primary/40 transition-colors hover:shadow-lg">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center mb-4">
                  <Trophy className="w-6 h-6 text-secondary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-card-foreground">Gamification</h3>
                <p className="text-muted-foreground">
                  Earn points, badges, and achievements while learning about climate action
                </p>
              </CardContent>
            </Card>
            <Card className="border-primary/20 hover:border-primary/40 transition-colors hover:shadow-lg">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-card-foreground">Real-Life Events</h3>
                <p className="text-muted-foreground">
                  Join tree planting, trash picking, and workshops in Nairobi to make real impact
                </p>
              </CardContent>
            </Card>
            <Card className="border-primary/20 hover:border-primary/40 transition-colors hover:shadow-lg">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-card-foreground">Community Feed</h3>
                <p className="text-muted-foreground">
                  Connect with eco-champions, share achievements, and inspire each other
                </p>
              </CardContent>
            </Card>
            <Card className="border-primary/20 hover:border-primary/40 transition-colors hover:shadow-lg">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-secondary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-card-foreground">Social Sharing</h3>
                <p className="text-muted-foreground">
                  Share directly to TikTok, Instagram, and Twitter with trending hashtags
                </p>
              </CardContent>
            </Card>
            <Card className="border-primary/20 hover:border-primary/40 transition-colors hover:shadow-lg">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Leaf className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-card-foreground">EcoChallenges</h3>
                <p className="text-muted-foreground">
                  Track daily eco-actions like walking and cycling, compete with friends
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-secondary/20 to-accent/10">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-foreground mb-4">The Impact</h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            Making climate education fun, viral, and actionable
          </p>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-card rounded-lg p-8 shadow-lg border border-border">
              <div className="text-5xl font-bold text-primary mb-2">Fun</div>
              <p className="text-muted-foreground">Learning through games, challenges, and rewards</p>
            </div>
            <div className="bg-card rounded-lg p-8 shadow-lg border border-border">
              <div className="text-5xl font-bold text-secondary-foreground mb-2">Viral</div>
              <p className="text-muted-foreground">Social sharing amplifies your environmental message</p>
            </div>
            <div className="bg-card rounded-lg p-8 shadow-lg border border-border">
              <div className="text-5xl font-bold text-accent mb-2">Actionable</div>
              <p className="text-muted-foreground">Real events and challenges create tangible impact</p>
            </div>
          </div>
          <Button onClick={() => window.location.href = '/auth'} size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-12 py-6">
            Join EcoVibes Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-lg mb-2">EcoVibes - Empowering Climate Action in Kenya</p>
          <p className="text-sm text-primary-foreground/70">© 2024 EcoVibes. Making the planet greener, one action at a time.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
