import request from 'supertest';
import { App } from '../src/app';

async function verifyAllSections() {
  console.log('🚀 Starting System Audit & Verification of All Backend Endpoints...\n');
  const appInstance = new App();
  const expressApp = appInstance.getApp();

  let passed = 0;
  let total = 0;

  async function checkEndpoint(name: string, fn: () => Promise<any>) {
    total++;
    try {
      await fn();
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`❌ [FAIL] ${name}:`, err.message || err);
    }
  }

  // 1. Health & Server Info
  await checkEndpoint('GET /health', async () => {
    const res = await request(expressApp).get('/health');
    if (res.status !== 200 || res.body.status !== 'ok') throw new Error(`Unexpected response: ${res.status}`);
  });

  // 2. Dashboard Stats
  await checkEndpoint('GET /api/v1/dashboard/stats', async () => {
    const res = await request(expressApp).get('/api/v1/dashboard/stats');
    if (res.status !== 200 || !res.body.success || !res.body.data) throw new Error(`Status ${res.status}`);
  });

  // 3. Dashboard Overview
  await checkEndpoint('GET /api/v1/dashboard/overview', async () => {
    const res = await request(expressApp).get('/api/v1/dashboard/overview');
    if (res.status !== 200 || !res.body.success) throw new Error(`Status ${res.status}`);
  });

  // 4. OA Tests List
  await checkEndpoint('GET /api/v1/oa-tests/list', async () => {
    const res = await request(expressApp).get('/api/v1/oa-tests/list');
    if (res.status !== 200 || !res.body.success || !Array.isArray(res.body.tests)) {
      throw new Error(`Status ${res.status}`);
    }
    if (res.body.tests.length < 3) throw new Error('Expected at least 3 pre-loaded OA tests');
  });

  // 5. OA Test Start
  await checkEndpoint('POST /api/v1/oa-tests/oa-test-1/start', async () => {
    const res = await request(expressApp).post('/api/v1/oa-tests/oa-test-1/start');
    if (res.status !== 200 || !res.body.questions || res.body.questions.length === 0) {
      throw new Error(`Failed to start OA test: ${res.status}`);
    }
  });

  // 6. OA Test Submit
  await checkEndpoint('POST /api/v1/oa-tests/oa-test-1/submit', async () => {
    const res = await request(expressApp)
      .post('/api/v1/oa-tests/oa-test-1/submit')
      .send({ userAnswers: [0, 1, 1, 2] });
    if (res.status !== 200 || !res.body.success || res.body.score !== 100) {
      throw new Error(`OA evaluation unexpected: score=${res.body?.score}`);
    }
  });

  // 7. Live Coding Problems
  await checkEndpoint('GET /api/v1/problems', async () => {
    const res = await request(expressApp).get('/api/v1/problems');
    if (res.status !== 200 || !res.body.success || !Array.isArray(res.body.data)) throw new Error(`Status ${res.status}`);
    if (res.body.data.length < 8) throw new Error('Expected at least 8 LeetCode problems');
  });

  // 8. Live Coding JS Execution
  await checkEndpoint('POST /api/v1/submissions/run (JavaScript)', async () => {
    const code = `function twoSum(nums, target) {
      const map = new Map();
      for (let i = 0; i < nums.length; i++) {
        const diff = target - nums[i];
        if (map.has(diff)) return [map.get(diff), i];
        map.set(nums[i], i);
      }
      return [];
    }`;
    const res = await request(expressApp)
      .post('/api/v1/submissions/run')
      .send({
        problemId: 1,
        language: 'javascript',
        code,
      });
    if (res.status !== 200 || !res.body.success || !res.body.data?.status) throw new Error(`Run failed: ${res.status}`);
  });

  // 9. Live Coding Python Execution
  await checkEndpoint('POST /api/v1/submissions/run (Python)', async () => {
    const code = `def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []`;
    const res = await request(expressApp)
      .post('/api/v1/submissions/run')
      .send({
        problemId: 1,
        language: 'python',
        code,
      });
    if (res.status !== 200 || !res.body.success || !res.body.data?.status) throw new Error(`Run failed: ${res.status}`);
  });

  // 10. Companies Directory
  await checkEndpoint('GET /api/v1/companies', async () => {
    const res = await request(expressApp).get('/api/v1/companies');
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
  });

  // 11. Jobs Directory
  await checkEndpoint('GET /api/v1/jobs', async () => {
    const res = await request(expressApp).get('/api/v1/jobs');
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
  });

  // 12. Blogs
  await checkEndpoint('GET /api/v1/blogs', async () => {
    const res = await request(expressApp).get('/api/v1/blogs');
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
  });

  // 13. Announcements
  await checkEndpoint('GET /api/v1/announcements', async () => {
    const res = await request(expressApp).get('/api/v1/announcements');
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
  });

  // 14. Placement Policies (Database-backed)
  await checkEndpoint('GET /api/v1/placement-policies', async () => {
    const res = await request(expressApp).get('/api/v1/placement-policies');
    if (res.status !== 200 || !res.body.success || !Array.isArray(res.body.data)) {
      throw new Error(`Status ${res.status}`);
    }
  });

  // 15. Blacklist Management (Database-backed)
  await checkEndpoint('GET /api/v1/blacklist', async () => {
    const res = await request(expressApp).get('/api/v1/blacklist');
    if (res.status !== 200 || !res.body.success || !Array.isArray(res.body.data)) {
      throw new Error(`Status ${res.status}`);
    }
  });

  // 16. One Offer Policy (Database-backed)
  await checkEndpoint('GET /api/v1/one-offer-policy', async () => {
    const res = await request(expressApp).get('/api/v1/one-offer-policy');
    if (res.status !== 200 || !res.body.success || !Array.isArray(res.body.data)) {
      throw new Error(`Status ${res.status}`);
    }
  });

  // 17. Drives Management (Database-backed)
  await checkEndpoint('GET /api/v1/drives', async () => {
    const res = await request(expressApp).get('/api/v1/drives');
    if (res.status !== 200 || !res.body.success || !Array.isArray(res.body.data)) {
      throw new Error(`Status ${res.status}`);
    }
  });

  // 18. Offer Management (Database-backed)
  await checkEndpoint('GET /api/v1/offers', async () => {
    const res = await request(expressApp).get('/api/v1/offers');
    if (res.status !== 200 || !res.body.success || !Array.isArray(res.body.data)) {
      throw new Error(`Status ${res.status}`);
    }
  });

  // 19. Mock Interviews (Database-backed)
  await checkEndpoint('GET /api/v1/mock-interview', async () => {
    const res = await request(expressApp).get('/api/v1/mock-interview');
    if (res.status !== 200 || !res.body.success || !Array.isArray(res.body.data)) {
      throw new Error(`Status ${res.status}`);
    }
  });

  // 20. Resume Books (Database-backed)
  await checkEndpoint('GET /api/v1/resume-books', async () => {
    const res = await request(expressApp).get('/api/v1/resume-books');
    if (res.status !== 200 || !res.body.success || !Array.isArray(res.body.data)) {
      throw new Error(`Status ${res.status}`);
    }
  });

  // 21. Student Readiness (Database-backed)
  await checkEndpoint('GET /api/v1/student-readiness', async () => {
    const res = await request(expressApp).get('/api/v1/student-readiness');
    if (res.status !== 200 || !res.body.success || !Array.isArray(res.body.data)) {
      throw new Error(`Status ${res.status}`);
    }
  });

  console.log(`\n=============================================`);
  console.log(`📊 Audit Result: ${passed}/${total} Endpoints Verified Successfully!`);
  console.log(`=============================================\n`);

  if (passed === total) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

verifyAllSections().catch(err => {
  console.error('Fatal audit failure:', err);
  process.exit(1);
});
