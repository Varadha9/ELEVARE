import { Link } from 'react-router-dom';
import { Sparkles, TrendingUp, Target, MessageSquare, Brain, BarChart3, ArrowRight, Check } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';

export function Home() {
  const features = [
    {
      icon: MessageSquare,
      title: 'AI-Powered Conversations',
      description: 'Natural daily interactions with an intelligent career coach that understands you'
    },
    {
      icon: Brain,
      title: 'Behavioral Analysis',
      description: 'Track 8 key traits: creativity, analytical thinking, leadership, and more'
    },
    {
      icon: Target,
      title: 'Ikigai Framework',
      description: 'Four-dimensional career framework to find your perfect path'
    },
    {
      icon: BarChart3,
      title: 'Progress Tracking',
      description: 'Real-time analytics and insights into your career discovery journey'
    },
    {
      icon: TrendingUp,
      title: 'Smart Recommendations',
      description: 'Personalized career suggestions based on longitudinal data patterns'
    },
    {
      icon: Sparkles,
      title: 'Continuous Learning',
      description: 'System improves with your feedback and interactions over time'
    }
  ];

  const benefits = [
    'Science-backed personality profiling',
    'Explainable AI recommendations',
    'Privacy-first data handling',
    'Mobile responsive design',
    'Real-time trait updates',
    'Comprehensive career database'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-lg border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-600 bg-clip-text text-transparent">
                ELEVARE
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Career Discovery</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Discover Your
              <span className="block bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Perfect Career Path
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Replace traditional one-time assessments with continuous behavioral analysis through AI-powered conversations. 
              Get personalized career recommendations based on who you truly are.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto px-8 py-4 text-lg">
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 py-4 text-lg">
                  Sign In
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Hero Image/Illustration */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16 relative"
          >
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200">
              <div className="aspect-video bg-gradient-to-br from-primary-50 to-purple-50 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <Sparkles className="w-20 h-20 text-primary mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">Interactive Dashboard Preview</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Career Discovery
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to find your perfect career path through AI-driven insights
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Why Choose ELEVARE?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Our platform combines cutting-edge AI technology with proven psychological frameworks 
                to provide the most accurate career recommendations.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-primary to-purple-600 rounded-3xl p-8 text-white"
            >
              <h3 className="text-2xl font-bold mb-4">Start Your Journey Today</h3>
              <p className="mb-6 text-white/90">
                Join thousands of users who have discovered their perfect career path through ELEVARE.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <span className="text-2xl font-bold">1</span>
                  </div>
                  <div>
                    <p className="font-semibold">Create Account</p>
                    <p className="text-sm text-white/80">Quick 2-minute signup</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <span className="text-2xl font-bold">2</span>
                  </div>
                  <div>
                    <p className="font-semibold">Chat with AI</p>
                    <p className="text-sm text-white/80">Daily 5-minute reflections</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <span className="text-2xl font-bold">3</span>
                  </div>
                  <div>
                    <p className="font-semibold">Get Recommendations</p>
                    <p className="text-sm text-white/80">Personalized career matches</p>
                  </div>
                </div>
              </div>
              <Link to="/register">
                <Button className="w-full mt-6 bg-white text-primary hover:bg-gray-100">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Discover Your Perfect Career?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Start your journey today with AI-powered career discovery
            </p>
            <Link to="/register">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 px-8 py-4 text-lg">
                Create Free Account
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">ELEVARE</span>
          </div>
          <p className="text-gray-400 mb-4">
            AI-powered career discovery platform
          </p>
          <p className="text-sm text-gray-500">
            © 2024 ELEVARE. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
