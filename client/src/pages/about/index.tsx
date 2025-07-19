import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BadgeCheck, ChevronRight, LineChart, BarChart3, PieChart, Target, Award, Users, BookOpen, HandHeart } from "lucide-react";

const AboutPage = () => {
  const { t } = useLanguage();

  const stats = [
    {
      value: "$5.3B",
      label: "Annual funding gap in Canadian social sector",
      description: "The gap between what's needed and what's available for social programs.",
      source: "Social Finance Forum, 2023"
    },
    {
      value: "86%",
      label: "of Canadians want transparency in social impact",
      description: "Canadians want to know how donations and tax dollars are being used to address social issues.",
      source: "Statistics Canada, 2022"
    },
    {
      value: "47%",
      label: "of social programs lack rigorous impact evaluation",
      description: "Nearly half of all Canadian social initiatives cannot demonstrate their effectiveness.",
      source: "Canadian Impact Measurement Survey"
    },
    {
      value: "68%",
      label: "of donors base decisions on measurable impact",
      description: "The majority of donors prioritize organizations that can demonstrate measurable outcomes.",
      source: "Imagine Canada, 2023"
    }
  ];

  const wastageStats = [
    {
      value: "$1.2B",
      label: "Lost annually to ineffective programs",
      description: "Funds directed to programs with no meaningful outcomes.",
      source: "Public Policy Forum, 2022"
    },
    {
      value: "3.8 years",
      label: "Average time before program evaluation",
      description: "Most programs run for nearly 4 years before rigorous impact assessment.",
      source: "Social Research Canada"
    },
    {
      value: "38%",
      label: "of duplicate efforts across organizations",
      description: "Organizations unknowingly replicate existing solutions due to lack of sector-wide data.",
      source: "Nonprofit Innovation Report, 2021"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden text-white py-20 px-4">
        {/* Vibrant gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-violet-900 z-0"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 opacity-10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500 opacity-10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="container relative z-10 mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1 bg-white/10 backdrop-blur-sm rounded-full mb-6">
              <span className="text-white/90 text-sm">Understanding Our Mission</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
              Why Basic Impacts Exists
            </h1>
            <p className="text-xl max-w-3xl mx-auto text-indigo-100 leading-relaxed">
              We're building a future where social impact is transparent, measurable, and accountable —
              addressing the critical gaps in Canada's social sector.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
              <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-rose-200 to-rose-300 bg-clip-text text-transparent flex items-center">
                <div className="p-2 rounded-lg bg-rose-500/20 mr-3">
                  <Target className="h-6 w-6 text-rose-200" />
                </div>
                The Problem
              </h2>
              <p className="mb-6 text-white/80 leading-relaxed">
                Canada's social sector lacks standardized impact measurement, leading to inefficient resource allocation, 
                duplicated efforts, and an inability to identify truly effective approaches to our most pressing social challenges.
              </p>
              <ul className="space-y-4">
                <li className="flex">
                  <div className="mr-4 text-rose-300 mt-1">
                    <ChevronRight size={18} />
                  </div>
                  <p className="text-white/80">
                    <span className="text-white font-medium">Funding decisions</span> are made without adequate impact data
                  </p>
                </li>
                <li className="flex">
                  <div className="mr-4 text-rose-300 mt-1">
                    <ChevronRight size={18} />
                  </div>
                  <p className="text-white/80">
                    <span className="text-white font-medium">Organizations struggle</span> to demonstrate their effectiveness
                  </p>
                </li>
                <li className="flex">
                  <div className="mr-4 text-rose-300 mt-1">
                    <ChevronRight size={18} />
                  </div>
                  <p className="text-white/80">
                    <span className="text-white font-medium">Billions wasted</span> on programs without proven outcomes
                  </p>
                </li>
                <li className="flex">
                  <div className="mr-4 text-rose-300 mt-1">
                    <ChevronRight size={18} />
                  </div>
                  <p className="text-white/80">
                    <span className="text-white font-medium">No standardized metrics</span> to compare program effectiveness
                  </p>
                </li>
              </ul>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
              <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-emerald-200 to-emerald-300 bg-clip-text text-transparent flex items-center">
                <div className="p-2 rounded-lg bg-emerald-500/20 mr-3">
                  <Award className="h-6 w-6 text-emerald-200" />
                </div>
                Our Solution
              </h2>
              <p className="mb-6 text-white/80 leading-relaxed">
                Basic Impacts provides a comprehensive platform that standardizes impact measurement, 
                creates transparency, and enables data-driven decision making across the social sector.
              </p>
              <ul className="space-y-4">
                <li className="flex">
                  <div className="mr-4 text-emerald-300 mt-1">
                    <BadgeCheck size={18} />
                  </div>
                  <p className="text-white/80">
                    <span className="text-white font-medium">Standardized metrics</span> across sectors and programs
                  </p>
                </li>
                <li className="flex">
                  <div className="mr-4 text-emerald-300 mt-1">
                    <BadgeCheck size={18} />
                  </div>
                  <p className="text-white/80">
                    <span className="text-white font-medium">Evidence-based evaluation</span> of program effectiveness
                  </p>
                </li>
                <li className="flex">
                  <div className="mr-4 text-emerald-300 mt-1">
                    <BadgeCheck size={18} />
                  </div>
                  <p className="text-white/80">
                    <span className="text-white font-medium">Data visualization</span> making impact transparent and accessible
                  </p>
                </li>
                <li className="flex">
                  <div className="mr-4 text-emerald-300 mt-1">
                    <BadgeCheck size={18} />
                  </div>
                  <p className="text-white/80">
                    <span className="text-white font-medium">Accountability framework</span> that rewards proven results
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Alarming Stats Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-white">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1 rounded-full bg-purple-100 mb-4">
              <span className="text-purple-600 text-sm font-medium">Impact Gap Analysis</span>
            </div>
            <h2 className="text-3xl font-bold mb-4 gradient-heading gradient-heading-secondary">The Urgent Need for Impact Accountability</h2>
            <p className="text-xl text-purple-900/70 max-w-3xl mx-auto leading-relaxed">
              Real-world statistics show the critical gaps in Canada's social impact ecosystem
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <Card key={index} className="border-none shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-indigo-50 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-3xl font-bold gradient-heading gradient-heading-primary">{stat.value}</CardTitle>
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold text-indigo-900 mb-2">{stat.label}</h3>
                  <p className="text-sm text-indigo-700/80 mb-3">{stat.description}</p>
                  <p className="text-xs text-indigo-500/70 italic">Source: {stat.source}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Separator className="max-w-4xl mx-auto my-16 bg-gradient-to-r from-purple-200 via-indigo-300 to-purple-200 h-0.5 opacity-60" />
          
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1 rounded-full bg-pink-100 mb-4">
              <span className="text-pink-600 text-sm font-medium">Resource Wastage</span>
            </div>
            <h2 className="text-3xl font-bold mb-4 gradient-heading gradient-heading-accent">The Cost of Inaction</h2>
            <p className="text-xl text-purple-900/70 max-w-3xl mx-auto leading-relaxed">
              Ineffective impact measurement leads to significant resource wastage
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {wastageStats.map((stat, index) => (
              <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-pink-50 overflow-hidden relative group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-rose-500"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardHeader className="pb-2 relative">
                  <CardTitle className="text-3xl font-bold gradient-heading gradient-heading-accent">{stat.value}</CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <h3 className="font-semibold text-pink-900 mb-2">{stat.label}</h3>
                  <p className="text-sm text-pink-700/80 mb-3">{stat.description}</p>
                  <p className="text-xs text-pink-500/70 italic">Source: {stat.source}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Approach Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-white">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1 rounded-full bg-indigo-100 mb-4">
              <span className="text-indigo-600 text-sm font-medium">Impact Methodology</span>
            </div>
            <h2 className="text-3xl font-bold mb-4 gradient-heading gradient-heading-primary">Our Approach</h2>
            <p className="text-xl text-indigo-900/70 max-w-3xl mx-auto leading-relaxed">
              Basic Impacts combines robust methodology with user-friendly tools to make impact measurement accessible
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card-gradient card-gradient-primary rounded-xl p-6 text-center transition-all duration-300 hover:shadow-lg border border-indigo-100">
              <div className="bg-gradient-to-br from-indigo-600 to-indigo-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                <LineChart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-indigo-800">Standardized Metrics</h3>
              <p className="text-indigo-900/70">
                Comparable data across organizations, sectors, and regions using a unified measurement framework
              </p>
            </div>
            
            <div className="card-gradient card-gradient-primary rounded-xl p-6 text-center transition-all duration-300 hover:shadow-lg border border-indigo-100">
              <div className="bg-gradient-to-br from-purple-600 to-purple-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-purple-800">Transparent Reporting</h3>
              <p className="text-indigo-900/70">
                Clear, accessible visualizations of impact data that anyone can understand
              </p>
            </div>
            
            <div className="card-gradient card-gradient-primary rounded-xl p-6 text-center transition-all duration-300 hover:shadow-lg border border-indigo-100">
              <div className="bg-gradient-to-br from-fuchsia-600 to-fuchsia-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                <PieChart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-fuchsia-800">Data-Driven Insights</h3>
              <p className="text-indigo-900/70">
                Advanced analytics that identify patterns, trends, and opportunities for improvement
              </p>
            </div>
            
            <div className="card-gradient card-gradient-primary rounded-xl p-6 text-center transition-all duration-300 hover:shadow-lg border border-indigo-100">
              <div className="bg-gradient-to-br from-pink-600 to-pink-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-pink-800">Community Focus</h3>
              <p className="text-indigo-900/70">
                Engaging beneficiaries, funders, and organizations in collaborative improvement
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative py-20 overflow-hidden text-white">
        {/* Vibrant gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 z-0"></div>
        
        {/* Decorative patterns */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMCAwdi02aC02djZoNnptNiAwaDZ2LTZoLTZ2NnptLTEyIDBoLTZ2Nmg2di02eiIvPjwvZz48L2c+PC9zdmc+Cg==')]
          opacity-20 z-0"></div>
        
        {/* Light blobs */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        
        <div className="container relative mx-auto max-w-5xl px-4 text-center z-10">
          <div className="inline-block px-4 py-1 bg-white/10 backdrop-blur-sm rounded-full mb-6">
            <span className="text-white/90 text-sm">Take the Next Step</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
            Join the Impact Accountability Movement
          </h2>
          <p className="text-xl mb-10 max-w-3xl mx-auto text-indigo-100 leading-relaxed">
            Together, we can transform how social impact is measured, reported, and improved across Canada.
          </p>
          <div className="flex flex-wrap justify-center gap-5">
            <button className="btn-gradient btn-gradient-primary px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300">
              Register Your Organization
            </button>
            <button className="bg-transparent border-2 border-white/40 hover:border-white hover:bg-white/10 text-white font-medium px-8 py-3 rounded-xl transition-all duration-300">
              Learn More About Our Methodology
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;