import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function TermsConditionsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms and Conditions</h1>
          
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Effective Date:</strong> 14 August 2023
            </p>
            
            <p className="mb-6">
              Welcome to CorestoneGrader. These Terms and Conditions ("Terms") govern your use of our AI-powered 
              essay grading platform and services.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. ACCEPTANCE OF TERMS</h2>
            
            <p className="mb-6">
              By accessing or using CorestoneGrader services, you agree to be bound by these Terms and our 
              Privacy Policy. If you do not agree to these Terms, you may not use our services.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. DESCRIPTION OF SERVICE</h2>
            
            <p className="mb-6">
              CorestoneGrader is an AI-powered platform that provides automated essay grading and feedback 
              services specifically designed for International Baccalaureate (IB) Extended Essays, Theory 
              of Knowledge (TOK) Essays, and TOK Exhibitions.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. USER ACCOUNTS</h2>
            
            <p className="mb-4">You are responsible for:</p>
            <ul className="list-disc list-inside mb-6 space-y-2">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Providing accurate and complete information</li>
              <li>Notifying us immediately of any unauthorized use</li>
            </ul>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. PAYMENT AND BILLING</h2>
            
            <p className="mb-4">Our credit-based system includes:</p>
            <ul className="list-disc list-inside mb-6 space-y-2">
              <li>One free essay grading for new users</li>
              <li>Various credit packages available for purchase</li>
              <li>Credits are non-refundable once purchased</li>
              <li>Custom pricing available for enterprise users</li>
            </ul>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. ACADEMIC INTEGRITY</h2>
            
            <p className="mb-6">
              Our service is designed to assist with learning and improvement without compromising academic 
              integrity. Users are responsible for ensuring their use of our service complies with their 
              institution's academic policies.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. INTELLECTUAL PROPERTY</h2>
            
            <p className="mb-6">
              You retain ownership of your essay content. We retain ownership of our grading algorithms, 
              rubrics, and platform technology. You grant us a limited license to process your essays 
              for grading purposes.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. LIMITATION OF LIABILITY</h2>
            
            <p className="mb-6">
              Our grading service is provided as an educational tool. While we strive for accuracy, 
              we make no guarantees about grading results. Users should not rely solely on our 
              assessments for final academic submissions.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. TERMINATION</h2>
            
            <p className="mb-6">
              We may terminate or suspend your account for violation of these Terms. You may terminate 
              your account at any time. Unused credits are non-refundable upon termination.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. CHANGES TO TERMS</h2>
            
            <p className="mb-6">
              We reserve the right to modify these Terms at any time. Continued use of our service 
              after changes constitutes acceptance of the new Terms.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. CONTACT INFORMATION</h2>
            
            <p className="mb-6">
              For questions about these Terms, please contact us at:
            </p>
            
            <div className="bg-gray-100 rounded-lg p-4">
              <p className="font-semibold">CorestoneGrader Ltd</p>
              <p>Email: contact@corestone.education</p>
              <p>Phone: 1902 707 6700</p>
              <p>Address: 71-75 Shelton Street, London, WC2H 9JQ</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}