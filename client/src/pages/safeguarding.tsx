import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function SafeguardingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Safeguarding</h1>
          
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Effective Date:</strong> 14 August 2023
            </p>
            
            <p className="mb-6">
              At CorestoneGrader, we are committed to safeguarding and promoting the welfare of all users, 
              particularly students who use our educational services.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Our Commitment</h2>
            
            <p className="mb-6">
              We believe that all students have the right to learn in a safe, supportive environment that 
              promotes their academic integrity and personal development.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Data Protection and Privacy</h2>
            
            <ul className="list-disc list-inside mb-6 space-y-2">
              <li>All student essays and personal data are handled in accordance with GDPR and UK Data Protection Act 2018</li>
              <li>Essay content is processed securely and not shared with unauthorized parties</li>
              <li>We maintain strict confidentiality of all academic work submitted to our platform</li>
              <li>Data is encrypted both in transit and at rest</li>
            </ul>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Academic Integrity</h2>
            
            <p className="mb-4">Our service is designed to support learning while maintaining academic integrity:</p>
            <ul className="list-disc list-inside mb-6 space-y-2">
              <li>We provide feedback and guidance to help students improve their work</li>
              <li>Our grading is intended as a learning tool, not a replacement for institutional assessment</li>
              <li>We encourage students to use our feedback to develop their own understanding</li>
              <li>Students remain responsible for ensuring their work meets institutional requirements</li>
            </ul>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Content Safety</h2>
            
            <p className="mb-4">We monitor content to ensure a safe learning environment:</p>
            <ul className="list-disc list-inside mb-6 space-y-2">
              <li>Automated systems scan for inappropriate content</li>
              <li>We have procedures for reporting and addressing concerning material</li>
              <li>All staff involved in content review receive appropriate training</li>
              <li>We maintain clear guidelines on acceptable use of our platform</li>
            </ul>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">User Safety</h2>
            
            <p className="mb-4">We prioritize the safety and wellbeing of our users:</p>
            <ul className="list-disc list-inside mb-6 space-y-2">
              <li>Clear terms of service and community guidelines</li>
              <li>Secure authentication and account protection measures</li>
              <li>Regular security updates and monitoring</li>
              <li>Transparent communication about any security incidents</li>
            </ul>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Reporting Concerns</h2>
            
            <p className="mb-6">
              If you have any safeguarding concerns or wish to report inappropriate content or behavior, 
              please contact us immediately:
            </p>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-red-800 mb-2">Emergency Contact</h3>
              <p className="text-red-700">For urgent safeguarding concerns: contact@corestone.education</p>
              <p className="text-red-700">Phone: 1902 707 6700</p>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Training and Support</h2>
            
            <p className="mb-4">Our team receives regular training on:</p>
            <ul className="list-disc list-inside mb-6 space-y-2">
              <li>Safeguarding best practices</li>
              <li>Data protection and privacy requirements</li>
              <li>Recognizing and responding to concerns</li>
              <li>Supporting student welfare and academic integrity</li>
            </ul>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Continuous Improvement</h2>
            
            <p className="mb-6">
              We regularly review and update our safeguarding policies and procedures to ensure they 
              remain effective and aligned with best practices and legal requirements.
            </p>
            
            <div className="mt-12 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Questions or Concerns?</h3>
              <p className="text-blue-700">
                Contact our safeguarding team at: contact@corestone.education
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}