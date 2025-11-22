import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Leaf, Globe, Shield, Users, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

const Index = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.2 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 overflow-hidden">
      {/* Navbar */}
      <nav className="container mx-auto px-6 py-6 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-2 text-primary font-bold text-2xl">
          <Leaf className="w-8 h-8" />
          <span>EcoPulse</span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link to="/auth">
            <Button variant="ghost" className="text-foreground hover:text-primary">Login</Button>
          </Link>
          <Link to="/auth">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 md:py-32 relative">
        <div className="absolute top-0 right-0 -z-10 opacity-10">
          <Leaf className="w-[600px] h-[600px] text-primary rotate-12" />
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="max-w-4xl mx-auto text-center space-y-8"
        >
          <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-tight">
            Empowering Kenya for a <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Greener Future</span>
          </motion.h1>

          <motion.p variants={fadeIn} className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Join the movement. Track environmental impact, report violations, and connect with a community dedicated to conservation.
          </motion.p>

          <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/auth">
              <Button size="lg" className="text-lg px-8 py-6 rounded-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all">
                Start Your Journey <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/video-creator">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 rounded-full border-primary text-primary hover:bg-primary/10">
                <Play className="mr-2 w-5 h-5" /> Watch Demo
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-card border-border border-y border-border">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { label: "Active Guardians", value: "2,500+", icon: Users },
              { label: "Protected Acres", value: "15,000+", icon: Shield },
              { label: "Reports Resolved", value: "850+", icon: Globe },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="p-6 rounded-2xl bg-card shadow-sm border border-border/50 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-primary/10 rounded-full text-primary">
                    <stat.icon className="w-8 h-8" />
                  </div>
                </div>
                <h3 className="text-4xl font-bold text-foreground mb-2">{stat.value}</h3>
                <p className="text-muted-foreground font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="py-24 container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Tools for Change</h2>
          <p className="text-lg text-muted-foreground">Everything you need to make a difference, all in one platform.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: "AI Assistant", desc: "Get instant answers on environmental laws and conservation tips.", color: "bg-blue-500/10 text-blue-600" },
            { title: "Eco Radar", desc: "Real-time tracking of environmental threats and news.", color: "bg-red-500/10 text-red-600" },
            { title: "Community Hub", desc: "Connect with local activists and join events.", color: "bg-green-500/10 text-green-600" },
            { title: "Impact Tracker", desc: "Visualize your contribution to a greener planet.", color: "bg-purple-500/10 text-purple-600" },
            { title: "Video Creator", desc: "Share your story with powerful video tools.", color: "bg-orange-500/10 text-orange-600" },
            { title: "Policy Watch", desc: "Stay updated on the latest environmental regulations.", color: "bg-teal-500/10 text-teal-600" },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-8 rounded-3xl bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 container mx-auto px-6 mb-20">
        <div className="bg-primary rounded-[3rem] p-12 md:p-24 text-center text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] opacity-10 bg-cover bg-center" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold">Ready to make an impact?</h2>
            <p className="text-primary-foreground/90 text-xl">Join thousands of Kenyans protecting our heritage today.</p>
            <Link to="/auth">
              <Button size="lg" variant="secondary" className="text-lg px-10 py-6 rounded-full shadow-xl hover:scale-105 transition-transform">
                Join EcoPulse Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
