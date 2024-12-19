// components/LandingPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { YoutubeIcon, ChevronRight, Sparkles, Zap, BarChart } from 'lucide-react';
import { config } from '../config/config';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-gray-800 rounded-lg p-5 border border-gray-700 hover:border-blue-500/50 transition-all">
    <div className="bg-blue-600/10 w-10 h-10 rounded-lg flex items-center justify-center mb-3">
      <Icon className="w-5 h-5 text-blue-500" />
    </div>
    <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
    <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
  </div>
);

const LandingPage = () => {
  // src/components/LandingPage.js
  // src/components/LandingPage.js

  console.log('Environment variables:', {
    region: process.env.REACT_APP_REGION,
    domain: process.env.REACT_APP_COGNITO_DOMAIN,
    clientId: process.env.REACT_APP_USER_POOL_CLIENT_ID ? 'exists' : 'missing',
  });
  
  const handleSignIn = () => {
    // Construct the Cognito domain URL
    const cognitoDomain = `https://${config.COGNITO_DOMAIN}.auth.${config.REGION}.amazoncognito.com`;

    // Get the current URL for the redirect
    const redirectUri = `${window.location.origin}/auth/callback`;
    console.log('Redirect URI:', redirectUri);
    
    // Construct URL parameters
    const queryParams = new URLSearchParams({
      response_type: 'code',
      client_id: config.USER_POOL_CLIENT_ID,
      redirect_uri: redirectUri,
      scope: 'openid email profile',
      state: crypto.randomUUID(), // Add state parameter for security
    });

  // Construct the full login URL
  const loginUrl = `${cognitoDomain}/oauth2/authorize?${queryParams.toString()}`;
  
  // Log for debugging
  console.log('Login URL:', loginUrl);
  
  // Redirect to Cognito hosted UI
  window.location.assign(loginUrl);
};

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Optimization",
      description: "Our advanced AI algorithms analyze your content to generate perfectly optimized metadata that drives engagement."
    },
    {
      icon: Zap,
      title: "Instant Blog Posts",
      description: "Transform your video transcripts into SEO-optimized blog posts automatically, saving hours of work."
    },
    {
      icon: BarChart,
      title: "Performance Analytics",
      description: "Get detailed insights and actionable recommendations to improve your video's performance."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gray-900">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/5 to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_-100px,rgba(59,130,246,0.1),transparent)]"></div>
        
        <div className="container mx-auto px-4 py-10 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-500/20 mb-6">
              <YoutubeIcon className="w-4 h-4 text-red-500" />
              <span className="text-blue-500 text-sm font-medium">YouTube Content Optimization</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Transform Your Video Content
            </h1>
            
            <p className="text-lg text-gray-400 mb-8 leading-relaxed">
              Leverage AI to optimize your YouTube content, generate engaging blog posts,
              and unlock actionable insights - all from your video transcript.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button 
                onClick={handleSignIn}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg inline-flex items-center gap-2 transition-all"
              >
                Get Started <ChevronRight className="w-4 h-4" />
              </button>
              <Link 
                to="/demo" 
                className="bg-gray-800 hover:bg-gray-700 text-white font-semibold px-6 py-3 rounded-lg inline-flex items-center gap-2 transition-all"
              >
                Watch Demo
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-900 py-16 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-white mb-3">Powerful Features</h2>
            <p className="text-gray-400 text-sm max-w-xl mx-auto">
              Everything you need to optimize your YouTube content and grow your channel
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </div>

      {/* Demo Section */}
      <div className="bg-gray-950 py-16 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-white mb-3">See It In Action</h2>
            <p className="text-gray-400 text-sm max-w-xl mx-auto">
              Watch how our AI transforms your video transcript into optimized content
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Input Example */}
            <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-white text-sm">
                <span className="bg-blue-600/10 rounded-lg w-6 h-6 flex items-center justify-center text-blue-500 font-bold">1</span>
                Your Raw Transcript
              </h3>
              <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-300 h-80 overflow-y-auto border border-gray-700">
                {/* Transcript content */}
                {`Hello everyone! Today we're diving deep into React performance optimization. 
We'll cover key strategies to make your React applications lightning fast.

First, let's talk about React's virtual DOM and how it impacts performance.
Then, we'll explore practical techniques like:
- Using React.memo for component memoization
- Implementing useMemo and useCallback hooks
- Optimizing state management
- Code splitting strategies

I'll also show you some real-world examples and common pitfalls to avoid.

Stay tuned until the end where I'll share some bonus tips that could 
dramatically improve your app's performance!`}
              </div>
            </div>

            {/* Output Examples */}
            <div className="space-y-6">
              {/* Metadata Output */}
              <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
                <h3 className="font-semibold mb-3 flex items-center gap-2 text-white text-sm">
                  <span className="bg-blue-600/10 rounded-lg w-6 h-6 flex items-center justify-center text-blue-500 font-bold">2</span>
                  Optimized Metadata
                </h3>
                <div className="bg-gray-900 rounded-lg p-4 space-y-3 border border-gray-700">
                  <div>
                    <div className="text-blue-500 text-sm font-medium mb-1">Title:</div>
                    <div className="text-gray-300 text-sm">React Performance Mastery: Essential Optimization Techniques</div>
                  </div>
                  <div>
                    <div className="text-blue-500 text-sm font-medium mb-1">Description:</div>
                    <div className="text-gray-300 text-sm">
                      Master React performance optimization with our comprehensive guide! Learn essential strategies including virtual DOM optimization, React.memo usage, and advanced hook implementations.
                    </div>
                  </div>
                  <div>
                    <div className="text-blue-500 text-sm font-medium mb-1">Chapters:</div>
                    <div className="text-gray-300 text-sm space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-blue-500">0:00</span>
                        <span>Introduction</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-blue-500">2:30</span>
                        <span>Virtual DOM and Performance</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-blue-500">8:45</span>
                        <span>Component Memoization</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Blog Preview */}
              <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
                <h3 className="font-semibold mb-3 flex items-center gap-2 text-white text-sm">
                  <span className="bg-blue-600/10 rounded-lg w-6 h-6 flex items-center justify-center text-blue-500 font-bold">3</span>
                  Generated Blog Post
                </h3>
                <div className="bg-gray-900 rounded-lg p-4 space-y-3 border border-gray-700">
                  <h4 className="font-bold text-white">React Performance Mastery: Essential Optimization Techniques</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Performance optimization is crucial for modern React applications. In this comprehensive guide, we'll explore proven strategies to enhance your React app's speed and efficiency...
                  </p>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 rounded-full bg-blue-600/10 text-blue-500 text-xs">React</span>
                    <span className="px-2 py-1 rounded-full bg-blue-600/10 text-blue-500 text-xs">Performance</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/5 to-transparent"></div>
        <div className="container mx-auto px-4 text-center relative">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to Optimize Your YouTube Content?
          </h2>
          <p className="text-gray-400 mb-6 max-w-xl mx-auto">
            Transform your video transcripts into perfectly optimized content that ranks.
            Save hours of work while improving your video performance.
          </p>
          <button 
            onClick={handleSignIn}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg inline-flex items-center gap-2 transition-all"
          >
            Get Started Now <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 py-8 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <YoutubeIcon className="w-5 h-5 text-red-500" />
              <span className="text-white font-semibold">YouTube Video Optimizer</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
            </div>
            <p className="text-sm">Built with ❤️ for content creators</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;