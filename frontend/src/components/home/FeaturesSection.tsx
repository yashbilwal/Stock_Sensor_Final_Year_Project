import React from 'react';
import { Brain, TrendingUp, Shield, Zap, BarChart3, Bell, Sparkles, Star, Target, Cpu, Eye, Rocket } from 'lucide-react';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Brain,
      title: 'Advanced AI Analysis',
      description: 'Deep learning algorithms process millions of data points to identify profitable patterns with unprecedented accuracy.',
      color: 'cosmic-purple',
      gradient: 'from-cosmic-purple/30 to-cosmic-purple/5',
      glow: 'shadow-cosmic-purple/50'
    },
    {
      icon: Target,
      title: 'VCP & IPO Base Detection',
      description: 'Automatically identify Volatility Contraction Patterns and IPO base setups for optimal entry points.',
      color: 'cosmic-cyan',
      gradient: 'from-cosmic-cyan/30 to-cosmic-cyan/5',
      glow: 'shadow-cosmic-cyan/50'
    },
    {
      icon: BarChart3,
      title: 'Real-time Market Intelligence',
      description: 'Live data processing with instant analysis of price movements, volume patterns, and market sentiment.',
      color: 'cosmic-blue',
      gradient: 'from-cosmic-blue/30 to-cosmic-blue/5',
      glow: 'shadow-cosmic-blue/50'
    },
    {
      icon: Shield,
      title: 'Smart Risk Management',
      description: 'Built-in risk assessment with dynamic stop-loss calculations and position sizing recommendations.',
      color: 'success-500',
      gradient: 'from-success-500/30 to-success-500/5',
      glow: 'shadow-success-500/50'
    },
    {
      icon: Rocket,
      title: 'Lightning Fast Execution',
      description: 'Millisecond-level analysis with instant alerts when perfect trading setups are identified.',
      color: 'warning-500',
      gradient: 'from-warning-500/30 to-warning-500/5',
      glow: 'shadow-warning-500/50'
    },
    {
      icon: Eye,
      title: 'Predictive Vision',
      description: 'See market movements before they happen with our proprietary forecasting algorithms.',
      color: 'cosmic-pink',
      gradient: 'from-cosmic-pink/30 to-cosmic-pink/5',
      glow: 'shadow-cosmic-pink/50'
    }
  ];

  return (
    <section className="relative py-32 bg-gradient-to-b from-galaxy-900 via-galaxy-800 to-galaxy-900 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-20 animate-twinkle">
          <Star className="h-6 w-6 text-cosmic-purple opacity-40" fill="currentColor" />
        </div>
        <div className="absolute top-40 right-32 animate-twinkle" style={{ animationDelay: '1s' }}>
          <Star className="h-4 w-4 text-cosmic-cyan opacity-60" fill="currentColor" />
        </div>
        <div className="absolute bottom-32 left-16 animate-twinkle" style={{ animationDelay: '2s' }}>
          <Star className="h-8 w-8 text-cosmic-pink opacity-20" fill="currentColor" />
        </div>
        <div className="absolute top-60 right-20 animate-twinkle" style={{ animationDelay: '0.5s' }}>
          <Star className="h-3 w-3 text-cosmic-blue opacity-80" fill="currentColor" />
        </div>

        {/* Gradient Overlays */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-cosmic-purple/5 via-transparent to-cosmic-cyan/5"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="text-center space-y-8 mb-20">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="p-2 bg-cosmic-purple/20 rounded-full animate-pulse">
              <Cpu className="h-6 w-6 text-cosmic-purple" />
            </div>
            <span className="text-cosmic-cyan font-bold text-xl tracking-wider uppercase">Advanced Features</span>
            <div className="p-2 bg-cosmic-pink/20 rounded-full animate-pulse">
              <Zap className="h-6 w-6 text-cosmic-pink" />
            </div>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-black text-white leading-tight">
            Why Choose 
            <span className="block bg-gradient-to-r from-cosmic-purple via-cosmic-cyan to-cosmic-pink bg-clip-text text-transparent">
              Stock Intelligence?
            </span>
          </h2>
          
          <p className="text-2xl text-galaxy-200 max-w-4xl mx-auto leading-relaxed font-light">
            Experience the future of stock trading with our revolutionary AI-powered platform that delivers consistent results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Glow Effect */}
              <div className={`absolute -inset-2 bg-gradient-to-r ${feature.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition duration-1000`}></div>
              
              {/* Card */}
              <div className="relative p-10 bg-galaxy-800/60 backdrop-blur-xl border border-galaxy-600/50 rounded-3xl hover:bg-galaxy-700/60 transition-all duration-500 animate-slide-up h-full transform hover:scale-105">
                <div className="space-y-8">
                  {/* Icon */}
                  <div className="relative">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-500 ${feature.glow} group-hover:shadow-2xl`}>
                      <feature.icon className={`h-10 w-10 text-${feature.color}`} />
                    </div>
                    <div className="absolute -top-2 -right-2">
                      <Star className="h-6 w-6 text-cosmic-purple opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" fill="currentColor" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="space-y-4">
                    <h3 className={`text-2xl font-bold text-white group-hover:text-${feature.color} transition-colors`}>
                      {feature.title}
                    </h3>
                    <p className="text-galaxy-300 leading-relaxed group-hover:text-galaxy-200 transition-colors text-lg">
                      {feature.description}
                    </p>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className={`w-3 h-3 bg-${feature.color} rounded-full animate-pulse`}></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <div className="inline-flex items-center space-x-4 px-10 py-6 bg-gradient-to-r from-cosmic-purple/20 via-cosmic-cyan/20 to-cosmic-pink/20 backdrop-blur-sm text-white rounded-2xl text-xl border border-galaxy-600/50">
            <Sparkles className="h-6 w-6 text-cosmic-purple animate-pulse" />
            <span className="font-semibold">Powered by cutting-edge machine learning algorithms</span>
            <Sparkles className="h-6 w-6 text-cosmic-pink animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;