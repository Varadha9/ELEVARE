import { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Target, Heart, Star, DollarSign, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

export function Ikigai() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/profile');
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const ikigaiData = profile?.ikigai || {};

  return (
    <DashboardLayout title="Ikigai Analysis">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white border-0">
          <CardContent className="py-8">
            <div className="text-center">
              <Target className="w-16 h-16 mx-auto mb-4 text-white/90" />
              <h2 className="text-3xl font-bold mb-2">Your Ikigai</h2>
              <p className="text-white/90 text-lg">Your reason for being - where passion meets purpose</p>
            </div>
          </CardContent>
        </Card>

        {/* Ikigai Diagram */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Visual Diagram */}
          <Card>
            <CardContent className="p-8">
              <div className="relative w-full aspect-square max-w-md mx-auto">
                {/* Center Circle */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="absolute inset-0 m-auto w-32 h-32 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center z-10 shadow-lg"
                >
                  <div className="text-center text-white">
                    <Lightbulb className="w-8 h-8 mx-auto mb-1" />
                    <p className="text-xs font-semibold">IKIGAI</p>
                  </div>
                </motion.div>

                {/* Four Circles */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-red-100 rounded-full flex items-center justify-center"
                >
                  <div className="text-center">
                    <Heart className="w-6 h-6 text-red-500 mx-auto mb-1" />
                    <p className="text-xs font-semibold text-red-700">What You Love</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-40 h-40 bg-blue-100 rounded-full flex items-center justify-center"
                >
                  <div className="text-center">
                    <Star className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                    <p className="text-xs font-semibold text-blue-700">What You're Good At</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-green-100 rounded-full flex items-center justify-center"
                >
                  <div className="text-center">
                    <Target className="w-6 h-6 text-green-500 mx-auto mb-1" />
                    <p className="text-xs font-semibold text-green-700">What World Needs</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-40 h-40 bg-yellow-100 rounded-full flex items-center justify-center"
                >
                  <div className="text-center">
                    <DollarSign className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
                    <p className="text-xs font-semibold text-yellow-700">What You Can Be Paid For</p>
                  </div>
                </motion.div>
              </div>
            </CardContent>
          </Card>

          {/* Ikigai Career */}
          <Card>
            <CardHeader>
              <CardTitle>Your Ikigai Career</CardTitle>
              <CardDescription>The perfect intersection of your passions and purpose</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8 bg-gradient-to-br from-primary-50 to-purple-50 rounded-xl mb-6">
                <h3 className="text-3xl font-bold text-primary mb-2">
                  {ikigaiData.career || 'Discovering...'}
                </h3>
                <Badge variant="success" className="text-sm">Perfect Match</Badge>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    <h4 className="font-semibold text-red-700">What You Love</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {ikigaiData.whatYouLove?.map((item, i) => (
                      <Badge key={i} className="bg-red-100 text-red-700">{item}</Badge>
                    )) || <p className="text-sm text-gray-600">Complete more reflections</p>}
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-5 h-5 text-blue-500" />
                    <h4 className="font-semibold text-blue-700">What You're Good At</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {ikigaiData.whatYouAreGoodAt?.map((item, i) => (
                      <Badge key={i} className="bg-blue-100 text-blue-700">{item}</Badge>
                    )) || <p className="text-sm text-gray-600">Complete more reflections</p>}
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-green-500" />
                    <h4 className="font-semibold text-green-700">What The World Needs</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {ikigaiData.whatTheWorldNeeds?.map((item, i) => (
                      <Badge key={i} className="bg-green-100 text-green-700">{item}</Badge>
                    )) || <p className="text-sm text-gray-600">Complete more reflections</p>}
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5 text-yellow-500" />
                    <h4 className="font-semibold text-yellow-700">What You Can Be Paid For</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {ikigaiData.whatYouCanBePaidFor?.map((item, i) => (
                      <Badge key={i} className="bg-yellow-100 text-yellow-700">{item}</Badge>
                    )) || <p className="text-sm text-gray-600">Complete more reflections</p>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Explanation */}
        <Card>
          <CardHeader>
            <CardTitle>Understanding Your Ikigai</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              Your Ikigai represents the sweet spot where your passions, talents, values, and economic opportunities converge. 
              Based on your reflections and behavioral analysis, we've identified <strong>{ikigaiData.career || 'your ideal career path'}</strong> as 
              your Ikigai career. This career aligns with what you love doing, what you excel at, what the world needs, and what can provide 
              you with a sustainable livelihood. Continue your daily reflections to refine this analysis further.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
