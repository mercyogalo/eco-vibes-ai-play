import React from "react";
import Footer from "../components/Footer";

const PrivacyPolicy = () => {
  return (
    <>
      <div className="max-w-4xl mx-auto py-16 px-6 space-y-12">
        <h1 className="text-4xl font-extrabold text-green-800 text-center mb-6">
          Privacy Policy
        </h1>

        <p className="text-gray-700 text-lg leading-relaxed">
          Last Updated: November 16, 2025
        </p>

        <p className="text-gray-700 text-lg leading-relaxed">
          <span className="font-semibold">EcoVibes</span> (“we”, “our”, “us”) values your privacy. This Privacy Policy explains how we collect, use, and protect your personal information when you use our website and services. We aim to make it simple and clear for everyone.
        </p>

        <section className="bg-green-50 p-6 rounded-lg shadow-sm">
          <h2 className="font-bold text-xl text-green-900 mb-2">Information We Collect</h2>
          <p className="text-gray-700 leading-relaxed">
            We collect only the information necessary to provide our services. This includes:
          </p>
          <ul className="list-disc list-inside mt-2 text-gray-700 leading-relaxed space-y-1">
            <li><strong>Personal Information:</strong> Name, email address, and contact details when you sign up or reach out to us.</li>
            <li><strong>Content Data:</strong> Photos, short videos, text reports, or AI-generated content you upload.</li>
            <li><strong>Usage Data:</strong> IP address, browser type, device info, and interactions with our platform.</li>
            <li><strong>Cookies & Tracking:</strong> We use cookies and similar tech to improve your experience and analyze usage.</li>
          </ul>
        </section>

        <section className="bg-green-50 p-6 rounded-lg shadow-sm">
          <h2 className="font-bold text-xl text-green-900 mb-2">How We Use Your Information</h2>
          <p className="text-gray-700 leading-relaxed">
            Your data helps us operate and improve EcoVibes. We use it to:
          </p>
          <ul className="list-disc list-inside mt-2 text-gray-700 leading-relaxed space-y-1">
            <li>Provide and maintain the platform and services.</li>
            <li>Respond to inquiries and send important updates.</li>
            <li>Improve content, features, and user experience.</li>
            <li>Personalize content and recommendations for you.</li>
            <li>Comply with legal obligations.</li>
          </ul>
        </section>

        <section className="bg-green-50 p-6 rounded-lg shadow-sm">
          <h2 className="font-bold text-xl text-green-900 mb-2">Sharing Your Information</h2>
          <p className="text-gray-700 leading-relaxed">
            We respect your privacy and do not sell your data. We may share information with:
          </p>
          <ul className="list-disc list-inside mt-2 text-gray-700 leading-relaxed space-y-1">
            <li>Service providers who help operate our platform.</li>
            <li>Legal authorities if required by law.</li>
            <li>Other users when you submit public content like photos, videos, or reports.</li>
          </ul>
        </section>

        <section className="bg-green-50 p-6 rounded-lg shadow-sm">
          <h2 className="font-bold text-xl text-green-900 mb-2">Security</h2>
          <p className="text-gray-700 leading-relaxed">
            We use reasonable technical and organizational measures to protect your information. However, no method of internet transmission or storage is 100% secure.
          </p>
        </section>

        <section className="bg-green-50 p-6 rounded-lg shadow-sm">
          <h2 className="font-bold text-xl text-green-900 mb-2">Your Choices</h2>
          <p className="text-gray-700 leading-relaxed">
            You have control over your data:
          </p>
          <ul className="list-disc list-inside mt-2 text-gray-700 leading-relaxed space-y-1">
            <li>Update or delete your account information anytime.</li>
            <li>Opt out of marketing emails.</li>
            <li>Manage cookies via your browser settings.</li>
          </ul>
        </section>

        <section className="bg-green-50 p-6 rounded-lg shadow-sm">
          <h2 className="font-bold text-xl text-green-900 mb-2">Children’s Privacy</h2>
          <p className="text-gray-700 leading-relaxed">
            EcoVibes is not intended for children under 13. We do not knowingly collect personal information from children.
          </p>
        </section>

        <section className="bg-green-50 p-6 rounded-lg shadow-sm">
          <h2 className="font-bold text-xl text-green-900 mb-2">Third-Party Services</h2>
          <p className="text-gray-700 leading-relaxed">
            We may use third-party services like TikTok API, AI tools, analytics, or cloud hosting. These services have their own privacy practices, so please review them as well.
          </p>
        </section>

        <section className="bg-green-50 p-6 rounded-lg shadow-sm">
          <h2 className="font-bold text-xl text-green-900 mb-2">Changes to This Privacy Policy</h2>
          <p className="text-gray-700 leading-relaxed">
            We may update this Privacy Policy from time to time. If changes occur, you will be notified and given the choice to continue using the platform or stop. The choice is yours.
          </p>
        </section>

        <section className="bg-green-50 p-6 rounded-lg shadow-sm">
          <h2 className="font-bold text-xl text-green-900 mb-2">Contact Us</h2>
          <p className="text-gray-700 leading-relaxed">
            Questions? Reach out to us at: <br />
            <span className="font-semibold">Email:</span> support@ecovibes.com <br />
            <span className="font-semibold">Location:</span> Nairobi, Kenya
          </p>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default PrivacyPolicy;
