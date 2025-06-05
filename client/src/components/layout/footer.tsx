import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Column */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href="https://www.corestonetutors.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base text-gray-600 hover:text-gray-900"
                >
                  Corestone Tutors
                </a>
              </li>
              <li>
                <a 
                  href="https://www.corestonespeakers.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base text-gray-600 hover:text-gray-900"
                >
                  Corestone Speakers
                </a>
              </li>
              <li>
                <a 
                  href="https://www.corestonechat.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base text-gray-600 hover:text-gray-900"
                >
                  Corestone Chat
                </a>
              </li>
              <li>
                <a 
                  href="https://www.corestoneart.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base text-gray-600 hover:text-gray-900"
                >
                  Corestone Art
                </a>
              </li>
            </ul>
            <div className="mt-6">
              <p className="text-xs text-gray-500">
                Copyright 2025 Corestone Education Ltd.
              </p>
            </div>
          </div>

          {/* Empty columns to maintain layout */}
          <div></div>
          <div></div>

          {/* Logo and Contact Info Column */}
          <div className="flex flex-col items-end">
            <div className="mb-4">
              <div className="text-2xl font-bold text-primary">
                CorestoneGrader
              </div>
            </div>
            
            <div className="text-right mb-4 space-y-2">
              <p className="text-sm text-gray-600">
                contact@corestone.education
              </p>
              <p className="text-sm text-gray-600">
                1902 707 6700
              </p>
            </div>

            {/* Social Media Icons */}
            <div className="flex space-x-3 mb-6">
              <a 
                href="#" 
                className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white hover:bg-green-600"
                aria-label="WhatsApp"
              >
                <i className="fab fa-whatsapp text-sm"></i>
              </a>
              <a 
                href="#" 
                className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white hover:bg-pink-600"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram text-sm"></i>
              </a>
              <a 
                href="#" 
                className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-600"
                aria-label="LinkedIn"
              >
                <i className="fab fa-linkedin-in text-sm"></i>
              </a>
            </div>

            {/* Legal Links */}
            <div className="flex flex-col space-y-2 text-right">
              <Link href="/privacy-policy">
                <a className="text-sm text-gray-500 hover:text-gray-700">
                  Privacy Policy
                </a>
              </Link>
              <Link href="/terms-conditions">
                <a className="text-sm text-gray-500 hover:text-gray-700">
                  Terms and Conditions
                </a>
              </Link>
              <Link href="/safeguarding">
                <a className="text-sm text-gray-500 hover:text-gray-700">
                  Safeguarding
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
