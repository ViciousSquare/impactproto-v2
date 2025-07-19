import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronRight, 
  BarChart, 
  PieChart, 
  LineChart, 
  CheckCircle2, 
  ClipboardCheck, 
  AlignJustify,
  Users,
  Building,
  BookOpen,
  GraduationCap
} from 'lucide-react';

const MethodologyPage = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      {/* Hero section with vibrant gradient background */}
      <div className="bg-gradient-to-br from-indigo-800 via-purple-700 to-pink-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-3 inline-block p-2 rounded-full bg-white/10 backdrop-blur-sm">
              <Badge className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 text-sm">Comprehensive Framework</Badge>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-200 via-pink-200 to-cyan-200 bg-clip-text text-transparent">
              Impact Measurement Methodology
            </h1>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto leading-relaxed">
              A comprehensive breakdown of the why, how, what, and who behind the Basic Impacts accountability platform.
            </p>
            <div className="mt-10 flex justify-center space-x-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-400/30 backdrop-blur-sm text-white">
                <span className="mr-1.5">•</span> Data-Driven
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-400/30 backdrop-blur-sm text-white">
                <span className="mr-1.5">•</span> Transparent
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-pink-400/30 backdrop-blur-sm text-white">
                <span className="mr-1.5">•</span> Standardized
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content with tabs interface */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <Tabs defaultValue="why" className="mb-12">
            <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto mb-8 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 p-1 rounded-xl">
              <TabsTrigger value="why" className="flex items-center justify-center gap-2 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white">
                <BookOpen className="h-4 w-4" />
                <span>Why</span>
              </TabsTrigger>
              <TabsTrigger value="how" className="flex items-center justify-center gap-2 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
                <BarChart className="h-4 w-4" />
                <span>How</span>
              </TabsTrigger>
              <TabsTrigger value="what" className="flex items-center justify-center gap-2 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-fuchsia-500 data-[state=active]:to-fuchsia-600 data-[state=active]:text-white">
                <PieChart className="h-4 w-4" />
                <span>What</span>
              </TabsTrigger>
              <TabsTrigger value="who" className="flex items-center justify-center gap-2 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-pink-600 data-[state=active]:text-white">
                <Users className="h-4 w-4" />
                <span>Who</span>
              </TabsTrigger>
            </TabsList>

            {/* WHY Tab Content */}
            <TabsContent value="why" className="focus:outline-none">
              <Card className="border-none shadow-xl overflow-hidden bg-gradient-to-br from-indigo-50 to-white">
                <div className="h-2 w-full bg-gradient-to-r from-indigo-400 via-indigo-500 to-indigo-600"></div>
                <CardContent className="pt-8">
                  <div className="flex items-start gap-6">
                    <div className="bg-gradient-to-br from-indigo-400 to-indigo-600 p-5 rounded-full hidden md:flex items-center justify-center shadow-md">
                      <BookOpen className="h-14 w-14 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-indigo-700 to-indigo-500 bg-clip-text text-transparent">Why We Exist</h2>
                      
                      <div className="grid md:grid-cols-2 gap-8 mb-8">
                        <div className="bg-gradient-to-br from-white to-red-50 p-6 rounded-xl border border-red-100 shadow-md">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="bg-red-100 p-2 rounded-full">
                              <div className="bg-gradient-to-br from-red-500 to-red-600 w-8 h-8 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold">!</span>
                              </div>
                            </div>
                            <h3 className="font-bold text-xl text-red-800">The Problem</h3>
                          </div>
                          <p className="mb-4 text-neutral-700">
                            Basic Impacts was created to address critical gaps in the social impact sector:
                          </p>
                          <ul className="space-y-3">
                            <li className="flex gap-3 bg-white p-3 rounded-lg border border-red-100 shadow-sm">
                              <div className="text-red-500 mt-1 flex-shrink-0">
                                <ChevronRight className="h-5 w-5" />
                              </div>
                              <div>
                                <span className="font-medium text-red-700 block">Lack of standardization</span>
                                <span className="text-sm text-neutral-600">Impact measurement methods vary widely across organizations and sectors</span>
                              </div>
                            </li>
                            <li className="flex gap-3 bg-white p-3 rounded-lg border border-red-100 shadow-sm">
                              <div className="text-red-500 mt-1 flex-shrink-0">
                                <ChevronRight className="h-5 w-5" />
                              </div>
                              <div>
                                <span className="font-medium text-red-700 block">Limited transparency</span>
                                <span className="text-sm text-neutral-600">Impact claims often lack rigorous verification and validation</span>
                              </div>
                            </li>
                            <li className="flex gap-3 bg-white p-3 rounded-lg border border-red-100 shadow-sm">
                              <div className="text-red-500 mt-1 flex-shrink-0">
                                <ChevronRight className="h-5 w-5" />
                              </div>
                              <div>
                                <span className="font-medium text-red-700 block">Accessibility challenges</span>
                                <span className="text-sm text-neutral-600">Impact data is typically siloed or presented in complex formats</span>
                              </div>
                            </li>
                            <li className="flex gap-3 bg-white p-3 rounded-lg border border-red-100 shadow-sm">
                              <div className="text-red-500 mt-1 flex-shrink-0">
                                <ChevronRight className="h-5 w-5" />
                              </div>
                              <div>
                                <span className="font-medium text-red-700 block">Resource constraints</span>
                                <span className="text-sm text-neutral-600">Smaller organizations struggle to implement robust impact measurement</span>
                              </div>
                            </li>
                          </ul>
                        </div>
                        
                        <div className="bg-gradient-to-br from-white to-emerald-50 p-6 rounded-xl border border-emerald-100 shadow-md">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="bg-emerald-100 p-2 rounded-full">
                              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 w-8 h-8 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold">✓</span>
                              </div>
                            </div>
                            <h3 className="font-bold text-xl text-emerald-800">The Solution</h3>
                          </div>
                          <p className="mb-4 text-neutral-700">
                            Basic Impacts provides a comprehensive platform that addresses these challenges:
                          </p>
                          <ul className="space-y-3">
                            <li className="flex gap-3 bg-white p-3 rounded-lg border border-emerald-100 shadow-sm">
                              <div className="text-emerald-500 mt-1 flex-shrink-0">
                                <CheckCircle2 className="h-5 w-5" />
                              </div>
                              <div>
                                <span className="font-medium text-emerald-700 block">Standardized framework</span>
                                <span className="text-sm text-neutral-600">A unified methodology that works across sectors and organization types</span>
                              </div>
                            </li>
                            <li className="flex gap-3 bg-white p-3 rounded-lg border border-emerald-100 shadow-sm">
                              <div className="text-emerald-500 mt-1 flex-shrink-0">
                                <CheckCircle2 className="h-5 w-5" />
                              </div>
                              <div>
                                <span className="font-medium text-emerald-700 block">Verification system</span>
                                <span className="text-sm text-neutral-600">Multi-tiered validation process to ensure data quality and trustworthiness</span>
                              </div>
                            </li>
                            <li className="flex gap-3 bg-white p-3 rounded-lg border border-emerald-100 shadow-sm">
                              <div className="text-emerald-500 mt-1 flex-shrink-0">
                                <CheckCircle2 className="h-5 w-5" />
                              </div>
                              <div>
                                <span className="font-medium text-emerald-700 block">Accessible interface</span>
                                <span className="text-sm text-neutral-600">User-friendly tools making impact data easy to understand and compare</span>
                              </div>
                            </li>
                            <li className="flex gap-3 bg-white p-3 rounded-lg border border-emerald-100 shadow-sm">
                              <div className="text-emerald-500 mt-1 flex-shrink-0">
                                <CheckCircle2 className="h-5 w-5" />
                              </div>
                              <div>
                                <span className="font-medium text-emerald-700 block">Resource optimization</span>
                                <span className="text-sm text-neutral-600">Streamlined processes that reduce the burden of impact reporting</span>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-white to-indigo-50 p-6 rounded-lg border border-indigo-100 shadow-md">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="bg-indigo-100 p-2 rounded-full">
                            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 w-8 h-8 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold">★</span>
                            </div>
                          </div>
                          <h3 className="font-bold text-xl text-indigo-800">Our Vision</h3>
                        </div>
                        <p className="text-neutral-700 leading-relaxed">
                          By addressing these challenges, we aim to create a more transparent, accountable, and effective social impact ecosystem across Canada. Through standardized measurement, robust verification, and accessible reporting, Basic Impacts is building a foundation for evidence-based decision making in the social sector.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* HOW Tab Content */}
            <TabsContent value="how" className="focus:outline-none">
              <Card className="border-none shadow-xl overflow-hidden bg-gradient-to-br from-purple-50 to-white">
                <div className="h-2 w-full bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600"></div>
                <CardContent className="pt-8">
                  <div className="flex items-start gap-6">
                    <div className="bg-gradient-to-br from-purple-400 to-purple-600 p-5 rounded-full hidden md:flex items-center justify-center shadow-md">
                      <BarChart className="h-14 w-14 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-700 to-purple-500 bg-clip-text text-transparent">How We Measure Impact</h2>
                      
                      <div className="mb-10">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="bg-purple-100 p-2 rounded-full">
                            <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-8 h-8 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold">1</span>
                            </div>
                          </div>
                          <h3 className="font-bold text-xl text-purple-800">Our Process</h3>
                        </div>
                        
                        <div className="relative">
                          {/* Process flow */}
                          <div className="hidden md:block absolute top-1/2 left-0 w-full h-2 bg-gradient-to-r from-purple-200 via-fuchsia-200 to-pink-200 -translate-y-1/2 z-0 rounded-full"></div>
                          
                          <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="flex flex-col items-center">
                              <div className="bg-white p-4 rounded-full border-2 border-purple-200 shadow-lg mb-3 bg-gradient-to-br from-white to-purple-50">
                                <ClipboardCheck className="h-8 w-8 text-purple-600" />
                              </div>
                              <h4 className="font-bold text-purple-700">Data Collection</h4>
                              <p className="text-sm text-center text-neutral-600">Organizations submit qualitative and quantitative impact data</p>
                            </div>
                            
                            <div className="flex flex-col items-center">
                              <div className="bg-white p-4 rounded-full border-2 border-purple-200 shadow-lg mb-3 bg-gradient-to-br from-white to-purple-50">
                                <CheckCircle2 className="h-8 w-8 text-purple-600" />
                              </div>
                              <h4 className="font-bold text-purple-700">Verification</h4>
                              <p className="text-sm text-center text-neutral-600">Multi-tiered validation process ensures data quality</p>
                            </div>
                            
                            <div className="flex flex-col items-center">
                              <div className="bg-white p-4 rounded-full border-2 border-purple-200 shadow-lg mb-3 bg-gradient-to-br from-white to-purple-50">
                                <BarChart className="h-8 w-8 text-purple-600" />
                              </div>
                              <h4 className="font-bold text-purple-700">Analysis</h4>
                              <p className="text-sm text-center text-neutral-600">5-component scoring based on our Impact IQ methodology</p>
                            </div>
                            
                            <div className="flex flex-col items-center">
                              <div className="bg-white p-4 rounded-full border-2 border-purple-200 shadow-lg mb-3 bg-gradient-to-br from-white to-purple-50">
                                <AlignJustify className="h-8 w-8 text-purple-600" />
                              </div>
                              <h4 className="font-bold text-purple-700">Grading</h4>
                              <p className="text-sm text-center text-neutral-600">Assignment of impact grades from A+ to F based on scores</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-10">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="bg-purple-100 p-2 rounded-full">
                            <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-8 h-8 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold">2</span>
                            </div>
                          </div>
                          <h3 className="font-bold text-xl text-purple-800">Impact IQ Components</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-gradient-to-br from-pink-500 to-purple-600 p-1 rounded-xl shadow-md">
                            <div className="bg-white p-4 rounded-lg h-full">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge className="bg-pink-100 text-pink-800 hover:bg-pink-200">20%</Badge>
                                <h4 className="font-bold text-pink-700">Reporting Quality</h4>
                              </div>
                              <p className="text-sm text-neutral-600">Assessment of data collection methods, comprehensiveness, and frequency of reporting.</p>
                            </div>
                          </div>
                          
                          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-1 rounded-xl shadow-md">
                            <div className="bg-white p-4 rounded-lg h-full">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">20%</Badge>
                                <h4 className="font-bold text-purple-700">Reach</h4>
                              </div>
                              <p className="text-sm text-neutral-600">The scale of impact relative to the social need (people served, geographic coverage).</p>
                            </div>
                          </div>
                          
                          <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-1 rounded-xl shadow-md">
                            <div className="bg-white p-4 rounded-lg h-full">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200">20%</Badge>
                                <h4 className="font-bold text-indigo-700">Social ROI</h4>
                              </div>
                              <p className="text-sm text-neutral-600">Return on investment calculation comparing resources invested to quantifiable social outcomes.</p>
                            </div>
                          </div>
                          
                          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-1 rounded-xl shadow-md">
                            <div className="bg-white p-4 rounded-lg h-full">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">20%</Badge>
                                <h4 className="font-bold text-blue-700">Outcome Effectiveness</h4>
                              </div>
                              <p className="text-sm text-neutral-600">Evaluation of the depth, quality, and sustainability of the impact achieved.</p>
                            </div>
                          </div>
                          
                          <div className="bg-gradient-to-br from-cyan-500 to-teal-600 p-1 rounded-xl shadow-md">
                            <div className="bg-white p-4 rounded-lg h-full">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge className="bg-cyan-100 text-cyan-800 hover:bg-cyan-200">20%</Badge>
                                <h4 className="font-bold text-cyan-700">Transparency & Governance</h4>
                              </div>
                              <p className="text-sm text-neutral-600">Assessment of the organization's accountability, transparency, and ethical practices.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <div className="bg-purple-100 p-2 rounded-full">
                            <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-8 h-8 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold">3</span>
                            </div>
                          </div>
                          <h3 className="font-bold text-xl text-purple-800">Verification Levels</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="group relative overflow-hidden rounded-xl shadow-lg transition-transform hover:scale-105">
                            <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 opacity-90"></div>
                            <div className="absolute top-0 right-0 p-2">
                              <Badge className="bg-white/90 text-emerald-800 hover:bg-white">Highest</Badge>
                            </div>
                            <div className="relative p-6 text-white">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                                  <CheckCircle2 className="h-6 w-6" />
                                </div>
                                <h4 className="font-bold text-lg">Audited</h4>
                              </div>
                              <p className="text-sm text-white/90">Impact verified by an independent third-party through a comprehensive audit process.</p>
                            </div>
                          </div>
                          
                          <div className="group relative overflow-hidden rounded-xl shadow-lg transition-transform hover:scale-105">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-600 opacity-90"></div>
                            <div className="absolute top-0 right-0 p-2">
                              <Badge className="bg-white/90 text-indigo-800 hover:bg-white">Medium</Badge>
                            </div>
                            <div className="relative p-6 text-white">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                                  <CheckCircle2 className="h-6 w-6" />
                                </div>
                                <h4 className="font-bold text-lg">Verified</h4>
                              </div>
                              <p className="text-sm text-white/90">Impact claims verified by Basic Impacts through documentation review and spot checks.</p>
                            </div>
                          </div>
                          
                          <div className="group relative overflow-hidden rounded-xl shadow-lg transition-transform hover:scale-105">
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-600 opacity-90"></div>
                            <div className="absolute top-0 right-0 p-2">
                              <Badge className="bg-white/90 text-amber-800 hover:bg-white">Initial</Badge>
                            </div>
                            <div className="relative p-6 text-white">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                                  <ClipboardCheck className="h-6 w-6" />
                                </div>
                                <h4 className="font-bold text-lg">Self-Reported</h4>
                              </div>
                              <p className="text-sm text-white/90">Impact data provided by the organization without external verification.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* WHAT Tab Content */}
            <TabsContent value="what" className="focus:outline-none">
              <Card className="border-2 border-primary-100 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-6">
                    <div className="bg-primary-50 p-4 rounded-full hidden md:flex items-center justify-center">
                      <PieChart className="h-16 w-16 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold mb-6 text-primary-600">What We Measure</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                        <div>
                          <h3 className="text-xl font-semibold mb-4 text-primary-700 flex items-center gap-2">
                            <LineChart className="h-5 w-5 text-primary-600" />
                            Sector-Specific Metrics
                          </h3>
                          
                          <ul className="space-y-3">
                            <li className="bg-white p-3 rounded-lg border border-primary-100 shadow-sm flex gap-2">
                              <ChevronRight className="h-5 w-5 text-primary-400 flex-shrink-0 mt-0.5" />
                              <span className="text-neutral-700">Food Security (meals provided, reduction in food insecurity)</span>
                            </li>
                            <li className="bg-white p-3 rounded-lg border border-primary-100 shadow-sm flex gap-2">
                              <ChevronRight className="h-5 w-5 text-primary-400 flex-shrink-0 mt-0.5" />
                              <span className="text-neutral-700">Housing (units created, people housed, housing stability)</span>
                            </li>
                            <li className="bg-white p-3 rounded-lg border border-primary-100 shadow-sm flex gap-2">
                              <ChevronRight className="h-5 w-5 text-primary-400 flex-shrink-0 mt-0.5" />
                              <span className="text-neutral-700">Education (learning outcomes, graduation rates, skills developed)</span>
                            </li>
                            <li className="bg-white p-3 rounded-lg border border-primary-100 shadow-sm flex gap-2">
                              <ChevronRight className="h-5 w-5 text-primary-400 flex-shrink-0 mt-0.5" />
                              <span className="text-neutral-700">Health & Wellbeing (health improvements, quality of life measures)</span>
                            </li>
                            <li className="bg-white p-3 rounded-lg border border-primary-100 shadow-sm flex gap-2">
                              <ChevronRight className="h-5 w-5 text-primary-400 flex-shrink-0 mt-0.5" />
                              <span className="text-neutral-700">Environment (emissions reduced, waste diverted, conservation impact)</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div>
                          <h3 className="text-xl font-semibold mb-4 text-primary-700 flex items-center gap-2">
                            <BarChart className="h-5 w-5 text-primary-600" />
                            Cross-Sector Metrics
                          </h3>
                          
                          <ul className="space-y-3">
                            <li className="bg-white p-3 rounded-lg border border-primary-100 shadow-sm flex gap-2">
                              <ChevronRight className="h-5 w-5 text-primary-400 flex-shrink-0 mt-0.5" />
                              <span className="text-neutral-700">UN Sustainable Development Goals alignment</span>
                            </li>
                            <li className="bg-white p-3 rounded-lg border border-primary-100 shadow-sm flex gap-2">
                              <ChevronRight className="h-5 w-5 text-primary-400 flex-shrink-0 mt-0.5" />
                              <span className="text-neutral-700">Community engagement and participation</span>
                            </li>
                            <li className="bg-white p-3 rounded-lg border border-primary-100 shadow-sm flex gap-2">
                              <ChevronRight className="h-5 w-5 text-primary-400 flex-shrink-0 mt-0.5" />
                              <span className="text-neutral-700">Diversity, equity, and inclusion</span>
                            </li>
                            <li className="bg-white p-3 rounded-lg border border-primary-100 shadow-sm flex gap-2">
                              <ChevronRight className="h-5 w-5 text-primary-400 flex-shrink-0 mt-0.5" />
                              <span className="text-neutral-700">Systems change and policy influence</span>
                            </li>
                            <li className="bg-white p-3 rounded-lg border border-primary-100 shadow-sm flex gap-2">
                              <ChevronRight className="h-5 w-5 text-primary-400 flex-shrink-0 mt-0.5" />
                              <span className="text-neutral-700">Innovation and replicability</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-semibold mb-4 text-primary-700">Impact Grading System</h3>
                        <p className="mb-4 text-neutral-700">
                          Based on the combined Impact IQ score, organizations are assigned a grade:
                        </p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-4 bg-gradient-to-br from-white to-green-50 rounded-lg border border-green-200 shadow-sm">
                            <span className="font-bold text-2xl text-green-700 block mb-1">A+, A, A-</span>
                            <p className="text-sm text-neutral-600">Outstanding impact</p>
                            <p className="text-xs text-neutral-500 mt-1">90-100 points</p>
                          </div>
                          
                          <div className="text-center p-4 bg-gradient-to-br from-white to-blue-50 rounded-lg border border-blue-200 shadow-sm">
                            <span className="font-bold text-2xl text-blue-700 block mb-1">B+, B, B-</span>
                            <p className="text-sm text-neutral-600">Strong impact</p>
                            <p className="text-xs text-neutral-500 mt-1">80-89 points</p>
                          </div>
                          
                          <div className="text-center p-4 bg-gradient-to-br from-white to-amber-50 rounded-lg border border-amber-200 shadow-sm">
                            <span className="font-bold text-2xl text-amber-700 block mb-1">C+, C, C-</span>
                            <p className="text-sm text-neutral-600">Moderate impact</p>
                            <p className="text-xs text-neutral-500 mt-1">70-79 points</p>
                          </div>
                          
                          <div className="text-center p-4 bg-gradient-to-br from-white to-red-50 rounded-lg border border-red-200 shadow-sm">
                            <span className="font-bold text-2xl text-red-700 block mb-1">D, F</span>
                            <p className="text-sm text-neutral-600">Limited impact</p>
                            <p className="text-xs text-neutral-500 mt-1">Below 70 points</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* WHO Tab Content */}
            <TabsContent value="who" className="focus:outline-none">
              <Card className="border-2 border-primary-100 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-6">
                    <div className="bg-primary-50 p-4 rounded-full hidden md:flex items-center justify-center">
                      <Users className="h-16 w-16 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold mb-6 text-primary-600">Who We Are</h2>
                      
                      <div className="mb-10">
                        <h3 className="text-xl font-semibold mb-4 text-primary-700">Our Team</h3>
                        <p className="mb-6 text-neutral-700">
                          Basic Impacts is a collaborative initiative developed by a diverse group of stakeholders committed to enhancing impact accountability in Canada.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="bg-gradient-to-br from-white to-primary-50 p-6 rounded-lg border border-primary-100 shadow-sm flex flex-col items-center text-center">
                            <div className="bg-white p-3 rounded-full border border-primary-200 shadow-sm mb-3">
                              <BookOpen className="h-8 w-8 text-primary-600" />
                            </div>
                            <h4 className="font-bold text-primary-700 mb-1">Impact Specialists</h4>
                            <p className="text-sm text-neutral-600">Experts in impact measurement, evaluation, and reporting</p>
                          </div>
                          
                          <div className="bg-gradient-to-br from-white to-primary-50 p-6 rounded-lg border border-primary-100 shadow-sm flex flex-col items-center text-center">
                            <div className="bg-white p-3 rounded-full border border-primary-200 shadow-sm mb-3">
                              <BarChart className="h-8 w-8 text-primary-600" />
                            </div>
                            <h4 className="font-bold text-primary-700 mb-1">Data Scientists</h4>
                            <p className="text-sm text-neutral-600">Specialists in data analysis, visualization, and insights</p>
                          </div>
                          
                          <div className="bg-gradient-to-br from-white to-primary-50 p-6 rounded-lg border border-primary-100 shadow-sm flex flex-col items-center text-center">
                            <div className="bg-white p-3 rounded-full border border-primary-200 shadow-sm mb-3">
                              <Users className="h-8 w-8 text-primary-600" />
                            </div>
                            <h4 className="font-bold text-primary-700 mb-1">Sector Practitioners</h4>
                            <p className="text-sm text-neutral-600">Professionals with direct experience in social impact work</p>
                          </div>
                          
                          <div className="bg-gradient-to-br from-white to-primary-50 p-6 rounded-lg border border-primary-100 shadow-sm flex flex-col items-center text-center">
                            <div className="bg-white p-3 rounded-full border border-primary-200 shadow-sm mb-3">
                              <GraduationCap className="h-8 w-8 text-primary-600" />
                            </div>
                            <h4 className="font-bold text-primary-700 mb-1">Academic Partners</h4>
                            <p className="text-sm text-neutral-600">Researchers contributing methodological rigor</p>
                          </div>
                          
                          <div className="bg-gradient-to-br from-white to-primary-50 p-6 rounded-lg border border-primary-100 shadow-sm flex flex-col items-center text-center">
                            <div className="bg-white p-3 rounded-full border border-primary-200 shadow-sm mb-3">
                              <Building className="h-8 w-8 text-primary-600" />
                            </div>
                            <h4 className="font-bold text-primary-700 mb-1">Governance Experts</h4>
                            <p className="text-sm text-neutral-600">Specialists in accountability and ethical frameworks</p>
                          </div>
                          
                          <div className="bg-gradient-to-br from-white to-primary-50 p-6 rounded-lg border border-primary-100 shadow-sm flex flex-col items-center text-center">
                            <div className="bg-white p-3 rounded-full border border-primary-200 shadow-sm mb-3">
                              <LineChart className="h-8 w-8 text-primary-600" />
                            </div>
                            <h4 className="font-bold text-primary-700 mb-1">Technology Team</h4>
                            <p className="text-sm text-neutral-600">Developers building accessible, user-friendly tools</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-semibold mb-4 text-primary-700">Advisory Council</h3>
                        <p className="mb-6 text-neutral-700">
                          Our methodology is guided by an advisory council representing diverse perspectives:
                        </p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div className="p-4 border border-primary-100 rounded-lg bg-primary-50 flex items-center justify-center text-center">
                            <h4 className="font-medium text-primary-700">Non-Profit Leaders</h4>
                          </div>
                          <div className="p-4 border border-primary-100 rounded-lg bg-primary-50 flex items-center justify-center text-center">
                            <h4 className="font-medium text-primary-700">Academic Institutions</h4>
                          </div>
                          <div className="p-4 border border-primary-100 rounded-lg bg-primary-50 flex items-center justify-center text-center">
                            <h4 className="font-medium text-primary-700">Impact Funders</h4>
                          </div>
                          <div className="p-4 border border-primary-100 rounded-lg bg-primary-50 flex items-center justify-center text-center">
                            <h4 className="font-medium text-primary-700">Government Representatives</h4>
                          </div>
                          <div className="p-4 border border-primary-100 rounded-lg bg-primary-50 flex items-center justify-center text-center">
                            <h4 className="font-medium text-primary-700">Corporate Partners</h4>
                          </div>
                          <div className="p-4 border border-primary-100 rounded-lg bg-primary-50 flex items-center justify-center text-center">
                            <h4 className="font-medium text-primary-700">Community Voices</h4>
                          </div>
                        </div>
                        
                        <div className="mt-8 p-6 bg-primary-50 rounded-lg border border-primary-100">
                          <h3 className="font-bold text-lg mb-3 text-primary-700">Our Commitment</h3>
                          <p className="text-neutral-700">
                            Basic Impacts is committed to continuous improvement. We regularly review and refine our methodology based on stakeholder feedback, emerging best practices, data analysis, and technical innovations. Our goal is to create a dynamic, responsive ecosystem that effectively captures, measures, and communicates meaningful social impact.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default MethodologyPage;