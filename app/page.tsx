import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="glass mx-4 mt-4 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold">⚡</span>
            </div>
            <span className="text-xl font-bold">APIHawk</span>
          </div>
          <Link href="/dashboard" className="btn-secondary">
            Dashboard
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="space-y-6">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
            Know when your APIs break
          </h1>
          <h2 className="text-5xl font-bold">
            before your users do
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Simple, powerful API monitoring. Track uptime, response times, and get instant status badges for your endpoints.
          </p>
          <div className="pt-8">
            <Link href="/dashboard" className="btn-primary text-lg">
              Start Monitoring Free
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="status-card">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold mb-2">Multi-Endpoint Monitoring</h3>
            <p className="text-gray-400">
              Track multiple API endpoints from a single dashboard. Add unlimited endpoints and monitor them all in real-time.
            </p>
          </div>
          
          <div className="status-card">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-2">Response Time Tracking</h3>
            <p className="text-gray-400">
              Get detailed insights into your API performance. See average response times and uptime percentages at a glance.
            </p>
          </div>
          
          <div className="status-card">
            <div className="text-4xl mb-4">🏷️</div>
            <h3 className="text-xl font-bold mb-2">Status Badges</h3>
            <p className="text-gray-400">
              Embed beautiful status badges in your README. Show your API health to users with shields.io-style badges.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">Simple Pricing</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="status-card">
            <h3 className="text-2xl font-bold mb-2">Free</h3>
            <div className="text-4xl font-bold mb-4">$0<span className="text-xl text-gray-400">/mo</span></div>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Up to 5 endpoints
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Response time tracking
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Status badges
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Basic analytics
              </li>
            </ul>
            <Link href="/dashboard" className="btn-secondary w-full mt-8 block text-center">
              Get Started
            </Link>
          </div>

          <div className="status-card border-2 border-red-500/50">
            <div className="absolute top-4 right-4">
              <span className="bg-gradient-to-r from-red-600 to-orange-600 text-xs font-bold px-3 py-1 rounded-full">
                POPULAR
              </span>
            </div>
            <h3 className="text-2xl font-bold mb-2">Pro</h3>
            <div className="text-4xl font-bold mb-4">$15<span className="text-xl text-gray-400">/mo</span></div>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Unlimited endpoints
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Advanced analytics
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Custom check intervals
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Priority support
              </li>
            </ul>
            <button className="btn-primary w-full mt-8">
              Upgrade to Pro
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-500">
        <p>© 2026 APIHawk. Built for the Hackathon.</p>
      </footer>
    </div>
  );
}
