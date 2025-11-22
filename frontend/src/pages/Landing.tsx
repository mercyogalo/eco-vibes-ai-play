import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Leaf, Users, Trophy, Video, Calendar, TrendingUp, ArrowRight, Globe, Sparkles } from "lucide-react";
import Footer from '../components/Footer';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background font-sans selection:bg-accent selection:text-accent-foreground">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20 pb-32">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 mb-8 animate-fade-in backdrop-blur-sm">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">The Future of Climate Action is Here</span>
          </div>

          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight mb-8 text-foreground">
            Eco<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Vibes</span>
            <br />
            <span className="text-4xl sm:text-5xl lg:text-6xl font-light text-muted-foreground">AI Play</span>
          </h1>

          <p className="text-xl sm:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Join the movement where <span className="text-foreground font-semibold">AI meets Nature</span>.
            Gamify your impact, create viral eco-content, and connect with Kenya's greenest community.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button onClick={() => window.location.href = '/dashboard'} size="lg" className="h-14 px-8 text-lg rounded-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all hover:scale-105">
              Start Your Journey <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button onClick={() => window.location.href = '/auth'} size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-2 hover:bg-accent/10 hover:border-accent hover:text-accent transition-all">
              Join Community
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Revolutionizing Eco-Action</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We've rebuilt environmental engagement from the ground up using cutting-edge tech.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Card className="relative h-full bg-card/50 backdrop-blur-xl border-border/50 hover:border-primary/50 transition-all duration-300 rounded-3xl overflow-hidden">
                <CardContent className="p-8">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Video className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">AI Content Creator</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Generate viral-ready eco-videos in seconds. Our AI matches your footage with trending sounds and voiceovers.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Feature 2 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Card className="relative h-full bg-card/50 backdrop-blur-xl border-border/50 hover:border-accent/50 transition-all duration-300 rounded-3xl overflow-hidden">
                <CardContent className="p-8">
                  <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Trophy className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Gamified Impact</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Level up your profile by completing daily eco-challenges. Earn badges, climb leaderboards, and win real rewards.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Feature 3 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Card className="relative h-full bg-card/50 backdrop-blur-xl border-border/50 hover:border-secondary/50 transition-all duration-300 rounded-3xl overflow-hidden">
                <CardContent className="p-8">
                  <div className="w-14 h-14 bg-secondary/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Globe className="w-7 h-7 text-secondary-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Global Connection</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Connect with eco-warriors worldwide. Share your journey, join local events, and amplify your voice.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=2574&auto=format&fit=crop')] opacity-10 bg-cover bg-center mix-blend-overlay" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="text-5xl md:text-6xl font-bold mb-2">10k+</div>
              <div className="text-primary-foreground/80 text-lg">Active Eco-Warriors</div>
            </div>
            <div>
              <div className="text-5xl md:text-6xl font-bold mb-2">50k+</div>
              <div className="text-primary-foreground/80 text-lg">Trees Planted</div>
            </div>
            <div>
              <div className="text-5xl md:text-6xl font-bold mb-2">1M+</div>
              <div className="text-primary-foreground/80 text-lg">Carbon Offset (kg)</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-5xl mx-auto bg-card border border-border rounded-[3rem] p-12 md:p-20 text-center relative shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-background/50 pointer-events-none rounded-[3rem]" />

          <h2 className="text-4xl md:text-6xl font-bold mb-8 relative z-10">Ready to Make a Difference?</h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto relative z-10">
            Join the community today and start turning your eco-actions into real-world impact.
          </p>

          <div className="relative z-10">
            <Button onClick={() => window.location.href = '/auth'} size="lg" className="h-16 px-10 text-xl rounded-full bg-foreground text-background hover:bg-foreground/90 transition-all hover:scale-105">
              Join EcoVibes Now
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
