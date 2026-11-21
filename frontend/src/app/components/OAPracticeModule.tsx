import React, { useState, useEffect } from 'react';
import { Play, CheckCircle, Clock, AlertCircle, BarChart3, Award, BookOpen, Code, Target, Edit, Trash2, Plus, Save, X, Loader, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Progress } from '@/app/components/ui/progress';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Label } from '@/app/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { api } from '@/services/api';

interface OATest {
  id: string;
  title: string;
  company: string;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number; // in minutes
  totalQuestions: number;
  passingScore: number;
  categories: string[];
  description: string;
  attempts: number;
  bestScore: number;
  status: 'not-started' | 'in-progress' | 'completed';
  completedDate?: string;
  questions: Question[];
  user_id?: string;
  tenant_id?: string;
  isPublished?: boolean;
  userAnswers?: (string | number)[];
  correctAnswersCount?: number;
}

interface Question {
  id: string;
  type: 'mcq' | 'coding' | 'true-false' | 'numerical';
  question: string;
  difficulty: string;
  timeLimit: number;
  options?: string[];
  correctAnswer?: string | number;
  userAnswer?: string | number;
  isCorrect?: boolean;
  explanation?: string;
  category?: string;
}

interface StudentProgress {
  testId: string;
  completed: number;
  score: number;
  timeTaken: number;
  accuracy: number;
}

const DEFAULT_OA_TESTS: OATest[] = [
  {
    id: 'oa-test-1',
    title: 'Google Online Assessment (SWE 2026)',
    company: 'Google',
    difficulty: 'hard',
    duration: 60,
    totalQuestions: 4,
    passingScore: 75,
    categories: ['DSA', 'Dynamic Programming', 'Graph Theory'],
    description: 'Official simulation of Google SWE hiring assessment with algorithms and complex problem solving.',
    attempts: 320,
    bestScore: 92,
    status: 'not-started',
    questions: [
      {
        id: 'q1-1',
        type: 'mcq',
        question: 'What is the time complexity to find the shortest path in an unweighted graph using Breadth-First Search (BFS)?',
        difficulty: 'medium',
        timeLimit: 120,
        options: ['O(V + E)', 'O(V * E)', 'O(V log V)', 'O(E^2)'],
        correctAnswer: 0,
        explanation: 'BFS visits every vertex and explores every edge once, yielding O(V + E) time complexity.',
        category: 'Graph Theory'
      },
      {
        id: 'q1-2',
        type: 'mcq',
        question: 'Which data structure is optimal for implementing an LRU (Least Recently Used) cache with O(1) operations?',
        difficulty: 'medium',
        timeLimit: 120,
        options: ['Binary Search Tree + Array', 'Doubly Linked List + Hash Map', 'Stack + Queue', 'Min-Heap + Set'],
        correctAnswer: 1,
        explanation: 'A Hash Map provides O(1) key lookup, while a Doubly Linked List provides O(1) node removal and insertion at the head.',
        category: 'Data Structures'
      },
      {
        id: 'q1-3',
        type: 'mcq',
        question: 'In dynamic programming, what is the primary prerequisite for an optimal substructure problem?',
        difficulty: 'hard',
        timeLimit: 180,
        options: ['Greedy choice property', 'An optimal solution contains optimal solutions to subproblems', 'Non-overlapping subproblems', 'Subproblems must be solvable in linear time'],
        correctAnswer: 1,
        explanation: 'Optimal substructure means the optimal solution of a problem can be constructed from optimal solutions of its subproblems.',
        category: 'Dynamic Programming'
      },
      {
        id: 'q1-4',
        type: 'mcq',
        question: 'What is the amortized time complexity of inserting n elements into an initially empty dynamic array?',
        difficulty: 'medium',
        timeLimit: 120,
        options: ['O(n^2)', 'O(n log n)', 'O(n) overall, O(1) amortized per insert', 'O(1) worst-case per insert'],
        correctAnswer: 2,
        explanation: 'Geometric array doubling results in a total of 2n operations across n insertions, giving O(1) amortized time per insertion.',
        category: 'Algorithms'
      }
    ]
  },
  {
    id: 'oa-test-2',
    title: 'Amazon SDE-1 OA Simulation',
    company: 'Amazon',
    difficulty: 'medium',
    duration: 45,
    totalQuestions: 4,
    passingScore: 70,
    categories: ['Arrays', 'Strings', 'Leadership Principles', 'Complexity'],
    description: 'Practice Amazon SDE-1 coding assessment covering algorithmic questions and scenario judgment.',
    attempts: 485,
    bestScore: 88,
    status: 'not-started',
    questions: [
      {
        id: 'q2-1',
        type: 'mcq',
        question: 'In Amazon Leadership Principles, which principle directly stresses "Leaders are never done learning and always seek to improve themselves"?',
        difficulty: 'easy',
        timeLimit: 60,
        options: ['Customer Obsession', 'Learn and Be Curious', 'Deliver Results', 'Bias for Action'],
        correctAnswer: 1,
        explanation: 'Learn and Be Curious highlights continuous learning and exploring new possibilities.',
        category: 'Behavioral'
      },
      {
        id: 'q2-2',
        type: 'mcq',
        question: 'Given an array of integers, which algorithm finds a pair of numbers that sum to a target in O(n) time and O(n) space?',
        difficulty: 'easy',
        timeLimit: 90,
        options: ['Two-pointer after O(n log n) sort', 'Hash Map lookup for target - num', 'Brute force double nested loop', 'Binary search tree traversal'],
        correctAnswer: 1,
        explanation: 'A Hash Map storing visited complements achieves one-pass O(n) time complexity.',
        category: 'Arrays'
      },
      {
        id: 'q2-3',
        type: 'mcq',
        question: 'What is the worst-case time complexity of QuickSelect when choosing the pivot naively?',
        difficulty: 'medium',
        timeLimit: 120,
        options: ['O(n log n)', 'O(n^2)', 'O(n)', 'O(log n)'],
        correctAnswer: 1,
        explanation: 'If the array is already sorted and the first element is chosen as pivot, partition sizes are 0 and n-1, producing O(n^2) worst-case time.',
        category: 'Algorithms'
      },
      {
        id: 'q2-4',
        type: 'mcq',
        question: 'Which locking mechanism avoids thread deadlocks when acquiring multiple mutexes in concurrent programming?',
        difficulty: 'hard',
        timeLimit: 120,
        options: ['Spinlocks', 'Global acquisition order (Lock Hierarchy)', 'Yielding after failure', 'Double-checked locking'],
        correctAnswer: 1,
        explanation: 'Strict global lock ordering prevents circular wait conditions, eliminating deadlocks.',
        category: 'Concurrency'
      }
    ]
  },
  {
    id: 'oa-test-3',
    title: 'Microsoft Core CS & Architecture Assessment',
    company: 'Microsoft',
    difficulty: 'medium',
    duration: 40,
    totalQuestions: 4,
    passingScore: 65,
    categories: ['OS', 'DBMS', 'Computer Networks', 'OOPS'],
    description: 'Comprehensive test covering OS memory management, relational databases, ACID, and networking protocols.',
    attempts: 290,
    bestScore: 95,
    status: 'not-started',
    questions: [
      {
        id: 'q3-1',
        type: 'mcq',
        question: 'What is the primary purpose of Virtual Memory in Modern Operating Systems?',
        difficulty: 'easy',
        timeLimit: 90,
        options: ['To speed up CPU clock cycles', 'To give processes an isolated uniform address space larger than physical RAM', 'To encrypt disk files', 'To prevent multi-threading'],
        correctAnswer: 1,
        explanation: 'Virtual memory isolates process address spaces and permits paging between RAM and secondary storage.',
        category: 'Operating Systems'
      },
      {
        id: 'q3-2',
        type: 'mcq',
        question: 'Which ACID property ensures that changes committed by a transaction survive system crashes or power failures?',
        difficulty: 'easy',
        timeLimit: 90,
        options: ['Atomicity', 'Consistency', 'Isolation', 'Durability'],
        correctAnswer: 3,
        explanation: 'Durability guarantees that once a transaction has committed, its updates persist even across crashes via write-ahead logging.',
        category: 'DBMS'
      },
      {
        id: 'q3-3',
        type: 'mcq',
        question: 'In TCP protocol, what packets are exchanged during the standard 3-way handshake to establish a connection?',
        difficulty: 'medium',
        timeLimit: 90,
        options: ['SYN -> SYN-ACK -> ACK', 'ACK -> SYN -> SYN-ACK', 'SYN -> ACK -> FIN', 'RST -> SYN -> ACK'],
        correctAnswer: 0,
        explanation: 'The client sends SYN, the server responds with SYN-ACK, and the client confirms with ACK.',
        category: 'Computer Networks'
      },
      {
        id: 'q3-4',
        type: 'mcq',
        question: 'In SOLID principles, which principle states that software entities should be open for extension but closed for modification?',
        difficulty: 'easy',
        timeLimit: 90,
        options: ['Single Responsibility Principle', 'Open/Closed Principle', 'Liskov Substitution Principle', 'Dependency Inversion Principle'],
        correctAnswer: 1,
        explanation: 'The Open/Closed Principle (OCP) encourages polymorphic designs that allow adding new behaviors without modifying existing code.',
        category: 'OOPS'
      }
    ]
  }
];

export default function OAPracticeModule() {
  // State Management
  const [tests, setTests] = useState<OATest[]>(DEFAULT_OA_TESTS);
  const [currentTest, setCurrentTest] = useState<OATest | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [userAnswers, setUserAnswers] = useState<(string | number)[]>([]);
  const [testResults, setTestResults] = useState<any>(null);
  
  // Loading and Error States
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form States
  const [formData, setFormData] = useState<Partial<OATest>>({
    title: '',
    company: '',
    difficulty: 'medium',
    duration: 60,
    totalQuestions: 25,
    passingScore: 60,
  });

  // Fetch tests from API on component mount with graceful fallback
  useEffect(() => {
    let isMounted = true;
    const fetchTests = async () => {
      try {
        setError(null);
        const userId = localStorage.getItem('userId') || 'default-user';
        const tenantId = localStorage.getItem('tenantId') || 'default-tenant';
        
        const response = await api.get('/api/v1/oa-tests/list', {
          headers: {
            'x-tenant-id': tenantId,
            'x-user-id': userId,
          },
        });
        
        if (isMounted && response.data && response.data.tests && response.data.tests.length > 0) {
          setTests(response.data.tests);
        }
      } catch (err: any) {
        console.warn('Using default pre-loaded OA tests:', err);
        if (isMounted) {
          setTests(DEFAULT_OA_TESTS);
        }
      }
    };

    fetchTests();
    return () => {
      isMounted = false;
    };
  }, []);

  // Handler: Start Test
  const handleStartTest = async (test: OATest) => {
    try {
      setError(null);
      setIsLoading(true);
      
      const userId = localStorage.getItem('userId') || 'default-user';
      const tenantId = localStorage.getItem('tenantId') || 'default-tenant';
      
      let testToStart = test;
      try {
        const response = await api.post(
          `/api/v1/oa-tests/${test.id}/start`,
          {},
          {
            headers: {
              'x-tenant-id': tenantId,
              'x-user-id': userId,
            },
          }
        );
        if (response.data && response.data.questions && response.data.questions.length > 0) {
          testToStart = response.data;
        }
      } catch (networkErr) {
        console.log('Starting test locally using embedded question bank:', networkErr);
      }

      if (testToStart && testToStart.questions && testToStart.questions.length > 0) {
        setCurrentTest(testToStart);
        setCurrentQuestionIndex(0);
        setUserAnswers(new Array(testToStart.questions.length).fill(null));
        setShowResults(false);
        setTestResults(null);
      } else {
        setError('Test has no questions. Please select another assessment.');
      }
    } catch (err: any) {
      console.error('Error starting test:', err);
      setError('Failed to start test. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handler: Answer Question
  const handleAnswerQuestion = (answer: string | number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answer;
    setUserAnswers(newAnswers);
  };

  // Handler: Next Question
  const handleNextQuestion = () => {
    if (currentTest && currentQuestionIndex < currentTest.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentTest && currentQuestionIndex === currentTest.questions.length - 1) {
      // Ready to submit
      handleSubmitTest();
    }
  };

  // Handler: Previous Question
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Handler: Submit Test
  const handleSubmitTest = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      if (!currentTest) {
        throw new Error('No test is currently active');
      }

      const userId = localStorage.getItem('userId') || 'default-user';
      const tenantId = localStorage.getItem('tenantId') || 'default-tenant';
      
      let submissionResult = null;
      try {
        const response = await api.post(
          `/api/v1/oa-tests/${currentTest.id}/submit`,
          { userAnswers },
          {
            headers: {
              'x-tenant-id': tenantId,
              'x-user-id': userId,
            },
          }
        );
        if (response.data) {
          submissionResult = response.data;
        }
      } catch (netErr) {
        console.log('Evaluating test locally:', netErr);
      }

      if (!submissionResult) {
        // Calculate local score
        let correctCount = 0;
        const scoredQuestions = currentTest.questions.map((q, idx) => {
          const uAns = userAnswers[idx];
          const isCorrect = uAns !== null && Number(uAns) === Number(q.correctAnswer);
          if (isCorrect) correctCount++;
          return {
            ...q,
            userAnswer: uAns,
            isCorrect,
          };
        });
        const score = Math.round((correctCount / currentTest.questions.length) * 100);
        submissionResult = {
          score,
          passed: score >= (currentTest.passingScore || 60),
          test: {
            ...currentTest,
            status: 'completed',
            correctAnswersCount: correctCount,
            questions: scoredQuestions,
          }
        };
      }

      setTestResults({
        score: submissionResult.score,
        passed: submissionResult.score >= (currentTest.passingScore || 60),
        correctAnswers: submissionResult.test?.correctAnswersCount ?? 0,
        totalQuestions: currentTest.questions.length,
        test: submissionResult.test,
      });

      setTests(prev => prev.map(t =>
        t.id === currentTest.id
          ? { ...t, status: 'completed', bestScore: Math.max(t.bestScore || 0, submissionResult.score) }
          : t
      ));
      setShowResults(true);
    } catch (err: any) {
      console.error('Error submitting test:', err);
      setError('Failed to submit test. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler: Exit Test
  const handleExitTest = () => {
    setCurrentTest(null);
    setShowResults(false);
    setUserAnswers([]);
    setTestResults(null);
    setCurrentQuestionIndex(0);
  };

  // Calculate student statistics from fetched tests
  const completedTests = tests.filter(t => t.status === 'completed');
  const averageScore = completedTests.length > 0
    ? Math.round(completedTests.reduce((sum, t) => sum + (t.bestScore || 0), 0) / completedTests.length)
    : 0;

  const studentStats = {
    testsCompleted: completedTests.length,
    averageScore,
    totalPracticeHours: completedTests.length * (tests.reduce((sum, t) => sum + t.duration, 0) / Math.max(tests.length, 1)) / 60,
    strongAreas: tests.filter(t => (t.bestScore || 0) >= 80).flatMap(t => t.categories),
    weakAreas: tests.filter(t => (t.bestScore || 0) < 70).flatMap(t => t.categories),
  };

  // Show Test Results
  if (currentTest && showResults && testResults) {
    const { score, passed, correctAnswers, totalQuestions } = testResults;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          {/* Results Header */}
          <Card className="mb-6 border-2" style={{ borderColor: passed ? '#10b981' : '#ef4444' }}>
            <CardContent className="p-8 text-center">
              <div className="mb-4">
                {passed ? (
                  <Award className="w-16 h-16 text-green-600 mx-auto" />
                ) : (
                  <AlertCircle className="w-16 h-16 text-red-600 mx-auto" />
                )}
              </div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                {passed ? '🎉 Congratulations!' : 'Test Completed'}
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                {passed ? `You passed with ${score}% score!` : `Your score is ${score}%. Keep practicing!`}
              </p>

              {/* Score Circle */}
              <div className="flex justify-center mb-6">
                <div className="relative w-40 h-40">
                  <svg className="transform -rotate-90" width="160" height="160">
                    <circle
                      cx="80"
                      cy="80"
                      r="75"
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="8"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="75"
                      fill="none"
                      stroke={passed ? '#10b981' : '#ef4444'}
                      strokeWidth="8"
                      strokeDasharray={`${(score / 100) * 471} 471`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-4xl font-bold text-slate-900 dark:text-white">{score}%</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Score</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Correct</p>
                  <p className="text-2xl font-bold text-blue-600">{correctAnswers}/{totalQuestions}</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Accuracy</p>
                  <p className="text-2xl font-bold text-purple-600">{Math.round((correctAnswers / totalQuestions) * 100)}%</p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Pass Score</p>
                  <p className="text-2xl font-bold text-orange-600">{currentTest.passingScore}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleExitTest}
              className="flex-1"
            >
              Back to Tests
            </Button>
            <Button
              onClick={() => handleStartTest(currentTest)}
              className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Retry Test
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show Test Questions
  if (currentTest && !showResults) {
    const question = currentTest.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / currentTest.questions.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Test Header */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{currentTest.title}</h1>
                  <p className="text-slate-600 dark:text-slate-400">{currentTest.company}</p>
                </div>
                <Button
                  variant="outline"
                  onClick={handleExitTest}
                >
                  <X className="w-4 h-4 mr-2" />
                  Exit Test
                </Button>
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Question {currentQuestionIndex + 1} of {currentTest.totalQuestions}
                  </span>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {Math.round(progress)}% Complete
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Question */}
          <Card className="mb-6">
            <CardContent className="p-8">
              <div className="flex items-start justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white flex-1">
                  {question.question}
                </h2>
                <Badge className="ml-4">
                  <Clock className="w-3 h-3 mr-1" />
                  {question.timeLimit}s
                </Badge>
              </div>

              {/* Options */}
              {question.type === 'mcq' && question.options && (
                <div className="space-y-3">
                  {question.options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswerQuestion(idx)}
                      className={`w-full p-4 border rounded-lg text-left transition-all ${
                        question.userAnswer === idx
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-slate-300 dark:border-slate-600 hover:border-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            question.userAnswer === idx
                              ? 'border-blue-600 bg-blue-600'
                              : 'border-slate-400'
                          }`}
                        >
                          {question.userAnswer === idx && (
                            <div className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>
                        <span className="text-slate-700 dark:text-slate-300">{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>
            <div className="flex-1" />
            {currentQuestionIndex === currentTest.questions.length - 1 ? (
              <Button
                onClick={handleSubmitTest}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 flex items-center gap-2"
              >
                {isSubmitting && <Loader className="w-4 h-4 animate-spin" />}
                {isSubmitting ? 'Submitting...' : 'Submit Test'}
              </Button>
            ) : (
              <Button
                onClick={handleNextQuestion}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              >
                Next Question
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
              <Code className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">OA Practice Hub</h1>
              <p className="text-slate-600 dark:text-slate-400">Practice coding & aptitude tests</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-blue-600">{studentStats.testsCompleted}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Tests Completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-green-600">{Math.round(studentStats.averageScore)}%</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Average Score</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-purple-600">{studentStats.totalPracticeHours}h</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Practice Hours</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-lg font-bold text-orange-600">{tests.length}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Tests Available</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-lg font-bold text-pink-600">{tests.filter(t => t.status === 'not-started').length}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">To Do</p>
            </CardContent>
          </Card>
        </div>

        {/* Error Alert */}
        {error && (
          <Card className="mb-6 border-red-300 bg-red-50 dark:bg-red-900/20">
            <CardContent className="p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-800 dark:text-red-300">{error}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setError(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs defaultValue="available" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="available">Available Tests</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="skills">Skills Analysis</TabsTrigger>
          </TabsList>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-3" />
                <p className="text-slate-600 dark:text-slate-400">Loading tests...</p>
              </div>
            </div>
          )}

          {/* Available Tests */}
          <TabsContent value="available">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tests.filter(t => t.status !== 'completed').map((test) => (
                <Card key={test.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 dark:text-white">{test.title}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{test.company}</p>
                      </div>
                      <Badge
                        className={
                          test.difficulty === 'easy'
                            ? 'bg-green-100 text-green-800'
                            : test.difficulty === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                        }
                      >
                        {test.difficulty}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400">{test.description}</p>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="text-slate-600 dark:text-slate-400">{test.duration} mins</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-blue-600" />
                        <span className="text-slate-600 dark:text-slate-400">{test.totalQuestions} Q</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-blue-600" />
                        <span className="text-slate-600 dark:text-slate-400">Pass: {test.passingScore}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-blue-600" />
                        <span className="text-slate-600 dark:text-slate-400">{test.attempts} attempts</span>
                      </div>
                    </div>

                    {/* Categories */}
                    <div className="flex flex-wrap gap-2">
                      {test.categories.map((cat) => (
                        <Badge key={cat} variant="outline" className="text-xs">
                          {cat}
                        </Badge>
                      ))}
                    </div>

                    {/* Action Button */}
                    <Button
                      onClick={() => handleStartTest(test)}
                      disabled={isLoading || isSubmitting}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          Start Test
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
              {!isLoading && tests.filter(t => t.status !== 'completed').length === 0 && (
                <div className="col-span-full flex items-center justify-center py-12">
                  <div className="text-center">
                    <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600 dark:text-slate-400 text-lg">No tests available</p>
                    <p className="text-slate-500 dark:text-slate-500 text-sm mt-1">Check back later for new tests</p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Completed Tests */}
          <TabsContent value="completed">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tests.filter(t => t.status === 'completed').map((test) => (
                <Card key={test.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 dark:text-white">{test.title}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          Completed on {test.completedDate}
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Done
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-sm text-slate-600 dark:text-slate-400">Best Score</p>
                      <p className="text-3xl font-bold text-blue-600">{test.bestScore}%</p>
                    </div>
                    <Button variant="outline" className="w-full">
                      View Results
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Skills Analysis */}
          <TabsContent value="skills">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Strong Areas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {studentStats.strongAreas.map((area) => (
                    <div key={area} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-slate-700 dark:text-slate-300">{area}</span>
                      <Progress value={85} className="flex-1 h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Areas to Improve</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {studentStats.weakAreas.map((area) => (
                    <div key={area} className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-orange-600" />
                      <span className="text-slate-700 dark:text-slate-300">{area}</span>
                      <Progress value={45} className="flex-1 h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
