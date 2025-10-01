import { BookOpen, Zap, Shield, Users, Code, Database } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Product Data Explorer</h1>
          <p className="text-xl text-gray-600">
            A production-minded product exploration platform powered by live scraping
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 mb-4">
              Product Data Explorer is designed to provide users with a seamless way to discover and explore 
              products from World of Books. Our platform combines modern web technologies with ethical scraping 
              practices to deliver real-time, accurate product information.
            </p>
            <p className="text-gray-600">
              We believe in respecting website resources while providing valuable data to users, implementing 
              proper rate limiting, caching, and following robots.txt guidelines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center mb-4">
                <Zap className="h-8 w-8 text-blue-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">Live Data</h3>
              </div>
              <p className="text-gray-600">
                Real-time scraping ensures you always have the most up-to-date product information, 
                prices, and availability from World of Books.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center mb-4">
                <Shield className="h-8 w-8 text-green-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">Ethical Scraping</h3>
              </div>
              <p className="text-gray-600">
                We implement responsible scraping practices with proper delays, rate limiting, 
                and respect for website resources and terms of service.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center mb-4">
                <Users className="h-8 w-8 text-purple-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">User-Focused</h3>
              </div>
              <p className="text-gray-600">
                Built with accessibility in mind, our platform provides an intuitive experience 
                across all devices with proper keyboard navigation and screen reader support.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center mb-4">
                <Database className="h-8 w-8 text-orange-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">Smart Caching</h3>
              </div>
              <p className="text-gray-600">
                Intelligent caching strategies reduce load on target websites while ensuring 
                fast response times and fresh data when needed.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Technology Stack</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Frontend</h3>
                <ul className="text-gray-600 space-y-1">
                  <li>• Next.js 14 with App Router</li>
                  <li>• TypeScript for type safety</li>
                  <li>• Tailwind CSS for styling</li>
                  <li>• SWR for data fetching</li>
                  <li>• Responsive design</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Backend</h3>
                <ul className="text-gray-600 space-y-1">
                  <li>• NestJS framework</li>
                  <li>• PostgreSQL database</li>
                  <li>• Crawlee + Playwright</li>
                  <li>• Queue system for jobs</li>
                  <li>• Rate limiting & caching</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact & Support</h2>
            <p className="text-gray-600 mb-4">
              Have questions or feedback? We'd love to hear from you!
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="mailto:contact@example.com"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Code className="h-5 w-5 mr-2" />
                Contact Us
              </a>
              <a
                href="https://github.com"
                className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <BookOpen className="h-5 w-5 mr-2" />
                View Source
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}