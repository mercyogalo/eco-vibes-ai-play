import React from "react";
import Footer from "../components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, CheckCircle, AlertTriangle, Users, ShieldAlert, HelpCircle } from "lucide-react";

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <div className="flex-1">
                <div className="max-w-4xl mx-auto py-16 px-6 space-y-12">
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl font-extrabold text-primary mb-2">
                            Terms of Service
                        </h1>
                        <p className="text-foreground text-lg leading-relaxed max-w-2xl mx-auto">
                            Welcome to <span className="font-semibold text-primary">EcoPulse</span>. By joining our community, you agree to these terms designed to keep our platform safe and impactful.
                        </p>
                    </div>

                    <div className="grid gap-8">
                        <Card className="border-border/50 bg-white/50 backdrop-blur-sm">
                            <CardContent className="p-8 space-y-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                        <CheckCircle className="w-6 h-6" />
                                    </div>
                                    <h2 className="font-bold text-xl text-foreground">Acceptance of Terms</h2>
                                </div>
                                <p className="text-muted-foreground leading-relaxed">
                                    By accessing or using EcoPulse, you agree to be bound by these Terms and our Privacy Policy. If you disagree with any part, you may not use our services.
                                </p>
                            </CardContent>
                        </Card>

                        <div className="grid md:grid-cols-2 gap-6">
                            <Card className="border-border/50 bg-white/50 backdrop-blur-sm">
                                <CardContent className="p-6 space-y-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                            <Users className="w-5 h-5" />
                                        </div>
                                        <h2 className="font-bold text-lg text-foreground">User Conduct</h2>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        You agree to use EcoPulse responsibly. Do not post harmful content, spam, or misinformation. Respect the community and the environment.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-border/50 bg-white/50 backdrop-blur-sm">
                                <CardContent className="p-6 space-y-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <h2 className="font-bold text-lg text-foreground">Content Ownership</h2>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        You retain rights to the content you create. By posting, you grant EcoPulse a license to use, display, and distribute your content on the platform.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        <Card className="border-border/50 bg-white/50 backdrop-blur-sm">
                            <CardContent className="p-8 space-y-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                        <AlertTriangle className="w-6 h-6" />
                                    </div>
                                    <h2 className="font-bold text-xl text-foreground">AI & Third-Party Content</h2>
                                </div>
                                <p className="text-muted-foreground leading-relaxed">
                                    EcoPulse uses AI to assist in content creation. While we strive for accuracy, AI-generated content may have limitations. Always verify important information. We also integrate with third-party services like TikTok, which have their own terms.
                                </p>
                            </CardContent>
                        </Card>

                        <div className="grid md:grid-cols-2 gap-6">
                            <Card className="border-border/50 bg-white/50 backdrop-blur-sm">
                                <CardContent className="p-6 space-y-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                            <ShieldAlert className="w-5 h-5" />
                                        </div>
                                        <h2 className="font-bold text-lg text-foreground">Termination</h2>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        We reserve the right to suspend or terminate accounts that violate these terms or engage in harmful behavior towards the platform or community.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-border/50 bg-white/50 backdrop-blur-sm">
                                <CardContent className="p-6 space-y-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                            <HelpCircle className="w-5 h-5" />
                                        </div>
                                        <h2 className="font-bold text-lg text-foreground">Contact & Updates</h2>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        We may update these terms. Continued use implies acceptance. Contact us at <span className="text-primary font-medium">support@ecopulse.com</span> for questions.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
