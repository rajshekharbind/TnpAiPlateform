import React, { useState } from 'react';
import { BookOpen, Play, Award, Target, TrendingUp, Code, Users, CheckCircle, Plus, ExternalLink, HelpCircle, Copy, Sparkles, Layers, ShieldCheck, ChevronRight, Server, Database, Cpu } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Progress } from '@/app/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Label } from '@/app/components/ui/label';

interface InterviewQuestion {
  question: string;
  answer: string;
  tips: string;
}

interface ProjectPrep {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  technologies: string[];
  duration: number; // in hours
  status: 'not-started' | 'in-progress' | 'completed';
  progress: number;
  architecture: string;
  starResponse: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
  keyInterviewQuestions: InterviewQuestion[];
  resumeBulletPoints: string[];
}

export default function ProjectInterviewPrep() {
  const [projects, setProjects] = useState<ProjectPrep[]>([
    {
      id: '1',
      title: 'Scalable E-Commerce Microservices & Payment Gateway',
      description: 'Distributed microservices backend with idempotency, event-driven architecture, Stripe integration, and Redis caching.',
      difficulty: 'advanced',
      technologies: ['Node.js', 'Express', 'Redis', 'PostgreSQL', 'Docker', 'RabbitMQ', 'Stripe API'],
      duration: 35,
      status: 'in-progress',
      progress: 75,
      architecture: 'API Gateway -> Auth Service (JWT) & Order Service -> RabbitMQ Message Broker -> Inventory Service & Payment Webhook Handler. Redis handles product catalog caching with TTL cache invalidation.',
      starResponse: {
        situation: 'E-commerce flash sales were causing database lock contention and duplicate payment charges during peak order surges.',
        task: 'Redesign the ordering and payment subsystem to guarantee 99.9% uptime, idempotency on checkout, and sub-50ms catalog query latencies.',
        action: 'Implemented distributed locking via Redlock in Redis, decoupled order placement with an asynchronous RabbitMQ queue, and integrated idempotent Stripe webhook verification.',
        result: 'Eliminated duplicate transactions entirely, handled 2,500+ requests/second in load testing, and slashed P99 latency from 450ms down to 38ms.'
      },
      keyInterviewQuestions: [
        {
          question: 'How do you guarantee that a user is not double-charged if their network times out during checkout?',
          answer: 'We generate a unique Idempotency-Key on the frontend before calling the checkout API. The backend caches this key in Redis with a pending state. If a duplicate request arrives with the same key, it returns the cached result instead of re-charging.',
          tips: 'Always mention idempotency keys, HTTP status 409 Conflict, and atomic Redis operations (SETNX).'
        },
        {
          question: 'How do you handle cache invalidation when a product stock level changes?',
          answer: 'We use write-through invalidation: whenever an order successfully reserves inventory, a message is published to Redis pub/sub to purge the cached product detail key, ensuring subsequent reads fetch the fresh stock count.',
          tips: 'Discuss cache-aside vs write-through tradeoffs.'
        }
      ],
      resumeBulletPoints: [
        'Architected an event-driven microservices backend handling 2,500+ peak RPS with RabbitMQ and Redis caching.',
        'Engineered idempotent checkout flows using distributed Redis locks (Redlock), completely preventing duplicate payment charges.',
        'Containerized 4 microservices using Docker Compose, reducing local developer onboarding time by 60%.'
      ]
    },
    {
      id: '2',
      title: 'Real-Time Collaborative Live Code & Chat Platform',
      description: 'Full-stack platform enabling paired technical interviews, live syntax-highlighted code execution, and low-latency audio/video collaboration.',
      difficulty: 'intermediate',
      technologies: ['React', 'TypeScript', 'Node.js', 'Socket.IO', 'WebRTC', 'Monaco Editor'],
      duration: 25,
      status: 'completed',
      progress: 100,
      architecture: 'React frontend embeds Monaco Editor. Socket.IO manages room state and sends delta code patches. Node.js backend spawns sandboxed child processes to execute code, while WebRTC mesh handles peer-to-peer video streaming.',
      starResponse: {
        situation: 'Remote engineering interview candidates struggled with laggy screen shares and fragmented tools for code testing and discussion.',
        task: 'Build a centralized live coding workspace with real-time synchronized editing, remote code runner, and integrated video chat.',
        action: 'Leveraged Socket.IO rooms for diff broadcast, integrated Monaco Editor with AST-based delta synchronization, and implemented a sandboxed Node execution runner with timeout termination.',
        result: 'Achieved sub-20ms keystroke sync latency across cross-continental connections and successfully powered 50+ live mock interview test rounds.'
      },
      keyInterviewQuestions: [
        {
          question: 'How do you prevent malicious code execution (e.g., infinite loops, fork bombs) in the code runner?',
          answer: 'Code runs in an isolated worker process with strict memory caps (256MB) and a hard execution timeout (3 seconds). Standard library imports are filtered and process credentials are non-root.',
          tips: 'Mention containerized sandboxing (Docker/gVisor), CPU quotas, and timeout signals (SIGKILL).'
        },
        {
          question: 'How do you handle conflict resolution when two users edit the same line simultaneously?',
          answer: 'We use Operational Transformation (OT) / CRDTs to transform incoming character index offsets against pending local edits before applying them to the editor buffer.',
          tips: 'Briefly contrast Operational Transformation (OT) with Conflict-free Replicated Data Types (CRDT).'
        }
      ],
      resumeBulletPoints: [
        'Built a real-time collaborative coding platform with Monaco Editor and Socket.IO, achieving sub-20ms synchronized editing.',
        'Developed a multi-language sandboxed code executor with memory boundaries and hard timeout cancellation.',
        'Implemented WebRTC peer-to-peer video and audio channels, eliminating reliance on third-party meeting links.'
      ]
    },
    {
      id: '3',
      title: 'AI Placement & Resume ATS Optimization Engine',
      description: 'Intelligent resume parser and scoring pipeline extracting skills, quantifying achievements, and generating custom interview prep roadmaps.',
      difficulty: 'intermediate',
      technologies: ['Python', 'FastAPI', 'spaCy', 'LangChain', 'OpenAI API', 'React', 'Tailwind CSS'],
      duration: 20,
      status: 'in-progress',
      progress: 80,
      architecture: 'PDF/DOCX extraction -> spaCy NLP entity recognizer extracts skills and work history -> Vector embeddings computed and compared against job descriptions -> FastAPI endpoints return ATS score and actionable recommendations.',
      starResponse: {
        situation: 'Students were repeatedly rejected by automated applicant tracking systems (ATS) due to mismatched keywords and poor structural formatting.',
        task: 'Create an automated analyzer that provides instant ATS match scores, missing keyword detection, and customized interview question prep.',
        action: 'Trained custom spaCy NER patterns for tech stacks, calculated cosine similarity between resume and job vectors, and formulated targeted improvement tips.',
        result: 'Over 85% of pilot students increased their ATS resume scores past the 80th percentile and secured interviews with top tech firms.'
      },
      keyInterviewQuestions: [
        {
          question: 'How do you calculate semantic similarity between a resume and a job description beyond simple keyword string matching?',
          answer: 'We generate sentence embeddings using pre-trained transformer models and compute cosine similarity between the resume vector and the job requirement vector. This matches synonyms like "Kubernetes" and "k8s container orchestration".',
          tips: 'Demonstrate understanding of word embeddings, vector databases, and semantic search.'
        }
      ],
      resumeBulletPoints: [
        'Built an AI-driven resume scoring engine calculating semantic keyword overlap and formatting quality.',
        'Processed over 300+ resumes with spaCy NLP pipeline, achieving 94% precision in skill extraction.',
        'Developed a responsive React + Tailwind frontend with real-time score breakdowns and targeted suggestions.'
      ]
    }
  ]);

  const [selectedProject, setSelectedProject] = useState<ProjectPrep | null>(null);
  const [filterDifficulty, setFilterDifficulty] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newTech, setNewTech] = useState('');
  const [newDifficulty, setNewDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const filteredProjects = projects.filter(p => filterDifficulty === 'all' || p.difficulty === filterDifficulty);

  const handleCopyBullet = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleAddProject = () => {
    if (!newTitle.trim()) return;
    const techs = newTech.split(',').map(t => t.trim()).filter(Boolean);
    const newProj: ProjectPrep = {
      id: `proj-${Date.now()}`,
      title: newTitle,
      description: newDesc || 'Custom student engineering project for campus placements.',
      difficulty: newDifficulty,
      technologies: techs.length > 0 ? techs : ['JavaScript', 'React', 'Node.js'],
      duration: 20,
      status: 'in-progress',
      progress: 30,
      architecture: 'Client-server architecture with REST API endpoints, relational database storage, and authentication.',
      starResponse: {
        situation: 'Identified a real-world workflow problem that required modern full-stack web automation.',
        task: 'Design and deliver an end-to-end scalable application with high performance and intuitive UX.',
        action: 'Developed clean modular components, integrated backend validation, and deployed the solution on cloud hosting.',
        result: 'Delivered a fully functional production system with responsive UI and verified test coverage.'
      },
      keyInterviewQuestions: [
        {
          question: `What was the most challenging technical roadblock in building ${newTitle}?`,
          answer: 'Managing data synchronization and handling asynchronous errors cleanly across network boundaries.',
          tips: 'Focus on root-cause analysis, debugging tools used, and final architectural lesson learned.'
        }
      ],
      resumeBulletPoints: [
        `Architected and deployed ${newTitle} using ${techs.slice(0, 3).join(', ')}.`,
        'Engineered responsive user interface and integrated robust backend error handling.',
        'Implemented database schemas and automated deployment workflows.'
      ]
    };

    setProjects([newProj, ...projects]);
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewDesc('');
    setNewTech('');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl shadow-lg shadow-indigo-500/20 text-white">
              <Code className="size-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
                Project Interview Preparation
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Master architectural trade-offs, STAR interview questions, and ATS resume bullets for your projects
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 text-white gap-2 shadow-md"
            >
              <Plus className="size-4" />
              Add Project
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-white dark:bg-slate-800 border-2">
            <p className="text-xs text-slate-500 mb-1">Total Projects</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{projects.length}</p>
          </Card>
          <Card className="p-4 bg-white dark:bg-slate-800 border-2">
            <p className="text-xs text-slate-500 mb-1">Interview Ready</p>
            <p className="text-2xl font-bold text-emerald-600">
              {projects.filter(p => p.status === 'completed' || p.progress >= 70).length}
            </p>
          </Card>
          <Card className="p-4 bg-white dark:bg-slate-800 border-2">
            <p className="text-xs text-slate-500 mb-1">STAR Templates</p>
            <p className="text-2xl font-bold text-blue-600">{projects.length}</p>
          </Card>
          <Card className="p-4 bg-white dark:bg-slate-800 border-2">
            <p className="text-xs text-slate-500 mb-1">Curated Tech Q&A</p>
            <p className="text-2xl font-bold text-purple-600">
              {projects.reduce((acc, p) => acc + p.keyInterviewQuestions.length, 0)}
            </p>
          </Card>
        </div>

        {/* Tabs & Filters */}
        <Tabs defaultValue="projects" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <TabsList className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <TabsTrigger value="projects">Project Portfolio</TabsTrigger>
              <TabsTrigger value="star">STAR Framework Guide</TabsTrigger>
              <TabsTrigger value="learning">Recommended Learning</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Difficulty:</span>
              {(['all', 'beginner', 'intermediate', 'advanced'] as const).map(diff => (
                <Button
                  key={diff}
                  size="sm"
                  variant={filterDifficulty === diff ? 'default' : 'outline'}
                  onClick={() => setFilterDifficulty(diff)}
                  className="capitalize text-xs h-8"
                >
                  {diff}
                </Button>
              ))}
            </div>
          </div>

          {/* Project Cards List */}
          <TabsContent value="projects">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <Card 
                  key={project.id} 
                  className="flex flex-col justify-between border-2 hover:border-blue-500 hover:shadow-xl transition-all bg-white dark:bg-slate-800"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <Badge 
                        className={
                          project.difficulty === 'advanced' 
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300' 
                            : project.difficulty === 'intermediate' 
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' 
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        }
                      >
                        {project.difficulty}
                      </Badge>
                      <span className="text-xs text-slate-500">~{project.duration} hrs</span>
                    </div>
                    <CardTitle className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1">
                      {project.title}
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                      {project.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-500">Readiness</span>
                        <span className="font-semibold text-blue-600">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {project.technologies.slice(0, 4).map(tech => (
                        <Badge key={tech} variant="secondary" className="text-[10px] font-normal">
                          {tech}
                        </Badge>
                      ))}
                      {project.technologies.length > 4 && (
                        <Badge variant="outline" className="text-[10px] font-normal">
                          +{project.technologies.length - 4} more
                        </Badge>
                      )}
                    </div>

                    <Button 
                      className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:opacity-95 text-white gap-2"
                      onClick={() => setSelectedProject(project)}
                    >
                      <Sparkles className="size-4" />
                      View Interview Prep & STAR
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* STAR Framework Explanation Tab */}
          <TabsContent value="star">
            <Card className="p-6 bg-white dark:bg-slate-800 border-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                How to Answer Project Questions with the STAR Method
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                FAANG and Tier-1 tech recruiters evaluate system and project depth using the STAR format. Here is how to structure your answers:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="size-7 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">S</span>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">Situation</h3>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Describe the context, problem statement, or bottleneck your project aimed to solve.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/20">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="size-7 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">T</span>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">Task</h3>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Explain your exact engineering goal, performance targets, and architectural constraints.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/20">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="size-7 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-xs">A</span>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">Action</h3>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Highlight the algorithms, data structures, caching, queues, and protocols you specifically implemented.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="size-7 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">R</span>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">Result</h3>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    State measurable metrics (e.g. 2500 RPS, 99.9% uptime, 40ms latency reduction, 85% ATS score).
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-100 dark:bg-slate-700/50 rounded-xl">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  💡 Interview Tip from Hiring Managers:
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Avoid saying "we used React and Node". Instead explain <em>why</em> you chose that stack over alternatives (e.g., "We picked WebSockets over long polling to reduce header overhead from 800 bytes per ping to 2 bytes, reducing network payload by 99%").
                </p>
              </div>
            </Card>
          </TabsContent>

          {/* Learning Roadmap Tab */}
          <TabsContent value="learning">
            <Card className="p-6 bg-white dark:bg-slate-800 border-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                Recommended 6-Week Placement Portfolio Roadmap
              </h2>
              <div className="space-y-4">
                {[
                  { step: 1, title: 'Week 1-2: Core DSA & Problem Solving Foundation', desc: 'Solve 50+ medium LeetCode problems covering Two Pointers, Sliding Window, Trees, and Graph BFS.' },
                  { step: 2, title: 'Week 3: Microservice REST Backend with Redis & Docker', desc: 'Build an idempotent API with rate-limiting, JWT authentication, and automated integration tests.' },
                  { step: 3, title: 'Week 4: Real-Time Event-Driven Subsystem', desc: 'Integrate WebSockets or RabbitMQ message broker for live synchronization or notifications.' },
                  { step: 4, title: 'Week 5: AI & Semantic Search Integration', desc: 'Embed vector search or LLM processing to turn basic CRUD apps into intelligent platforms.' },
                  { step: 5, title: 'Week 6: Deployment, Observability & Mock Defense', desc: 'Deploy to Cloud (Docker / Render / AWS), record a live demo, and rehearse STAR interview defenses.' },
                ].map(item => (
                  <div key={item.step} className="flex gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors">
                    <div className="size-9 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center flex-shrink-0 text-sm">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">{item.title}</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Detailed Project Modal with STAR and Q&A */}
        {selectedProject && (
          <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
            <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="capitalize">{selectedProject.difficulty}</Badge>
                  <span className="text-xs text-slate-500">Duration: ~{selectedProject.duration} hours</span>
                </div>
                <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
                  {selectedProject.title}
                </DialogTitle>
                <DialogDescription className="text-sm">
                  {selectedProject.description}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 my-4">
                {/* Tech Stack */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Technologies & Tools</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProject.technologies.map(t => (
                      <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                    ))}
                  </div>
                </div>

                {/* Architecture Overview */}
                <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/40 dark:bg-blue-950/20">
                  <div className="flex items-center gap-2 mb-2 font-bold text-sm text-blue-900 dark:text-blue-300">
                    <Server className="size-4 text-blue-600" />
                    System Architecture & Data Flow
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-mono">
                    {selectedProject.architecture}
                  </p>
                </div>

                {/* STAR Method Section */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                    STAR Framework Response (How to explain to Interviewers)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl border bg-slate-50 dark:bg-slate-800">
                      <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">📍 Situation</p>
                      <p className="text-xs text-slate-700 dark:text-slate-300">{selectedProject.starResponse.situation}</p>
                    </div>
                    <div className="p-3.5 rounded-xl border bg-slate-50 dark:bg-slate-800">
                      <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1">🎯 Task</p>
                      <p className="text-xs text-slate-700 dark:text-slate-300">{selectedProject.starResponse.task}</p>
                    </div>
                    <div className="p-3.5 rounded-xl border bg-slate-50 dark:bg-slate-800">
                      <p className="text-xs font-bold text-purple-600 dark:text-purple-400 mb-1">⚡ Action</p>
                      <p className="text-xs text-slate-700 dark:text-slate-300">{selectedProject.starResponse.action}</p>
                    </div>
                    <div className="p-3.5 rounded-xl border bg-slate-50 dark:bg-slate-800">
                      <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">🏆 Result</p>
                      <p className="text-xs text-slate-700 dark:text-slate-300">{selectedProject.starResponse.result}</p>
                    </div>
                  </div>
                </div>

                {/* Deep Dive Interview Questions */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                    Top Recruiter Deep-Dive Questions & Ideal Answers
                  </h4>
                  <div className="space-y-3">
                    {selectedProject.keyInterviewQuestions.map((q, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80">
                        <div className="flex items-start gap-2 mb-2">
                          <HelpCircle className="size-4 text-purple-600 flex-shrink-0 mt-0.5" />
                          <h5 className="font-bold text-sm text-slate-900 dark:text-white">{q.question}</h5>
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-300 mb-2 pl-6">
                          {q.answer}
                        </p>
                        <div className="pl-6 text-[11px] text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 p-2 rounded-lg">
                          💡 <strong>Pro Tip:</strong> {q.tips}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ready-to-Copy Resume Bullets */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                    ATS-Optimized Resume Bullet Points (Click to Copy)
                  </h4>
                  <div className="space-y-2">
                    {selectedProject.resumeBulletPoints.map((bullet, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => handleCopyBullet(bullet, idx)}
                        className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-blue-400 cursor-pointer transition-colors"
                      >
                        <p className="text-xs text-slate-800 dark:text-slate-200 pr-3">• {bullet}</p>
                        <Button size="sm" variant="ghost" className="h-7 px-2 text-xs flex-shrink-0">
                          {copiedIndex === idx ? (
                            <span className="text-emerald-600 font-bold flex items-center gap-1">
                              <CheckCircle className="size-3" /> Copied
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-slate-500">
                              <Copy className="size-3" /> Copy
                            </span>
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button onClick={() => setSelectedProject(null)} className="w-full">
                  Close Prep Guide
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Add Project Modal */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Personal / College Project</DialogTitle>
              <DialogDescription>
                Add your project to generate interview defense answers and ATS resume points.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 my-2">
              <div>
                <Label htmlFor="proj-title" className="text-xs">Project Title *</Label>
                <Input 
                  id="proj-title"
                  placeholder="e.g. Distributed Key-Value Store"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="proj-desc" className="text-xs">Brief Description</Label>
                <Textarea 
                  id="proj-desc"
                  placeholder="What does it do and what problem does it solve?"
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  className="mt-1"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="proj-tech" className="text-xs">Technologies (comma separated)</Label>
                <Input 
                  id="proj-tech"
                  placeholder="e.g. Go, Raft, gRPC, Docker"
                  value={newTech}
                  onChange={e => setNewTech(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
              <Button onClick={handleAddProject} className="bg-blue-600 text-white">Save Project</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
