import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Play,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Copy,
  Check,
  Code2,
  Clock,
  Sparkles,
  Users,
  BookOpen,
  Lightbulb,
  History,
  Maximize2,
  Minimize2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Terminal,
  Share2,
  Pause,
  ExternalLink,
  Flame,
  CheckCheck,
} from 'lucide-react';
import { getApiBaseUrl } from '../../utils/portDetection';

interface Problem {
  id: number;
  slug: string;
  title: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  category: string;
  acceptance: string;
  companies?: string[];
  description: string;
  examples: Array<{ input: string; output: string; explanation?: string }>;
  constraints?: string[];
  starterCode: { [key: string]: string };
  testCases: Array<{ input: string; expected: string; isHidden?: boolean }>;
  hints?: string[];
  solution?: {
    approach: string;
    timeComplexity: string;
    spaceComplexity: string;
    code: { [key: string]: string };
  };
}

interface RunResult {
  id: string;
  status: 'Accepted' | 'Wrong Answer' | 'Runtime Error' | 'Compile Error';
  passed: boolean;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  stdout?: string;
  error?: string;
  runtime: number;
  memory: number;
  timestamp: string;
}

interface SubmissionRecord {
  id: string;
  problemId: number;
  problemTitle: string;
  status: string;
  passed: boolean;
  testCasesPassed: number;
  totalTestCases: number;
  runtime: number;
  memory: number;
  beatsRuntime: number;
  beatsMemory: number;
  language: string;
  code: string;
  failedTestCase?: any;
  error?: string;
  submittedAt: string;
}

export const ProfessionalLiveEditor: React.FC = () => {
  // State
  const [problems, setProblems] = useState<Problem[]>([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState<number>(0);
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [language, setLanguage] = useState<string>('javascript');
  const [code, setCode] = useState<string>('');
  const [leftTab, setLeftTab] = useState<'description' | 'editorial' | 'submissions'>('description');
  const [consoleTab, setConsoleTab] = useState<'testcase' | 'result'>('testcase');
  const [selectedTestCaseIdx, setSelectedTestCaseIdx] = useState<number>(0);
  const [customInput, setCustomInput] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [isProblemDropdownOpen, setIsProblemDropdownOpen] = useState<boolean>(false);
  const [expandedHints, setExpandedHints] = useState<{ [key: number]: boolean }>({});

  // Execution states
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [submitResult, setSubmitResult] = useState<SubmissionRecord | null>(null);
  const [submissionsHistory, setSubmissionsHistory] = useState<SubmissionRecord[]>([]);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Timer states
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);

  // Collaborative Room state
  const [isRoomModalOpen, setIsRoomModalOpen] = useState<boolean>(false);
  const [roomCode, setRoomCode] = useState<string>('ROOM-7X9B2');
  const [roomCopied, setRoomCopied] = useState<boolean>(false);
  const [participantCount, setParticipantCount] = useState<number>(1);

  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Timer effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (totalSeconds: number): string => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Fetch problems on mount
  useEffect(() => {
    const loadProblems = async () => {
      try {
        const baseUrl = await getApiBaseUrl();
        const res = await fetch(`${baseUrl}/api/v1/problems`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data?.length > 0) {
            setProblems(json.data);
            loadProblemDetail(json.data[0].id);
            return;
          }
        }
      } catch (err) {
        console.warn('Could not load problems from backend, loading fallback problems:', err);
      }
      // Fallback problem if API is waiting
      loadFallbackProblems();
    };

    loadProblems();
  }, []);

  const loadFallbackProblems = () => {
    const fallbackList: Problem[] = [
      {
        id: 1,
        slug: 'two-sum',
        title: 'Two Sum',
        difficulty: 'EASY',
        category: 'Array & Hash Map',
        acceptance: '53.4%',
        companies: ['Google', 'Amazon', 'Meta', 'Microsoft'],
        description: `Given an array of integers \`nums\` and an integer \`target\`, return *indices of the two numbers such that they add up to \`target\`*.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.`,
        examples: [
          { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
          { input: 'nums = [3,2,4], target = 6', output: '[1,2]', explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].' },
        ],
        constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', '-10^9 <= target <= 10^9'],
        starterCode: {
          javascript: `function twoSum(nums, target) {\n    // Write your solution here\n    \n};`,
          python: `class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        # Write your solution here\n        pass\n`,
          typescript: `function twoSum(nums: number[], target: number): number[] {\n    return [];\n};`,
          cpp: `#include <vector>\nusing namespace std;\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        return {};\n    }\n};`,
          java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        return new int[]{};\n    }\n}`,
        },
        testCases: [
          { input: '[2, 7, 11, 15]\n9', expected: '[0, 1]' },
          { input: '[3, 2, 4]\n6', expected: '[1, 2]' },
        ],
        hints: ['Try using a hash map to look up complements in O(1) time.'],
        solution: {
          approach: 'Single-pass Hash Map',
          timeComplexity: 'O(N)',
          spaceComplexity: 'O(N)',
          code: {
            javascript: `function twoSum(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const comp = target - nums[i];\n        if (map.has(comp)) return [map.get(comp), i];\n        map.set(nums[i], i);\n    }\n    return [];\n}`,
            python: `class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        seen = {}\n        for i, n in enumerate(nums):\n            comp = target - n\n            if comp in seen:\n                return [seen[comp], i]\n            seen[n] = i\n        return []`,
          },
        },
      },
    ];
    setProblems(fallbackList);
    setCurrentProblem(fallbackList[0]);
    setCode(fallbackList[0].starterCode[language] || fallbackList[0].starterCode.javascript);
  };

  const loadProblemDetail = async (problemId: number) => {
    try {
      const baseUrl = await getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/v1/problems/${problemId}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setCurrentProblem(json.data);
          setCode(json.data.starterCode[language] || json.data.starterCode.javascript || '');
          setSelectedTestCaseIdx(0);
          setRunResult(null);
          setSubmitResult(null);
          setConsoleTab('testcase');
          loadSubmissionsHistory(json.data.id);
        }
      }
    } catch (err) {
      console.error('Error loading problem detail:', err);
    }
  };

  const loadSubmissionsHistory = async (problemId: number) => {
    try {
      const baseUrl = await getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/v1/submissions/problem/${problemId}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setSubmissionsHistory(json.data || []);
        }
      }
    } catch (err) {
      console.warn('Error loading submissions history:', err);
    }
  };

  // Change language
  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    if (currentProblem && currentProblem.starterCode) {
      setCode(currentProblem.starterCode[newLang] || '');
    }
  };

  // Switch problem
  const selectProblem = (idx: number) => {
    setCurrentProblemIndex(idx);
    setIsProblemDropdownOpen(false);
    if (problems[idx]) {
      loadProblemDetail(problems[idx].id);
    }
  };

  const nextProblem = () => {
    if (currentProblemIndex < problems.length - 1) {
      selectProblem(currentProblemIndex + 1);
    }
  };

  const prevProblem = () => {
    if (currentProblemIndex > 0) {
      selectProblem(currentProblemIndex - 1);
    }
  };

  // Run code against testcase
  const handleRunCode = async () => {
    if (!code.trim() || !currentProblem) return;

    setIsRunning(true);
    setConsoleTab('result');

    try {
      const baseUrl = await getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/v1/submissions/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language,
          problemId: currentProblem.id,
          testCaseIndex: isCustom ? 0 : selectedTestCaseIdx,
          customInput: isCustom ? customInput : undefined,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setRunResult(json.data);
      } else {
        setRunResult({
          id: `err-${Date.now()}`,
          status: 'Runtime Error',
          passed: false,
          input: isCustom ? customInput : currentProblem.testCases[selectedTestCaseIdx]?.input || '',
          expectedOutput: currentProblem.testCases[selectedTestCaseIdx]?.expected || '',
          actualOutput: '',
          error: json.error || 'Execution failed',
          runtime: 0,
          memory: 0,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (err: any) {
      setRunResult({
        id: `err-${Date.now()}`,
        status: 'Runtime Error',
        passed: false,
        input: '',
        expectedOutput: '',
        actualOutput: '',
        error: err?.message || 'Could not connect to code evaluation service',
        runtime: 0,
        memory: 0,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Submit code against all test cases
  const handleSubmit = async () => {
    if (!code.trim() || !currentProblem) return;

    setIsSubmitting(true);
    setConsoleTab('result');

    try {
      const baseUrl = await getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/v1/submissions/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language,
          problemId: currentProblem.id,
          userId: 'student-1',
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setSubmitResult(json.data);
        // refresh history
        loadSubmissionsHistory(currentProblem.id);
      } else {
        alert('Submission error: ' + (json.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Submission request failed:', err);
      alert('Failed to submit code. Ensure backend server is running on port 3001.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Tab key indents in textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 4;
      }, 0);
    }
    // Ctrl+Enter or Cmd+Enter to Run
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleRunCode();
    }
  };

  // Copy code
  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Reset to starter template
  const handleResetCode = () => {
    if (currentProblem && currentProblem.starterCode) {
      if (confirm('Reset code to default starter template?')) {
        setCode(currentProblem.starterCode[language] || '');
      }
    }
  };

  // Toggle hints
  const toggleHint = (idx: number) => {
    setExpandedHints(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  // Line numbers calculation
  const lineCount = Math.max(code.split('\n').length, 18);
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  const getDifficultyBadge = (diff?: string) => {
    switch (diff?.toUpperCase()) {
      case 'EASY':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'MEDIUM':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'HARD':
        return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      default:
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col h-[calc(100vh-64px)] w-full bg-[#0f172a] text-slate-200 select-none overflow-hidden font-sans"
    >
      {/* =========================================================================
          TOP LEETCODE NAVBAR
      ========================================================================= */}
      <header className="h-14 border-b border-slate-800 bg-[#1e293b]/90 backdrop-blur px-4 flex items-center justify-between shrink-0 z-30">
        {/* Left: Branding & Problem Navigation */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-bold text-base tracking-tight text-white pr-2 border-r border-slate-700">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
              <Code2 size={20} />
            </span>
            <span className="hidden sm:inline bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              LeetCode Studio
            </span>
          </div>

          {/* Prev / Next buttons */}
          <div className="flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700">
            <button
              onClick={prevProblem}
              disabled={currentProblemIndex === 0}
              title="Previous Problem"
              className="p-1.5 hover:bg-slate-700 rounded text-slate-300 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={nextProblem}
              disabled={currentProblemIndex >= problems.length - 1}
              title="Next Problem"
              className="p-1.5 hover:bg-slate-700 rounded text-slate-300 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Problem Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProblemDropdownOpen(!isProblemDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-sm font-medium text-white transition"
            >
              <span className="max-w-[200px] truncate">
                {currentProblem ? `${currentProblem.id}. ${currentProblem.title}` : 'Select Problem'}
              </span>
              <span
                className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${getDifficultyBadge(
                  currentProblem?.difficulty
                )}`}
              >
                {currentProblem?.difficulty}
              </span>
              <ChevronDown size={14} className="text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {isProblemDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-80 max-h-96 overflow-y-auto bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-2 text-xs font-semibold text-slate-400 border-b border-slate-800 uppercase tracking-wider flex items-center justify-between">
                  <span>Problems List ({problems.length})</span>
                  <span className="text-[10px] text-amber-400 font-mono">Curated 85+</span>
                </div>
                <div className="space-y-1 mt-1">
                  {problems.map((p, idx) => (
                    <button
                      key={p.id}
                      onClick={() => selectProblem(idx)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-sm transition ${
                        currentProblemIndex === idx
                          ? 'bg-amber-500/15 text-amber-400 font-medium'
                          : 'hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <span className="truncate pr-2">
                        {p.id}. {p.title}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${getDifficultyBadge(
                          p.difficulty
                        )}`}
                      >
                        {p.difficulty}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center: Run & Submit Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRunCode}
            disabled={isRunning || isSubmitting}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm font-semibold text-white transition shadow-sm hover:border-slate-600 disabled:opacity-50"
            title="Run Code (Ctrl + Enter)"
          >
            <Play size={14} className={`text-emerald-400 fill-emerald-400 ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Running...' : 'Run'}</span>
            <kbd className="hidden md:inline text-[10px] text-slate-400 bg-slate-900/60 px-1.5 py-0.5 rounded border border-slate-700 font-mono">
              Ctrl ↵
            </kbd>
          </button>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting || isRunning}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-sm font-semibold text-white transition shadow-md shadow-emerald-900/30 disabled:opacity-50"
          >
            <Check size={16} className={isSubmitting ? 'animate-bounce' : ''} />
            <span>{isSubmitting ? 'Evaluating...' : 'Submit'}</span>
          </button>
        </div>

        {/* Right: Timer, Room & Controls */}
        <div className="flex items-center gap-3">
          {/* Timer */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 font-mono text-xs text-slate-300">
            <Clock size={13} className="text-amber-400" />
            <span>{formatTimer(timerSeconds)}</span>
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="p-1 hover:text-white rounded"
              title={isTimerRunning ? 'Pause Timer' : 'Resume Timer'}
            >
              {isTimerRunning ? <Pause size={10} /> : <Play size={10} />}
            </button>
            <button
              onClick={() => setTimerSeconds(0)}
              className="p-1 hover:text-white rounded"
              title="Reset Timer"
            >
              <RotateCcw size={10} />
            </button>
          </div>

          {/* Collaborative Room Button */}
          <button
            onClick={() => setIsRoomModalOpen(true)}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 text-xs font-semibold transition"
          >
            <Users size={14} />
            <span>Interview Room</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </button>

          {/* Fullscreen toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </header>

      {/* =========================================================================
          MAIN LEETCODE WORKSPACE (SPLIT PANE)
      ========================================================================= */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* =====================================================================
            LEFT PANE: PROBLEM STATEMENT, EDITORIAL & SUBMISSIONS
        ===================================================================== */}
        <section className="w-full lg:w-1/2 flex flex-col border-r border-slate-800 bg-[#0f172a] overflow-hidden">
          {/* Left Tabs Bar */}
          <div className="h-10 bg-[#1e293b]/70 border-b border-slate-800 px-4 flex items-center gap-6 shrink-0 text-xs font-medium">
            <button
              onClick={() => setLeftTab('description')}
              className={`flex items-center gap-1.5 h-full border-b-2 transition ${
                leftTab === 'description'
                  ? 'border-amber-400 text-white font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen size={14} />
              <span>Description</span>
            </button>
            <button
              onClick={() => setLeftTab('editorial')}
              className={`flex items-center gap-1.5 h-full border-b-2 transition ${
                leftTab === 'editorial'
                  ? 'border-amber-400 text-white font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Lightbulb size={14} />
              <span>Editorial & Solution</span>
            </button>
            <button
              onClick={() => setLeftTab('submissions')}
              className={`flex items-center gap-1.5 h-full border-b-2 transition ${
                leftTab === 'submissions'
                  ? 'border-amber-400 text-white font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <History size={14} />
              <span>Submissions ({submissionsHistory.length})</span>
            </button>
          </div>

          {/* Left Tab Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-300">
            {/* 1. DESCRIPTION TAB */}
            {leftTab === 'description' && currentProblem && (
              <div className="space-y-6">
                {/* Header Info */}
                <div>
                  <h1 className="text-2xl font-bold text-white mb-2">
                    {currentProblem.id}. {currentProblem.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-bold border ${getDifficultyBadge(
                        currentProblem.difficulty
                      )}`}
                    >
                      {currentProblem.difficulty}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {currentProblem.category}
                    </span>
                    <span className="flex items-center gap-1 text-slate-400 ml-2">
                      <Flame size={13} className="text-amber-400" />
                      Acceptance: <strong className="text-slate-200">{currentProblem.acceptance}</strong>
                    </span>
                  </div>

                  {/* Company Tags */}
                  {currentProblem.companies && currentProblem.companies.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-slate-800/80">
                      <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold mr-1">
                        Asked by:
                      </span>
                      {currentProblem.companies.map((c, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-slate-800/60 text-slate-400 text-[11px] border border-slate-700/60"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Problem Statement Prose */}
                <div className="text-sm leading-relaxed whitespace-pre-line text-slate-300 space-y-3 font-normal">
                  {currentProblem.description}
                </div>

                {/* Examples */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Examples</h3>
                  {currentProblem.examples.map((ex, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 text-xs space-y-2 font-mono shadow-inner"
                    >
                      <div className="text-slate-400 font-sans font-semibold text-[11px] uppercase tracking-wide">
                        Example {idx + 1}:
                      </div>
                      <div className="flex gap-2">
                        <span className="text-slate-500 select-none">Input:</span>
                        <span className="text-amber-300">{ex.input}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-slate-500 select-none">Output:</span>
                        <span className="text-emerald-400 font-semibold">{ex.output}</span>
                      </div>
                      {ex.explanation && (
                        <div className="flex gap-2 pt-1 border-t border-slate-800 font-sans text-slate-400 text-[11px]">
                          <span className="text-slate-500 font-mono select-none">Explanation:</span>
                          <span>{ex.explanation}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Constraints */}
                {currentProblem.constraints && currentProblem.constraints.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Constraints</h3>
                    <ul className="list-disc list-inside text-xs font-mono text-slate-400 space-y-1 bg-slate-900/40 p-3.5 rounded-xl border border-slate-800/60">
                      {currentProblem.constraints.map((c, i) => (
                        <li key={i} className="text-slate-300">
                          <code>{c}</code>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Hints Accordion */}
                {currentProblem.hints && currentProblem.hints.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Lightbulb size={14} className="text-amber-400" />
                      <span>Hints</span>
                    </h3>
                    <div className="space-y-2">
                      {currentProblem.hints.map((hint, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-900/60 border border-slate-800 rounded-lg overflow-hidden text-xs"
                        >
                          <button
                            onClick={() => toggleHint(idx)}
                            className="w-full flex items-center justify-between p-3 text-left font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 transition"
                          >
                            <span>Hint {idx + 1}</span>
                            <ChevronDown
                              size={14}
                              className={`text-slate-400 transition-transform ${
                                expandedHints[idx] ? 'rotate-180' : ''
                              }`}
                            />
                          </button>
                          {expandedHints[idx] && (
                            <div className="p-3 pt-0 text-slate-400 border-t border-slate-800/60 leading-relaxed bg-slate-900/80">
                              {hint}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 2. EDITORIAL & SOLUTION TAB */}
            {leftTab === 'editorial' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">Editorial: {currentProblem?.title}</h2>
                  <p className="text-xs text-slate-400">
                    Official solution approach, complexity analysis, and verified reference implementations.
                  </p>
                </div>

                {currentProblem?.solution ? (
                  <div className="space-y-6">
                    {/* Approach */}
                    <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">Approach</div>
                      <p className="text-sm text-slate-200 leading-relaxed">{currentProblem.solution.approach}</p>
                    </div>

                    {/* Complexity Cards */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                        <div className="text-[11px] font-semibold text-slate-400 uppercase">Time Complexity</div>
                        <div className="text-sm font-mono font-bold text-emerald-400 mt-1">
                          {currentProblem.solution.timeComplexity}
                        </div>
                      </div>
                      <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                        <div className="text-[11px] font-semibold text-slate-400 uppercase">Space Complexity</div>
                        <div className="text-sm font-mono font-bold text-blue-400 mt-1">
                          {currentProblem.solution.spaceComplexity}
                        </div>
                      </div>
                    </div>

                    {/* Solution Code */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-400 uppercase tracking-wider">Reference Solution</span>
                        <button
                          onClick={() => {
                            if (currentProblem.solution?.code[language]) {
                              setCode(currentProblem.solution.code[language]);
                              alert('Solution code loaded into your workspace editor!');
                            }
                          }}
                          className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-medium"
                        >
                          <Sparkles size={13} />
                          <span>Load into Editor</span>
                        </button>
                      </div>

                      <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
                        {currentProblem.solution.code[language] || currentProblem.solution.code.javascript || '// Solution available in JavaScript and Python'}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center text-slate-500 text-xs">
                    Editorial analysis will unlock after your first accepted submission.
                  </div>
                )}
              </div>
            )}

            {/* 3. SUBMISSIONS TAB */}
            {leftTab === 'submissions' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-white">Your Submissions</h2>
                  <span className="text-xs text-slate-400">Problem #{currentProblem?.id}</span>
                </div>

                {submissionsHistory.length > 0 ? (
                  <div className="space-y-2.5">
                    {submissionsHistory.map((sub, i) => (
                      <div
                        key={sub.id || i}
                        onClick={() => {
                          if (sub.code) {
                            setCode(sub.code);
                            setLanguage(sub.language);
                          }
                        }}
                        className="p-3.5 bg-slate-900/80 hover:bg-slate-800/80 rounded-xl border border-slate-800 hover:border-slate-700 cursor-pointer transition flex items-center justify-between text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-bold flex items-center gap-1 ${
                                sub.passed ? 'text-emerald-400' : 'text-rose-400'
                              }`}
                            >
                              {sub.passed ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                              {sub.status}
                            </span>
                            <span className="text-slate-500">•</span>
                            <span className="text-slate-400 uppercase font-mono text-[10px]">{sub.language}</span>
                          </div>
                          <div className="text-slate-400 text-[11px]">
                            Passed {sub.testCasesPassed}/{sub.totalTestCases} test cases
                          </div>
                        </div>

                        <div className="text-right space-y-1 font-mono">
                          <div className="text-slate-300 font-semibold">{sub.runtime} ms</div>
                          <div className="text-slate-500 text-[10px]">
                            {new Date(sub.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-slate-900/40 rounded-xl border border-slate-800/60 text-slate-500 text-xs space-y-2">
                    <History size={24} className="mx-auto text-slate-600 mb-2" />
                    <p>No submissions recorded yet for this problem.</p>
                    <p className="text-[11px] text-slate-600">Click "Submit" when ready to evaluate against all test cases.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* =====================================================================
            RIGHT PANE: CODE EDITOR & INTERACTIVE TESTCASES
        ===================================================================== */}
        <section className="w-full lg:w-1/2 flex flex-col bg-[#0b1120] overflow-hidden">
          {/* Editor Sub-Header: Language selector, Reset, Copy */}
          <div className="h-10 bg-[#1e293b]/70 border-b border-slate-800 px-4 flex items-center justify-between shrink-0 text-xs">
            {/* Language Selector */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Language:</span>
              <select
                value={language}
                onChange={e => handleLanguageChange(e.target.value)}
                className="bg-slate-800 text-slate-200 border border-slate-700 rounded-md px-2.5 py-1 text-xs font-semibold focus:outline-none focus:border-amber-400"
              >
                <option value="javascript">JavaScript (Node.js 26)</option>
                <option value="python">Python 3 (3.10)</option>
                <option value="typescript">TypeScript</option>
                <option value="cpp">C++ (GCC 11)</option>
                <option value="java">Java (OpenJDK 17)</option>
              </select>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 text-slate-400">
              <button
                onClick={handleCopyCode}
                className="p-1.5 hover:text-white rounded hover:bg-slate-800 transition flex items-center gap-1 text-[11px]"
                title="Copy Code"
              >
                {copiedCode ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                <span>{copiedCode ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={handleResetCode}
                className="p-1.5 hover:text-white rounded hover:bg-slate-800 transition flex items-center gap-1 text-[11px]"
                title="Reset to Template"
              >
                <RotateCcw size={13} />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Main Code Editor Canvas with Line Numbers */}
          <div className="flex-1 flex overflow-hidden bg-[#0d1527] relative font-mono text-sm leading-6">
            {/* Line Numbers Gutter */}
            <div className="w-12 py-3 bg-[#090e1a] text-slate-600 select-none text-right pr-3 font-mono text-xs shrink-0 border-r border-slate-800/80 leading-6">
              {lineNumbers.map(n => (
                <div key={n}>{n}</div>
              ))}
            </div>

            {/* Code Textarea */}
            <textarea
              ref={textareaRef}
              value={code}
              onChange={e => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck="false"
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              className="flex-1 p-3 bg-transparent text-slate-200 resize-none focus:outline-none font-mono text-xs sm:text-sm leading-6 selection:bg-amber-500/30 overflow-y-auto whitespace-pre tab-4"
              placeholder="// Write your solution here..."
            />
          </div>

          {/* ===================================================================
              BOTTOM CONSOLE & TESTCASE RUNNER DRAWER
          =================================================================== */}
          <div className="h-64 border-t border-slate-800 bg-[#0f172a] flex flex-col shrink-0">
            {/* Console Header Tabs */}
            <div className="h-9 bg-[#1e293b]/60 border-b border-slate-800 px-4 flex items-center justify-between shrink-0 text-xs font-semibold">
              <div className="flex items-center gap-4 h-full">
                <button
                  onClick={() => setConsoleTab('testcase')}
                  className={`flex items-center gap-1.5 h-full border-b-2 transition ${
                    consoleTab === 'testcase'
                      ? 'border-amber-400 text-white'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Terminal size={13} />
                  <span>Testcase</span>
                </button>
                <button
                  onClick={() => setConsoleTab('result')}
                  className={`flex items-center gap-1.5 h-full border-b-2 transition ${
                    consoleTab === 'result'
                      ? 'border-amber-400 text-white'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sparkles size={13} />
                  <span>Test Result</span>
                  {(runResult || submitResult) && (
                    <span
                      className={`w-2 h-2 rounded-full ${
                        (submitResult?.passed ?? runResult?.passed) ? 'bg-emerald-400' : 'bg-rose-500'
                      }`}
                    />
                  )}
                </button>
              </div>

              <span className="text-[10px] text-slate-500 font-mono">Console Output</span>
            </div>

            {/* Console Content */}
            <div className="flex-1 overflow-y-auto p-4 text-xs font-mono">
              {/* TAB 1: TESTCASES INPUT */}
              {consoleTab === 'testcase' && currentProblem && (
                <div className="space-y-3">
                  {/* Testcase Pills */}
                  <div className="flex items-center gap-2">
                    {currentProblem.testCases.slice(0, 3).map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedTestCaseIdx(idx);
                          setIsCustom(false);
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                          !isCustom && selectedTestCaseIdx === idx
                            ? 'bg-slate-700 text-white font-bold border border-slate-600'
                            : 'bg-slate-900/80 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Case {idx + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setIsCustom(true)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                        isCustom
                          ? 'bg-slate-700 text-white font-bold border border-slate-600'
                          : 'bg-slate-900/80 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      + Custom
                    </button>
                  </div>

                  {/* Testcase Preview / Input Box */}
                  {!isCustom ? (
                    <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1.5">
                      <div className="text-[10px] text-slate-500 font-sans uppercase font-bold">Input Arguments</div>
                      <pre className="text-amber-300 font-mono text-xs whitespace-pre-wrap">
                        {currentProblem.testCases[selectedTestCaseIdx]?.input || ''}
                      </pre>
                      <div className="text-[10px] text-slate-500 font-sans uppercase font-bold pt-1 border-t border-slate-900">
                        Expected Output: <span className="text-emerald-400 font-mono">{currentProblem.testCases[selectedTestCaseIdx]?.expected}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <div className="text-[10px] text-slate-400 font-sans font-semibold">Custom Testcase Arguments:</div>
                      <textarea
                        value={customInput}
                        onChange={e => setCustomInput(e.target.value)}
                        placeholder="[2, 7, 11, 15]&#10;9"
                        className="w-full h-20 p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-amber-300 font-mono text-xs focus:outline-none focus:border-amber-400 resize-none"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: TEST RESULT OUTPUT */}
              {consoleTab === 'result' && (
                <div className="space-y-3">
                  {/* SUBMISSION RESULT DISPLAY */}
                  {submitResult ? (
                    <div className="space-y-3">
                      {/* Big Status Banner */}
                      <div
                        className={`p-4 rounded-xl border flex items-center justify-between ${
                          submitResult.passed
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {submitResult.passed ? (
                            <CheckCircle2 size={24} className="text-emerald-400 shrink-0" />
                          ) : (
                            <XCircle size={24} className="text-rose-400 shrink-0" />
                          )}
                          <div>
                            <div className="text-base font-bold">{submitResult.status}</div>
                            <div className="text-xs opacity-80">
                              {submitResult.testCasesPassed} / {submitResult.totalTestCases} test cases passed
                            </div>
                          </div>
                        </div>

                        {submitResult.passed && (
                          <div className="text-right">
                            <span className="text-xs font-mono font-bold text-emerald-300">
                              Beats {submitResult.beatsRuntime}% of submissions
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Runtime & Memory Metrics */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                          <span className="text-[10px] text-slate-500 uppercase font-sans font-bold">Runtime</span>
                          <div className="text-sm font-bold text-white mt-0.5">{submitResult.runtime} ms</div>
                          {submitResult.passed && (
                            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
                              <div
                                className="bg-emerald-400 h-full rounded-full"
                                style={{ width: `${Math.min(submitResult.beatsRuntime, 100)}%` }}
                              />
                            </div>
                          )}
                        </div>

                        <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                          <span className="text-[10px] text-slate-500 uppercase font-sans font-bold">Memory</span>
                          <div className="text-sm font-bold text-white mt-0.5">{submitResult.memory} MB</div>
                          {submitResult.passed && (
                            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
                              <div
                                className="bg-blue-400 h-full rounded-full"
                                style={{ width: `${Math.min(submitResult.beatsMemory, 100)}%` }}
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Failed Case Diff if not passed */}
                      {submitResult.failedTestCase && (
                        <div className="p-3 bg-slate-950 rounded-lg border border-rose-900/40 text-xs space-y-1.5 font-mono">
                          <div className="text-rose-400 font-sans font-bold text-[11px]">
                            Failed on Test Case #{submitResult.failedTestCase.caseNumber}:
                          </div>
                          <div className="text-slate-400">
                            <strong>Input:</strong> {submitResult.failedTestCase.input}
                          </div>
                          <div className="text-rose-300">
                            <strong>Your Output:</strong> {submitResult.failedTestCase.actual}
                          </div>
                          <div className="text-emerald-400">
                            <strong>Expected:</strong> {submitResult.failedTestCase.expected}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : runResult ? (
                    /* RUN RESULT DISPLAY */
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                        <div className="flex items-center gap-2">
                          {runResult.passed ? (
                            <CheckCircle2 size={16} className="text-emerald-400" />
                          ) : (
                            <XCircle size={16} className="text-rose-400" />
                          )}
                          <span
                            className={`font-bold text-sm ${
                              runResult.passed ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            {runResult.status}
                          </span>
                        </div>
                        <span className="text-slate-400 text-xs">Runtime: {runResult.runtime} ms</span>
                      </div>

                      {/* Diff Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                          <span className="text-[10px] text-slate-500 uppercase font-sans font-bold">Your Output:</span>
                          <pre className="text-amber-300 whitespace-pre-wrap">{runResult.actualOutput || 'None'}</pre>
                        </div>
                        <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                          <span className="text-[10px] text-slate-500 uppercase font-sans font-bold">Expected Output:</span>
                          <pre className="text-emerald-400 whitespace-pre-wrap">{runResult.expectedOutput}</pre>
                        </div>
                      </div>

                      {/* Stdout if console.log was used */}
                      {runResult.stdout && (
                        <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                          <span className="text-[10px] text-slate-500 uppercase font-sans font-bold">Standard Output:</span>
                          <pre className="text-slate-300 whitespace-pre-wrap">{runResult.stdout}</pre>
                        </div>
                      )}

                      {/* Error details */}
                      {runResult.error && (
                        <div className="p-2.5 bg-rose-950/30 rounded-lg border border-rose-900/50 text-rose-300">
                          <span className="font-bold">Error:</span> {runResult.error}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-slate-500 text-xs space-y-1">
                      <Terminal size={20} className="mx-auto text-slate-600 mb-1" />
                      <p>Run your code to see the testcase execution output here.</p>
                      <p className="text-[11px] text-slate-600">You can also hit "Submit" for full evaluation.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* =========================================================================
          INTERVIEW ROOM / COLLABORATIVE MODAL
      ========================================================================= */}
      {isRoomModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 font-bold text-white text-base">
                <Users size={18} className="text-indigo-400" />
                <span>Live Interview Room</span>
              </div>
              <button
                onClick={() => setIsRoomModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-300">
              <p>
                Invite a peer or campus placement interviewer to join this room and code together in real-time.
              </p>

              {/* Room Code Box */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Room Code</span>
                  <div className="text-lg font-mono font-bold text-indigo-400 tracking-wider mt-0.5">{roomCode}</div>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(roomCode);
                    setRoomCopied(true);
                    setTimeout(() => setRoomCopied(false), 2000);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1 transition"
                >
                  {roomCopied ? <CheckCheck size={14} /> : <Copy size={14} />}
                  <span>{roomCopied ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>

              {/* Active Participants */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                  Participants ({participantCount})
                </div>
                <div className="flex items-center gap-2 p-2 bg-slate-800/60 rounded-lg border border-slate-700/60">
                  <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                    Y
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-white">You (Candidate)</div>
                    <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Online
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsRoomModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessionalLiveEditor;
