import React from "react";
import Footer from "../components/Footer";

export default function TermsOfService() {
  return (
    <>
      <div className="max-w-4xl mx-auto py-16 px-6 space-y-12">
        <h1 className="text-4xl font-extrabold text-green-800 mb-6 text-center">
          Terms of Service
        </h1>

        <p className="text-lg text-gray-700 leading-relaxed">
          Welcome to <span className="font-semibold">EcoVibes</span>. By accessing or using our platform, you agree to comply with and be bound by these Terms of Service. Please read carefully, as they explain your rights, responsibilities, and how our platform works.
        </p>

        <section className="bg-green-50 p-6 rounded-lg shadow-sm">
          <h2 className="font-bold text-xl text-green-900 mb-2">Acceptance of Terms</h2>
          <p className="text-gray-700 leading-relaxed">
            By using <span className="font-semibold">EcoVibes</span> (the “Service”), you agree to these Terms of Service and our Privacy Policy. If you do not agree, you should not use our platform.
          </p>
        </section>

        <section className="bg-green-50 p-6 rounded-lg shadow-sm">
          <h2 className="font-bold text-xl text-green-900 mb-2">What EcoVibes Does</h2>
          <p className="text-gray-700 leading-relaxed">
            EcoVibes helps users create and share environmental awareness content, educational materials, and sustainability-focused videos using AI. It may connect with platforms like TikTok for sharing or login functionality.
          </p>
        </section>

        <section className="bg-green-50 p-6 rounded-lg shadow-sm">
          <h2 className="font-bold text-xl text-green-900 mb-2">Your Responsibilities</h2>
          <p className="text-gray-700 leading-relaxed">
            You agree to use the Service responsibly. Do not upload harmful content, violate intellectual property rights, or use the platform for illegal activities. You are responsible for all content you create and share.
          </p>
        </section>

        <section className="bg-green-50 p-6 rounded-lg shadow-sm">
          <h2 className="font-bold text-xl text-green-900 mb-2">AI-Generated Content</h2>
          <p className="text-gray-700 leading-relaxed">
            EcoVibes uses AI to generate ideas, summaries, videos, and descriptions. AI may have errors or limitations, so review any output before sharing or publishing it.
          </p>
        </section>

        <section className="bg-green-50 p-6 rounded-lg shadow-sm">
          <h2 className="font-bold text-xl text-green-900 mb-2">Third-Party Integrations</h2>
          <p className="text-gray-700 leading-relaxed">
            Our platform may integrate with TikTok and other services. Use of those platforms is subject to their own policies and Terms of Service.
          </p>
        </section>

        <section className="bg-green-50 p-6 rounded-lg shadow-sm">
          <h2 className="font-bold text-xl text-green-900 mb-2">Data and Privacy</h2>
          <p className="text-gray-700 leading-relaxed">
            EcoVibes collects minimal information such as your name, email, and content preferences to operate the platform. We do not sell or share personal information with unauthorized parties. See our Privacy Policy for full details.
          </p>
        </section>

        <section className="bg-green-50 p-6 rounded-lg shadow-sm">
          <h2 className="font-bold text-xl text-green-900 mb-2">Intellectual Property</h2>
          <p className="text-gray-700 leading-relaxed">
            All branding, logos, and platform features belong to EcoVibes. Users keep rights to content they create. Do not copy, resell, or distribute our platform without permission.
          </p>
        </section>

        <section className="bg-green-50 p-6 rounded-lg shadow-sm">
          <h2 className="font-bold text-xl text-green-900 mb-2">Account Termination</h2>
          <p className="text-gray-700 leading-relaxed">
            EcoVibes may suspend or terminate accounts that violate these Terms or engage in harmful activity.
          </p>
        </section>

        <section className="bg-green-50 p-6 rounded-lg shadow-sm">
          <h2 className="font-bold text-xl text-green-900 mb-2">Changes to Terms</h2>
          <p className="text-gray-700 leading-relaxed">
            We may update these Terms occasionally. If we make changes, you will be notified and given the choice to continue using the platform or stop. It’s entirely up to you.
          </p>
        </section>

        <section className="bg-green-50 p-6 rounded-lg shadow-sm">
          <h2 className="font-bold text-xl text-green-900 mb-2">Contact Us</h2>
          <p className="text-gray-700 leading-relaxed">
            If you have any questions about these Terms, reach out to us at: <br />
            <span className="font-semibold">support@ecovibes.com</span> <br />
            <span className="font-semibold">Nairobi, Kenya</span>
          </p>
        </section>
      </div>

      <Footer />
    </>
  );
}
