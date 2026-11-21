import { Router, Request, Response } from 'express';
import { asyncHandler } from '@api/middleware/error.middleware';

/**
 * OA Practice Controller
 * Handles Online Assessment practice questions
 */
export class OaPracticeController {
  public router: Router;

  constructor() {
    this.router = Router();
    this.registerRoutes();
  }

  private registerRoutes(): void {
    // Tests API
    this.router.get(
      '/list',
      asyncHandler((req, res) => this.getTestsList(req, res))
    );

    this.router.post(
      '/:testId/start',
      asyncHandler((req, res) => this.startTest(req, res))
    );

    this.router.post(
      '/:testId/submit',
      asyncHandler((req, res) => this.submitTest(req, res))
    );

    this.router.get(
      '/questions',
      asyncHandler((req, res) => this.getQuestions(req, res))
    );

    this.router.get(
      '/questions/:questionId',
      asyncHandler((req, res) => this.getQuestionDetail(req, res))
    );

    this.router.post(
      '/questions/:questionId/submit',
      asyncHandler((req, res) => this.submitAnswer(req, res))
    );

    this.router.get(
      '/user/:userId/results',
      asyncHandler((req, res) => this.getUserResults(req, res))
    );
  }

  private sampleTests = [
    {
      id: 'oa-test-1',
      title: 'Google Online Assessment (SWE 2026)',
      company: 'Google',
      difficulty: 'hard' as const,
      duration: 60,
      totalQuestions: 4,
      passingScore: 75,
      categories: ['DSA', 'Dynamic Programming', 'Graph Theory'],
      description: 'Official simulation of Google SWE hiring assessment with algorithms and complex problem solving.',
      attempts: 320,
      bestScore: 92,
      status: 'not-started' as const,
      questions: [
        {
          id: 'q1-1',
          type: 'mcq' as const,
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
          type: 'mcq' as const,
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
          type: 'mcq' as const,
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
          type: 'mcq' as const,
          question: 'What is the amortized time complexity of inserting n elements into an initially empty dynamic array (like std::vector or ArrayList)?',
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
      difficulty: 'medium' as const,
      duration: 45,
      totalQuestions: 4,
      passingScore: 70,
      categories: ['Arrays', 'Strings', 'Leadership Principles', 'Complexity'],
      description: 'Practice Amazon SDE-1 coding assessment covering algorithmic questions and scenario judgment.',
      attempts: 485,
      bestScore: 88,
      status: 'not-started' as const,
      questions: [
        {
          id: 'q2-1',
          type: 'mcq' as const,
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
          type: 'mcq' as const,
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
          type: 'mcq' as const,
          question: 'What is the worst-case time complexity of QuickSelect when choosing the pivot naively (e.g., always the first element)?',
          difficulty: 'medium',
          timeLimit: 120,
          options: ['O(n log n)', 'O(n^2)', 'O(n)', 'O(log n)'],
          correctAnswer: 1,
          explanation: 'If the array is already sorted and the first element is chosen as pivot, partition sizes are 0 and n-1, producing O(n^2) worst-case time.',
          category: 'Algorithms'
        },
        {
          id: 'q2-4',
          type: 'mcq' as const,
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
      difficulty: 'medium' as const,
      duration: 40,
      totalQuestions: 4,
      passingScore: 65,
      categories: ['OS', 'DBMS', 'Computer Networks', 'OOPS'],
      description: 'Comprehensive test covering OS memory management, relational databases, ACID, and networking protocols.',
      attempts: 290,
      bestScore: 95,
      status: 'not-started' as const,
      questions: [
        {
          id: 'q3-1',
          type: 'mcq' as const,
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
          type: 'mcq' as const,
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
          type: 'mcq' as const,
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
          type: 'mcq' as const,
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

  private async getTestsList(_req: Request, res: Response): Promise<void> {
    res.json({
      success: true,
      tests: this.sampleTests,
      total: this.sampleTests.length,
    });
  }

  private async startTest(req: Request, res: Response): Promise<void> {
    const { testId } = req.params;
    const test = this.sampleTests.find(t => t.id === testId) || this.sampleTests[0];

    // Return the test with questions for execution
    res.json({
      ...test,
      status: 'in-progress',
      startedAt: new Date().toISOString()
    });
  }

  private async submitTest(req: Request, res: Response): Promise<void> {
    const { testId } = req.params;
    const { userAnswers } = req.body;
    const test = this.sampleTests.find(t => t.id === testId) || this.sampleTests[0];

    let correctCount = 0;
    const scoredQuestions = test.questions.map((q, idx) => {
      const userAnswer = userAnswers && userAnswers[idx] !== undefined ? userAnswers[idx] : null;
      const isCorrect = userAnswer !== null && Number(userAnswer) === Number(q.correctAnswer);
      if (isCorrect) correctCount++;
      return {
        ...q,
        userAnswer,
        isCorrect
      };
    });

    const score = Math.round((correctCount / test.questions.length) * 100);
    const passed = score >= test.passingScore;

    res.json({
      success: true,
      score,
      passed,
      test: {
        ...test,
        status: 'completed',
        correctAnswersCount: correctCount,
        questions: scoredQuestions
      }
    });
  }

  private async getQuestions(_req: Request, res: Response): Promise<void> {
    const questions = [
      {
        id: 1,
        type: 'MCQ',
        difficulty: 'Easy',
        topic: 'Data Structures',
        title: 'What is the time complexity of Linear Search?',
        company: 'Google',
        attempts: 1245,
        accuracy: 87,
        solved: true,
      },
      {
        id: 2,
        type: 'Coding',
        difficulty: 'Medium',
        topic: 'Algorithms',
        title: 'Implement Merge Sort',
        company: 'Amazon',
        attempts: 892,
        accuracy: 62,
        solved: false,
      },
      {
        id: 3,
        type: 'MCQ',
        difficulty: 'Hard',
        topic: 'System Design',
        title: 'Design a URL Shortening Service',
        company: 'Microsoft',
        attempts: 456,
        accuracy: 51,
        solved: false,
      },
      {
        id: 4,
        type: 'Coding',
        difficulty: 'Medium',
        topic: 'Dynamic Programming',
        title: 'Longest Common Subsequence',
        company: 'Apple',
        attempts: 623,
        accuracy: 58,
        solved: true,
      },
    ];

    res.json({
      success: true,
      data: questions,
    });
  }

  private async getQuestionDetail(req: Request, res: Response): Promise<void> {
    const { questionId } = req.params;

    const question = {
      id: questionId,
      type: 'Coding',
      difficulty: 'Medium',
      topic: 'Algorithms',
      title: 'Implement Merge Sort',
      company: 'Amazon',
      description: 'Implement the merge sort algorithm and explain the approach',
      constraints: [
        'Array size: 1 to 10^5',
        'Element value: -10^9 to 10^9',
        'Time complexity: O(n log n)',
      ],
      examples: [
        {
          input: '[64, 34, 25, 12, 22, 11, 90]',
          output: '[11, 12, 22, 25, 34, 64, 90]',
        },
      ],
      hints: [
        'Divide the array into two halves',
        'Recursively sort both halves',
        'Merge the sorted halves',
      ],
      testCases: 15,
      timeLimit: '1 second',
      memoryLimit: '256 MB',
    };

    res.json({
      success: true,
      data: question,
    });
  }

  private async submitAnswer(req: Request, res: Response): Promise<void> {
    const { questionId } = req.params;
    const { answer: _answer, language } = req.body;

    const result = {
      submissionId: `oa-sub-${Date.now()}`,
      questionId,
      language,
      passed: Math.random() > 0.3,
      testsPassed: Math.floor(Math.random() * 15),
      totalTests: 15,
      runtime: `${Math.floor(Math.random() * 100) + 50}ms`,
      memory: `${Math.floor(Math.random() * 200) + 50}MB`,
      feedback: 'Solution looks good!',
    };

    res.json({
      success: true,
      data: result,
    });
  }

  private async getUserResults(req: Request, res: Response): Promise<void> {
    const { userId: _userId } = req.params;

    const results = [
      {
        id: 1,
        questionId: 1,
        title: 'What is the time complexity of Linear Search?',
        type: 'MCQ',
        solved: true,
        score: 100,
        attemptedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 2,
        questionId: 4,
        title: 'Longest Common Subsequence',
        type: 'Coding',
        solved: true,
        score: 85,
        attemptedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 3,
        questionId: 2,
        title: 'Implement Merge Sort',
        type: 'Coding',
        solved: false,
        score: 0,
        attemptedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    res.json({
      success: true,
      data: results,
    });
  }
}
