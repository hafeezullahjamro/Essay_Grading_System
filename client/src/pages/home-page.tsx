import { motion } from "framer-motion";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";

export default function HomePage() {
  const { user } = useAuth();
  
  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <svg
              className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
              fill="currentColor"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <polygon points="50,0 100,0 50,100 0,100" />
            </svg>

            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <motion.h1 
                  className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="block xl:inline">Grade EE & TOK/Exhibition essays instantly</span>{" "}
                  <span className="block text-primary xl:inline">with CorestoneGrader</span>
                </motion.h1>
                <motion.p 
                  className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Save hours with our advanced AI-powered essay grading platform specially designed for IB. 
                  Get detailed feedback, scores, and improvement suggestions in seconds without affecting your academic integrity.
                </motion.p>
                <motion.div 
                  className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <div className="rounded-md shadow">
                    <Link href={user ? "/dashboard" : "/auth"}>
                      <a className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-emerald-500 hover:bg-emerald-600 md:py-4 md:text-lg md:px-10">
                        Get started
                      </a>
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <a
                      href="#features"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-primary/10 hover:bg-primary/20 md:py-4 md:text-lg md:px-10"
                    >
                      Learn more
                    </a>
                  </div>
                </motion.div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="https://images.unsplash.com/photo-1571260899304-425eee4c7efc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
            alt="Education workspace"
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Smart IBDP Core Grading & Feedback
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Our AI-powered platform streamlines the grading process with accurate, consistent, and detailed feedback without affecting your academic integrity.
            </p>
          </div>

          <div className="mt-10">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <motion.div 
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                    <i className="fas fa-bolt"></i>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Instant EE/TOK Grading</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Get detailed essay feedback in seconds, not days. Save hours of manual grading time.
                </dd>
              </motion.div>

              <motion.div 
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                    <i className="fas fa-chart-bar"></i>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Comprehensive Analysis</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Evaluate grammar, structure, content, and critical thinking with customizable rubrics.
                </dd>
              </motion.div>

              <motion.div 
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                    <i className="fas fa-comments"></i>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Detailed Feedback</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Provide students with actionable suggestions for improvement and personalized comments according to IB rubrics.
                </dd>
              </motion.div>

              <motion.div 
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                    <i className="fas fa-lock"></i>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Secure & Private</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Your data is encrypted and secure. We never store essays longer than necessary.
                </dd>
              </motion.div>
            </dl>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-gray-100 py-12" id="pricing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Pricing</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Simple, Transparent Pricing
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Pay only for what you need with our flexible credit packages.
            </p>
          </div>

          <div className="mt-10 space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {/* Single Essay */}
            <motion.div 
              className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-xl font-semibold text-gray-900">Single EE/TOK Essay</h3>
              <p className="mt-4 text-gray-500">Perfect for trying out the service</p>
              <p className="mt-8 text-4xl font-extrabold text-gray-900">Free</p>
              <p className="mt-2 text-sm text-gray-500">for new users</p>
              <ul className="mt-6 space-y-4 flex-1">
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <i className="fas fa-check text-green-500"></i>
                  </div>
                  <p className="ml-3 text-sm text-gray-700">1 essay credit</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <i className="fas fa-check text-green-500"></i>
                  </div>
                  <p className="ml-3 text-sm text-gray-700">Full detailed feedback</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <i className="fas fa-check text-green-500"></i>
                  </div>
                  <p className="ml-3 text-sm text-gray-700">Score breakdown</p>
                </li>
              </ul>
              <Link href={user ? "/dashboard" : "/auth"}>
                <a className="mt-8 block w-full bg-gray-100 border border-gray-300 rounded-md py-2 text-sm font-medium text-gray-700 text-center hover:bg-gray-200">
                  Get Started
                </a>
              </Link>
            </motion.div>

            {/* 5 Essays */}
            <motion.div 
              className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 flex flex-col relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="absolute top-0 right-0 -mt-3 mr-4 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium">
                Popular
              </div>
              <h3 className="text-xl font-semibold text-gray-900">5 Essay Pack</h3>
              <p className="mt-4 text-gray-500">Best value for occasional use</p>
              <p className="mt-8 text-4xl font-extrabold text-gray-900">$5.00</p>
              <p className="mt-2 text-sm text-gray-500">$1.00 per essay</p>
              <ul className="mt-6 space-y-4 flex-1">
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <i className="fas fa-check text-green-500"></i>
                  </div>
                  <p className="ml-3 text-sm text-gray-700"><span className="font-medium">6 essay credits</span> (1 bonus)</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <i className="fas fa-check text-green-500"></i>
                  </div>
                  <p className="ml-3 text-sm text-gray-700">Full detailed feedback</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <i className="fas fa-check text-green-500"></i>
                  </div>
                  <p className="ml-3 text-sm text-gray-700">Score breakdown</p>
                </li>
              </ul>
              <Link href={user ? "/dashboard" : "/auth"}>
                <a className="mt-8 block w-full bg-primary border border-transparent rounded-md py-2 text-sm font-medium text-white text-center hover:bg-primary/90">
                  Get Started
                </a>
              </Link>
            </motion.div>

            {/* 10 Essays */}
            <motion.div 
              className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-xl font-semibold text-gray-900">10 Essay Pack</h3>
              <p className="mt-4 text-gray-500">Ideal for regular grading needs</p>
              <p className="mt-8 text-4xl font-extrabold text-gray-900">$8.50</p>
              <p className="mt-2 text-sm text-gray-500">$0.85 per essay</p>
              <ul className="mt-6 space-y-4 flex-1">
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <i className="fas fa-check text-green-500"></i>
                  </div>
                  <p className="ml-3 text-sm text-gray-700"><span className="font-medium">12 essay credits</span> (2 bonus)</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <i className="fas fa-check text-green-500"></i>
                  </div>
                  <p className="ml-3 text-sm text-gray-700">Full detailed feedback</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <i className="fas fa-check text-green-500"></i>
                  </div>
                  <p className="ml-3 text-sm text-gray-700">Score breakdown</p>
                </li>
              </ul>
              <Link href={user ? "/dashboard" : "/auth"}>
                <a className="mt-8 block w-full bg-gray-100 border border-gray-300 rounded-md py-2 text-sm font-medium text-gray-700 text-center hover:bg-gray-200">
                  Get Started
                </a>
              </Link>
            </motion.div>

            {/* Unlimited Monthly */}
            <motion.div 
              className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="text-xl font-semibold text-gray-900">Unlimited Monthly</h3>
              <p className="mt-4 text-gray-500">For power users and institutions</p>
              <p className="mt-8 text-4xl font-extrabold text-gray-900">$15.00</p>
              <p className="mt-2 text-sm text-gray-500">per month</p>
              <ul className="mt-6 space-y-4 flex-1">
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <i className="fas fa-check text-green-500"></i>
                  </div>
                  <p className="ml-3 text-sm text-gray-700"><span className="font-medium">Unlimited</span> essay grading</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <i className="fas fa-check text-green-500"></i>
                  </div>
                  <p className="ml-3 text-sm text-gray-700">Priority processing</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <i className="fas fa-check text-green-500"></i>
                  </div>
                  <p className="ml-3 text-sm text-gray-700">Advanced analytics</p>
                </li>
              </ul>
              <Link href={user ? "/dashboard" : "/auth"}>
                <a className="mt-8 block w-full bg-gray-100 border border-gray-300 rounded-md py-2 text-sm font-medium text-gray-700 text-center hover:bg-gray-200">
                  Get Started
                </a>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
