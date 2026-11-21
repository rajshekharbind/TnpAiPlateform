import { useState, useEffect } from 'react';
import { Briefcase, Building2, Video, TrendingUp, Calendar, CheckCircle, AlertCircle, Star, Clock, ArrowRight, Zap, Search, Loader, Code, FileText, Target, Award, Sparkles } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Progress } from '@/app/components/ui/progress';
import { Input } from '@/app/components/ui/input';
import { detectBackendPort } from '@/utils/portDetection';

interface DashboardProps {
  setView: (view: any) => void;
  userRole: 'student' | 'coordinator' | 'admin';
  userName: string;
  searchQuery?: string;
}

interface DashboardStats {
  totalInterviews: number;
  averageScore: number;
  completedApplications: number;
  upcomingInterviews: number;
  companiesFollowing: number;
  resumeScores: number;
  dsaProblemsSolved: number;
  oaAttempts: number;
}

const DEFAULT_STATS: DashboardStats = {
  totalInterviews: 14,
  averageScore: 84,
  completedApplications: 12,
  upcomingInterviews: 3,
  companiesFollowing: 8,
  resumeScores: 92,
  dsaProblemsSolved: 68,
  oaAttempts: 5,
};

const DEFAULT_ACTIVITIES = [
  {
    id: 1,
    type: 'interview_completed',
    title: 'Mock Interview Completed',
    description: 'Google - Full Stack & System Design (Score: 88%)',
    date: 'Today, 2:30 PM',
    icon: '🎯',
  },
  {
    id: 2,
    type: 'oa_submitted',
    title: 'Online Assessment Solved',
    description: 'Amazon OA Simulation - 100% Score',
    date: 'Yesterday, 5:15 PM',
    icon: '⚡',
  },
  {
    id: 3,
    type: 'resume_analyzed',
    title: 'ATS Resume Scored',
    description: 'Resume matched 92% with Software Engineer roles',
    date: '2 days ago',
    icon: '📄',
  },
];

const DEFAULT_UPCOMING_INTERVIEWS = [
  { company: 'Google', date: '2026-03-05', time: '10:00 AM', type: 'Technical Round 1' },
  { company: 'Microsoft', date: '2026-03-08', time: '02:30 PM', type: 'System Design Round' },
  { company: 'Amazon', date: '2026-03-12', time: '11:00 AM', type: 'Bar Raiser Round' },
];

export default function Dashboard({ setView, userRole, userName, searchQuery: globalSearchQuery = '' }: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>(DEFAULT_STATS);
  const [dashboardOverview, setDashboardOverview] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>(DEFAULT_ACTIVITIES);
  const [loading, setLoading] = useState(false);
  
  // Use global search if provided, otherwise use local search
  const activeSearchQuery = globalSearchQuery || searchQuery;
  
  // Fetch dashboard data from backend with resilient offline defaults
  useEffect(() => {
    let isMounted = true;
    const fetchDashboardData = async () => {
      try {
        const backendUrl = await detectBackendPort();
        
        const [statsRes, overviewRes, activityRes] = await Promise.allSettled([
          fetch(`${backendUrl}/api/v1/dashboard/stats`),
          fetch(`${backendUrl}/api/v1/dashboard/overview`),
          fetch(`${backendUrl}/api/v1/dashboard/recent-activity`)
        ]);
        
        if (!isMounted) return;

        if (statsRes.status === 'fulfilled' && statsRes.value.ok) {
          const statsData = await statsRes.value.json();
          if (statsData?.data) {
            setDashboardStats(statsData.data);
          }
        }
        
        if (overviewRes.status === 'fulfilled' && overviewRes.value.ok) {
          const overviewData = await overviewRes.value.json();
          if (overviewData?.data) {
            setDashboardOverview(overviewData.data);
          }
        }
        
        if (activityRes.status === 'fulfilled' && activityRes.value.ok) {
          const activityData = await activityRes.value.json();
          if (activityData?.data && Array.isArray(activityData.data) && activityData.data.length > 0) {
            setRecentActivity(activityData.data);
          }
        }
      } catch (err) {
        console.warn('Dashboard using built-in realistic mock data:', err);
      }
    };
    
    fetchDashboardData();
    return () => {
      isMounted = false;
    };
  }, []);
  
  // Map stats to display format
  const studentStats = dashboardStats ? [
    { label: 'Total Interviews', value: dashboardStats.totalInterviews.toString(), icon: Video, color: 'from-blue-500 to-blue-600', change: `${dashboardStats.averageScore}%`, bgColor: 'bg-blue-50', textColor: 'text-blue-600' },
    { label: 'Average Score', value: `${dashboardStats.averageScore}%`, icon: Star, color: 'from-green-500 to-green-600', change: '+8%', bgColor: 'bg-green-50', textColor: 'text-green-600' },
    { label: 'Completed Applications', value: dashboardStats.completedApplications.toString(), icon: CheckCircle, color: 'from-purple-500 to-purple-600', change: '+5%', bgColor: 'bg-purple-50', textColor: 'text-purple-600' },
    { label: 'Companies Following', value: dashboardStats.companiesFollowing.toString(), icon: Building2, color: 'from-orange-500 to-orange-600', change: '+2', bgColor: 'bg-orange-50', textColor: 'text-orange-600' },
  ] : [];

  const coordinatorStats = [
    { label: 'Total Students', value: '450', icon: Briefcase, color: 'from-blue-500 to-blue-600', change: '+15', bgColor: 'bg-blue-50', textColor: 'text-blue-600' },
    { label: 'Active Recruiters', value: '28', icon: Building2, color: 'from-green-500 to-green-600', change: '+4', bgColor: 'bg-green-50', textColor: 'text-green-600' },
    { label: 'Placement Offers', value: '156', icon: CheckCircle, color: 'from-purple-500 to-purple-600', change: '+23%', bgColor: 'bg-purple-50', textColor: 'text-purple-600' },
    { label: 'Upcoming Drives', value: '8', icon: Calendar, color: 'from-orange-500 to-orange-600', change: '+2', bgColor: 'bg-orange-50', textColor: 'text-orange-600' },
  ];

  const stats = userRole === 'student' ? studentStats : coordinatorStats;

  const recentOpportunities = [
    {
      id: 1,
      company: 'Google',
      role: 'Software Engineer Intern',
      location: 'Bangalore',
      ctc: '₹12-15 LPA',
      match: 95,
      deadline: '2026-02-15',
      type: 'Internship',
    },
    {
      id: 2,
      company: 'Microsoft',
      role: 'Full Stack Developer',
      location: 'Hyderabad',
      ctc: '₹18-22 LPA',
      match: 92,
      deadline: '2026-02-20',
      type: 'Full-time',
    },
    {
      id: 3,
      company: 'Amazon',
      role: 'Backend Engineer',
      location: 'Bangalore',
      ctc: '₹20-25 LPA',
      match: 88,
      deadline: '2026-02-18',
      type: 'Full-time',
    },
  ];

  const upcomingInterviews = dashboardOverview?.upcomingInterviews || DEFAULT_UPCOMING_INTERVIEWS;

  // Filter opportunities based on search
  const filteredOpportunities = recentOpportunities.filter(opp =>
    opp.company.toLowerCase().includes(activeSearchQuery.toLowerCase()) ||
    opp.role.toLowerCase().includes(activeSearchQuery.toLowerCase()) ||
    opp.location.toLowerCase().includes(activeSearchQuery.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl md:text-3xl">👋</span>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white">
              Welcome back, {userName.split(' ')[0]}!
            </h1>
          </div>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400">
            {userRole === 'student' 
              ? "Your centralized hub for LeetCode practice, AI interviews, ATS scoring, and hiring drives."
              : "Here's an overview of the current placement season and student progress."}
          </p>
        </div>

        {/* Quick Launch LeetCode / Live Coding Button */}
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => setView('live-coding')}
            className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white shadow-lg shadow-blue-500/20 gap-2 h-11 px-5"
          >
            <Code className="size-4" />
            Launch Live Coding
          </Button>
          <Button
            variant="outline"
            onClick={() => setView('interview')}
            className="border-slate-300 dark:border-slate-700 gap-2 h-11"
          >
            <Video className="size-4 text-purple-600" />
            Mock Interview
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-5 border-2 hover:shadow-xl transition-all hover:-translate-y-0.5 bg-white dark:bg-slate-800">
              <div className="flex items-start justify-between mb-3">
                <div className={`${stat.bgColor} p-2.5 rounded-xl`}>
                  <Icon className={`size-5 md:size-6 ${stat.textColor}`} />
                </div>
                <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-0 text-xs font-semibold">{stat.change}</Badge>
              </div>
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mb-1">{stat.label}</p>
              <p className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">{stat.value}</p>
            </Card>
          );
        })}
      </div>

      {/* Main Grid: Opportunities & Sidebars */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Matched Opportunities & Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-5 md:p-6 border-2 shadow-sm bg-white dark:bg-slate-800">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-950/60 rounded-xl">
                  <Briefcase className="size-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
                    {userRole === 'student' ? 'Top Matched Opportunities' : 'Recent Job Postings'}
                  </h2>
                  <p className="text-xs text-slate-500">Based on your skills & eligibility criteria</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setView('jobs')} className="gap-1.5 text-xs">
                View All Jobs
                <ArrowRight className="size-3.5" />
              </Button>
            </div>
            
            <div className="space-y-3">
              {filteredOpportunities.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-500 text-sm">No opportunities found matching your search.</p>
                </div>
              ) : (
                filteredOpportunities.map((opp) => (
                  <div 
                    key={opp.id} 
                    className="group p-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-blue-400 hover:shadow-md transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-800/50" 
                    onClick={() => setView('jobs')}
                  >
                    <div className="flex items-start gap-4">
                      <div className="size-12 bg-gradient-to-br from-blue-500/10 to-indigo-500/20 text-blue-700 dark:text-blue-300 font-bold text-lg rounded-xl flex items-center justify-center border border-blue-200 dark:border-blue-800 flex-shrink-0">
                        {opp.company.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div>
                            <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-base truncate">
                              {opp.role}
                            </h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{opp.company} • {opp.location}</p>
                          </div>
                          {userRole === 'student' && (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-full flex-shrink-0">
                              <Star className="size-3.5 text-emerald-600 fill-emerald-600" />
                              <span className="font-bold text-xs text-emerald-700 dark:text-emerald-300">{opp.match}% Match</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2.5 mt-2 flex-wrap">
                          <Badge variant="secondary" className="text-xs font-normal">{opp.type}</Badge>
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{opp.ctc}</span>
                          <span className="text-xs text-slate-500">• Apply by: {opp.deadline}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Recent Activity Feed */}
          <Card className="p-5 md:p-6 border-2 shadow-sm bg-white dark:bg-slate-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-950/60 rounded-xl">
                <Sparkles className="size-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Activity & Milestones</h3>
            </div>
            <div className="space-y-3">
              {recentActivity.map((act) => (
                <div key={act.id} className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 dark:border-slate-700/60 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{act.icon || '📌'}</span>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{act.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{act.description}</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 whitespace-nowrap">{act.date}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Sidebar: Upcoming Interviews & Quick Actions */}
        <div className="space-y-6">
          {/* Upcoming Interviews */}
          <Card className="p-5 md:p-6 border-2 shadow-sm bg-white dark:bg-slate-800">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-purple-100 dark:bg-purple-950/60 rounded-xl">
                <Calendar className="size-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white">Upcoming Interviews</h3>
            </div>
            <div className="space-y-2.5">
              {upcomingInterviews.map((interview, index) => (
                <div key={index} className="p-3.5 bg-gradient-to-r from-purple-50/60 to-blue-50/60 dark:from-slate-800 dark:to-slate-750 rounded-xl border border-purple-200/60 dark:border-purple-900/40">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-sm">{interview.company}</p>
                      <p className="text-xs text-purple-700 dark:text-purple-400 font-medium mb-1.5">{interview.type}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px] bg-white dark:bg-slate-800">Confirmed</Badge>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                    <Clock className="size-3 text-slate-400" />
                    <span>{interview.date} • {interview.time}</span>
                  </div>
                </div>
              ))}
            </div>
            <Button 
              className="w-full mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-95 text-white" 
              onClick={() => setView('interview')}
            >
              <Video className="size-4 mr-2" />
              Practice Mock Interview
            </Button>
          </Card>

          {/* Quick Actions Grid */}
          <Card className="p-5 md:p-6 border-2 shadow-sm bg-white dark:bg-slate-800">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="size-5 text-amber-500" />
              <h3 className="font-bold text-slate-900 dark:text-white">Quick Preparation Tools</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="justify-start gap-2 h-10 border-slate-200 dark:border-slate-700 text-xs font-semibold" 
                onClick={() => setView('live-coding')}
              >
                <Code className="size-3.5 text-blue-600" />
                Live Coding
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="justify-start gap-2 h-10 border-slate-200 dark:border-slate-700 text-xs font-semibold" 
                onClick={() => setView('resume-ats')}
              >
                <FileText className="size-3.5 text-emerald-600" />
                Resume ATS
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="justify-start gap-2 h-10 border-slate-200 dark:border-slate-700 text-xs font-semibold" 
                onClick={() => setView('dsa-tracker')}
              >
                <Target className="size-3.5 text-purple-600" />
                DSA Tracker
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="justify-start gap-2 h-10 border-slate-200 dark:border-slate-700 text-xs font-semibold" 
                onClick={() => setView('oa-practice')}
              >
                <Clock className="size-3.5 text-orange-600" />
                OA Practice
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="justify-start gap-2 h-10 border-slate-200 dark:border-slate-700 text-xs font-semibold" 
                onClick={() => setView('skill-gap')}
              >
                <Award className="size-3.5 text-pink-600" />
                Skill Gap
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="justify-start gap-2 h-10 border-slate-200 dark:border-slate-700 text-xs font-semibold" 
                onClick={() => setView('project-prep')}
              >
                <Briefcase className="size-3.5 text-indigo-600" />
                Project Prep
              </Button>
            </div>
          </Card>

          {/* Placement Readiness Progress */}
          <Card className="p-5 md:p-6 border-2 shadow-sm bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-blue-500/5 dark:bg-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Placement Readiness</h3>
              <Badge className="bg-emerald-600 text-white text-[10px]">High Preparedness</Badge>
            </div>
            <div className="space-y-3.5">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Profile Completeness</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">DSA & Algorithms</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">84%</span>
                </div>
                <Progress value={84} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">System Design & Projects</span>
                  <span className="font-bold text-purple-600 dark:text-purple-400">76%</span>
                </div>
                <Progress value={76} className="h-2" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}