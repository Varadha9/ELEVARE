import { Link } from 'react-router-dom';
import { Sparkles, TrendingUp, Target, MessageSquare, Brain, BarChart3, ArrowRight, Check, Star } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';

const features = [
  { icon: MessageSquare, title: 'AI-Powered Conversations', description: 'Natural daily interactions with an intelligent career coach that understands you', color: 'bg-indigo-100 text-indigo-600' },
  { icon: Brain,         title: 'Behavioral Analysis',     description: 'Track 8 key traits: creativity, analytical thinking, leadership, and more',  color: 'bg-purple-100 text-purple-600' },
  { icon: Target,        title: 'Ikigai Framework',        description: 'Four-dimensional career framework to find your perfect path',                  color: 'bg-pink-100 text-pink-600' },
  { icon: BarChart3,     title: 'Progress Tracking',       description: 'Real-time analytics and insights into your career discovery journey',          color: 'bg-blue-100 text-blue-600' },
  { icon: TrendingUp,    title: 'Smart Recommendations',   description: 'Personalized career suggestions based on longitudinal data patterns',          color: 'bg-emerald-100 text-emerald-600' },
  { icon: Sparkles,      title: 'Continuous Learning',     description: 'System improves with your feedback and interactions over time',                color: 'bg-amber-100 text-amber-600' },
];

const benefits = [
  'Science-backed Big Five personality profiling',
  'Explainable AI — know why each career is suggested',
  'Privacy-first: your data stays secure',
  'Mobile responsive on all devices',
  'Real-time trait updates after every chat',
  'Comprehensive database of 50+ careers',
];

const steps = [
  { n: '1', title: 'Create Account', sub: 'Quick 2-minute signup' },
  { n: '2', title: 'Chat with AI',   sub: 'Daily 5-minute reflections' },
  { n: '3', title: 'Get Matches',    sub: 'Personalized career results' },
];

/* ── Mini dashboard mockup shown in hero ── */
function DashboardMockup() {
  const bars = [
    { label: 'Creativity',   w: 'w-4/5',  color: 'bg-purple-400' },
    { label: 'Leadership',   w: 'w-3/5',  color: 'bg-indigo-400' },
    { label: 'Empathy',      w: 'w-2/3',  color: 'bg-pink-400' },
    { label: 'Analytical',   w: 'w-3/4',  color: 'bg-blue-400' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden select-none">
      {/* Fake browser bar */}
      <div className="bg-gray-100 px-4 py-2.5 flex items-center gap-2 border-b border-gray-200">
        <span className="w-3 h-3 rounded-full bg-red-400" />
        <span className="w-3 h-3 rounded-full bg-yellow-400" />
        <span className="w-3 h-3 rounded-full bg-green-400" />
        <div className="ml-3 flex-1 bg-white rounded-md px-3 py-1 text-xs text-gray-400 border border-gray-200">
          elevare.app/dashboard
        </div>
      </div>

      <div className="flex h-56">
        {/* Fake sidebar */}
        <div className="w-14 bg-slate-900 flex flex-col items-center py-4 gap-3">
          {[BarChart3, MessageSquare, Brain, Target, TrendingUp].map((Icon, i) => (
            <div key={i} className={`w-8 h-8 rounded-lg flex items-center justify-center ${i === 0 ? 'bg-indigo-500' : 'bg-slate-700'}`}>
              <Icon className="w-4 h-4 text-white" />
            </div>
          ))}
        </div>

        {/* Fake content */}
        <div className="flex-1 bg-slate-50 p-4 space-y-3">
          {/* Welcome strip */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl p-3 text-white">
            <p className="text-xs font-semibold">Welcome back, Varad 👋</p>
            <p className="text-[10px] opacity-80">You've completed 12 reflections</p>
          </div>

          {/* Trait bars */}
          <div className="bg-white rounded-xl p-3 shadow-sm">
            <p className="text-[10px] font-semibold text-gray-500 mb-2">BEHAVIORAL TRAITS</p>
            <div className="space-y-1.5">
              {bars.map(b => (
                <div key={b.label} className="flex items-center gap-2">
                  <span className="text-[9px] text-gray-500 w-14 shrink-0">{b.label}</span>
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${b.w} ${b.color} rounded-full`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Career chip */}
          <div className="bg-white rounded-xl p-3 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold text-gray-500">TOP MATCH</p>
              <p className="text-xs font-bold text-gray-800">UX Designer</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">92%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Nav */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-lg border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-indigo-700 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-indigo-700 bg-clip-text text-transparent">
              ELEVARE
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login"><Button variant="ghost">Sign In</Button></Link>
            <Link to="/register"><Button>Get Started</Button></Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full mb-6">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-semibold text-primary">AI-Powered Career Discovery</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Discover Your
              <span className="block bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Perfect Career
              </span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Replace one-time assessments with continuous behavioral analysis through AI conversations.
              Get career recommendations based on who you truly are.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Free <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">Sign In</Button>
              </Link>
            </div>
            {/* Social proof */}
            <div className="flex items-center gap-3 mt-8">
              <div className="flex -space-x-2">
                {['bg-indigo-400','bg-purple-400','bg-pink-400','bg-blue-400'].map((c,i) => (
                  <div key={i} className={`w-8 h-8 rounded-full ${c} border-2 border-white flex items-center justify-center`}>
                    <span className="text-white text-xs font-bold">{String.fromCharCode(65+i)}</span>
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_,i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-xs text-gray-500">Loved by 500+ students</p>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.15 }}>
            <DashboardMockup />
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Powerful features to guide your career discovery journey
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 bg-white"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits + Steps */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose ELEVARE?</h2>
            <p className="text-gray-600 mb-8">
              Cutting-edge AI combined with proven psychological frameworks for the most accurate career guidance.
            </p>
            <div className="space-y-3">
              {benefits.map((b, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-emerald-600" />
                  </div>
                  <span className="text-sm text-gray-700">{b}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}
            className="bg-gradient-to-br from-primary to-purple-600 rounded-3xl p-8 text-white"
          >
            <h3 className="text-2xl font-bold mb-2">Get Started in 3 Steps</h3>
            <p className="text-white/80 text-sm mb-8">Your career clarity is just minutes away</p>
            <div className="space-y-5">
              {steps.map((s, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-xl font-bold">{s.n}</span>
                  </div>
                  <div>
                    <p className="font-semibold">{s.title}</p>
                    <p className="text-sm text-white/75">{s.sub}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/register">
              <Button className="w-full mt-8 bg-white text-primary hover:bg-gray-50">
                Create Free Account <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary to-purple-600">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            <h2 className="text-4xl font-bold text-white mb-4">Ready to Find Your Path?</h2>
            <p className="text-white/85 mb-8">Join students who've discovered their perfect career with ELEVARE</p>
            <Link to="/register">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-50">
                Start Your Journey <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-10 px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-7 h-7 bg-gradient-to-br from-primary to-indigo-700 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold">ELEVARE</span>
        </div>
        <p className="text-slate-400 text-sm mb-1">AI-powered career discovery platform</p>
        <p className="text-slate-500 text-xs">© 2024 ELEVARE. MIT License.</p>
      </footer>
    </div>
  );
}
