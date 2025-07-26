import React from 'react';
import { Brain, Target, Shield, Users, Award, TrendingUp } from 'lucide-react';

const AboutPage: React.FC = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Our advanced machine learning algorithms analyze thousands of data points to identify high-probability trading opportunities.',
      color: 'from-primary-500 to-primary-600'
    },
    {
      icon: Target,
      title: 'Proven Strategies',
      description: 'We focus on time-tested patterns like VCP and IPO base setups that have historically shown strong performance.',
      color: 'from-secondary-500 to-secondary-600'
    },
    {
      icon: Shield,
      title: 'Risk Management',
      description: 'Every prediction comes with detailed risk analysis and proper stop-loss recommendations.',
      color: 'from-success-500 to-success-600'
    }
  ];

  const stats = [
    { number: '85%', label: 'Prediction Accuracy' },
    { number: '500+', label: 'Stocks Analyzed' },
    { number: '10K+', label: 'Active Users' },
    { number: '24/7', label: 'Market Monitoring' }
  ];

  const team = [
    {
      name: 'Rajesh Kumar',
      role: 'Founder & CEO',
      description: '15+ years in algorithmic trading and quantitative analysis.',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      name: 'Priya Sharma',
      role: 'Head of AI/ML',
      description: 'PhD in Machine Learning, former Goldman Sachs quantitative researcher.',
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      name: 'Amit Patel',
      role: 'Chief Technology Officer',
      description: '12+ years building high-frequency trading systems and financial platforms.',
      image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold">
              About Stock Sensing
            </h1>
            <p className="text-xl md:text-2xl text-neutral-200 max-w-4xl mx-auto leading-relaxed">
              We're revolutionizing stock market predictions using advanced AI and proven technical analysis 
              to help investors make smarter decisions.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900">
                Our Mission
              </h2>
              <p className="text-lg text-neutral-600 leading-relaxed">
                At Stock Sensing, we believe that everyone should have access to institutional-grade 
                stock analysis and predictions. Our mission is to democratize sophisticated trading 
                strategies and make them accessible to retail investors.
              </p>
              <p className="text-lg text-neutral-600 leading-relaxed">
                By combining cutting-edge artificial intelligence with time-tested technical analysis 
                patterns, we provide actionable insights that help our users identify stocks with 
                high probability of generating 5-10% returns within 5-10 days.
              </p>
            </div>
            <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-primary-600 mb-2">
                      {stat.number}
                    </div>
                    <div className="text-sm text-neutral-600">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900">
              What Makes Us Different
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Our unique approach combines advanced technology with proven market strategies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-neutral-200 p-8 hover:shadow-xl transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900">
              Meet Our Team
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Led by experienced professionals from top financial institutions and tech companies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-neutral-50 rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300"
              >
                <div className="space-y-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto object-cover"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-neutral-900">
                      {member.name}
                    </h3>
                    <p className="text-primary-600 font-medium">
                      {member.role}
                    </p>
                  </div>
                  <p className="text-neutral-600 leading-relaxed">
                    {member.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900">
              Our Methodology
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              A systematic approach to identifying high-probability trading opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-semibold">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                    Data Collection & Processing
                  </h3>
                  <p className="text-neutral-600">
                    We continuously monitor price movements, volume patterns, fundamental data, 
                    and market sentiment across 500+ Indian stocks.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-semibold">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                    Pattern Recognition
                  </h3>
                  <p className="text-neutral-600">
                    Our AI algorithms identify VCP (Volatility Contraction Pattern) and IPO base 
                    setups with high statistical significance.
                  </p>
                
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-semibold">
                  3
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                    Risk Assessment
                  </h3>
                  <p className="text-neutral-600">
                    Each prediction includes comprehensive risk analysis, support/resistance levels, 
                    and optimal entry/exit points.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200 p-8">
              <h3 className="text-xl font-semibold text-neutral-900 mb-6">
                Key Performance Metrics
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600">Average Return</span>
                  <span className="font-semibold text-success-600">7.2%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600">Success Rate</span>
                  <span className="font-semibold text-primary-600">85%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600">Average Timeline</span>
                  <span className="font-semibold text-secondary-600">6.5 days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600">Max Drawdown</span>
                  <span className="font-semibold text-warning-600">-3.2%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Start Smart Investing?
            </h2>
            <p className="text-xl text-neutral-200 max-w-2xl mx-auto">
              Join thousands of investors who trust Stock Sensing for their trading decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/signup"
                className="px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-neutral-100 transition-colors"
              >
                Get Started Free
              </a>
              <a
                href="/predicted-stocks"
                className="px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-primary-600 transition-colors"
              >
                View Predictions
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;