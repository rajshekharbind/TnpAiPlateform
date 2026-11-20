# create_git_commits.ps1
$ErrorActionPreference = "Continue"

Write-Output "==> Initializing Git repository..."
git init
git branch -M main
git config user.name "Rajshekhar Bind"
git config user.email "raju.rajsekhar123@gmail.com"

# Set remote origin
git remote remove origin 2>$null
git remote add origin https://github.com/rajshekharbind/TnpAiPlateform.git

function Commit-Step($files, $msg) {
    Write-Output "Committing: $msg"
    foreach ($f in $files) {
        if (Test-Path $f) {
            git add $f
        }
    }
    git commit -m "$msg" --allow-empty
}

# 1. Root basics
Commit-Step @(".gitignore", "README.md", "ARCHITECTURE.md", "INDEX.md", ".env.docker") `
    "chore: initial repository setup, documentation, and environment templates"

# 2. CI/CD
Commit-Step @(".github") `
    "ci: add GitHub Actions workflows for continuous integration"

# 3. Docker Compose & Cloud Deploy
Commit-Step @("docker-compose.yml", "docker-compose.prod.yml", "render.yaml") `
    "build(docker): configure multi-container Docker Compose and Render specifications"

# 4. Nginx Reverse Proxy
Commit-Step @("nginx-reverse-proxy.conf", "certs", "generate-certs-docker.bat", "generate-certs-docker.sh") `
    "infra(nginx): configure reverse proxy routing, rate limiting, and SSL certificate setup"

# 5. Shell & Deployment scripts
Commit-Step @("setup-production.sh", "setup-nginx-features.ps1", "setup-nginx-features.sh", "quick-verify.sh", "cleanup.ps1", "docker-cli.bat", "docker-cli.sh") `
    "scripts: add infrastructure provisioning, health verification, and deployment scripts"

# 6. Backend base
Commit-Step @("backend/.dockerignore", "backend/.gitignore", "backend/.env.example", "backend/Dockerfile", "backend/README.md", "backend/START_HERE.md") `
    "feat(backend): initialize backend service configuration, Dockerfile, and docs"

# 7. Backend TypeScript & Config
Commit-Step @("backend/package.json", "backend/package-lock.json", "backend/tsconfig.json", "backend/prisma.config.ts", "backend/prisma") `
    "feat(backend): configure backend TypeScript compiler, dependencies, and Prisma schema"

# 8. Backend Config Layer
Commit-Step @("backend/src/config") `
    "feat(backend): implement environment loader, database, redis, and job queue config"

# 9. Logger Service
Commit-Step @("backend/src/core/logger") `
    "feat(backend): add structured logging service with Winston and request correlation"

# 10. Database Service
Commit-Step @("backend/src/core/database/BaseEntity.ts", "backend/src/core/database/DatabaseService.ts") `
    "feat(backend): configure TypeORM DatabaseService with Row-Level Security support"

# 11. Local File Store
Commit-Step @("backend/src/core/database/LocalStore.ts", "backend/data") `
    "feat(backend): implement local disk file store persistence for offline resilience"

# 12. Cache Service
Commit-Step @("backend/src/core/cache") `
    "feat(backend): implement CacheService with Redis in-memory caching layer"

# 13. API Middleware
Commit-Step @("backend/src/api/middleware") `
    "feat(backend): add JWT authentication, CORS, rate limiting, and request logging middleware"

# 14. Utils & Error Handling
Commit-Step @("backend/src/utils") `
    "feat(backend): implement custom HTTP error classes and utility helper functions"

# 15. Auth Module
Commit-Step @("backend/src/modules/auth") `
    "feat(backend): implement user authentication, MFA, and JWT session controllers"

# 16. User Profile Module
Commit-Step @("backend/src/modules/user") `
    "feat(backend): implement student profile entities and profile management service"

# 17. Jobs Module
Commit-Step @("backend/src/modules/jobs") `
    "feat(backend): implement Job postings and student application management module"

# 18. Companies & Recruiters
Commit-Step @("backend/src/modules/companies", "backend/src/modules/recruiters") `
    "feat(backend): implement Company directories and recruiter discovery controllers"

# 19. Announcements Module
Commit-Step @("backend/src/modules/announcements") `
    "feat(backend): implement Campus placement announcements and broadcast alerts"

# 20. Recruiter Notes Module
Commit-Step @("backend/src/modules/recruiter-notes") `
    "feat(backend): implement Recruiter CRM notes and communication tracking module"

# 21. TnP Members Module
Commit-Step @("backend/src/modules/tnp-members") `
    "feat(backend): implement Training & Placement committee coordinator management"

# 22. Resume ATS Module
Commit-Step @("backend/src/modules/resume-ats") `
    "feat(backend): implement Resume ATS analysis, scoring, and keyword matching engine"

# 23. DSA Tracker Module
Commit-Step @("backend/src/modules/dsa-tracker") `
    "feat(backend): implement Data Structures and Algorithms problem tracking controller"

# 24. OA Practice Module
Commit-Step @("backend/src/modules/oa-practice", "backend/src/modules/oa-tests") `
    "feat(backend): implement Online Assessment practice questions and test modules"

# 25. Mock Interview Module
Commit-Step @("backend/src/modules/mock-interview", "backend/src/modules/interview-rooms") `
    "feat(backend): implement Mock Interview scheduling, question bank, and session rooms"

# 26. Blogs Module
Commit-Step @("backend/src/modules/blogs") `
    "feat(backend): implement Placement preparation blogs, guides, and student articles"

# 27. Placement Policies & Readiness
Commit-Step @("backend/src/modules/placement-policies", "backend/src/modules/one-offer-policy", "backend/src/modules/student-readiness") `
    "feat(backend): implement Placement rules, one-offer policies, and student readiness metrics"

# 28. Drive & Offer Management
Commit-Step @("backend/src/modules/drive-management", "backend/src/modules/offer-management", "backend/src/modules/blacklist") `
    "feat(backend): implement Campus drive scheduling, offer letter management, and blacklists"

# 29. Resume Books & Images
Commit-Step @("backend/src/modules/resume-books", "backend/src/modules/images") `
    "feat(backend): implement Resume Book batch exports and Cloudinary image upload handlers"

# 30. Code Execution & Scoring
Commit-Step @("backend/src/modules/coding-problems", "backend/src/modules/scoring", "backend/src/modules/submissions") `
    "feat(backend): implement code execution runner, scoring models, and submissions handling"

# 31. Shared API Routes & Services
Commit-Step @("backend/src/api/routes", "backend/src/services") `
    "feat(backend): configure API route routing tables and shared services"

# 32. Server Bootstrap
Commit-Step @("backend/src/app.ts", "backend/src/server.ts", "backend/server.js") `
    "feat(backend): configure Express server bootstrap, lifecycle handlers, and graceful shutdown"

# 33. Backend Tests & Health
Commit-Step @("backend/scripts", "backend/tests", "backend/test-cloudinary.ts", "backend/SECURITY_GUIDE.md", "backend/LIVE_CODING_API.md", "backend/TEST_REPORT_VERIFICATION_TOOLS.md") `
    "test(backend): add database seeders, health check scripts, and API verification tools"

# 34. Frontend Setup
Commit-Step @("frontend/.dockerignore", "frontend/.gitignore", "frontend/.env.example", "frontend/Dockerfile", "frontend/nginx.conf", "frontend/README.md", "frontend/CLERK_SETUP.md") `
    "feat(frontend): initialize frontend configuration, Dockerfile, Nginx config, and docs"

# 35. Frontend Tooling & Vite
Commit-Step @("frontend/package.json", "frontend/package-lock.json", "frontend/tsconfig.json", "frontend/tsconfig.node.json", "frontend/vite.config.ts", "frontend/postcss.config.mjs", "frontend/index.html") `
    "feat(frontend): setup Vite React build pipeline, TypeScript config, and Tailwind CSS"

# 36. Styling & CSS Tokens
Commit-Step @("frontend/src/styles", "frontend/src/vite-env.d.ts") `
    "feat(frontend): configure CSS design tokens, typography, and Vite environment definitions"

# 37. Utilities & Services
Commit-Step @("frontend/src/utils", "frontend/src/services") `
    "feat(frontend): implement dynamic backend port detection and API service utilities"

# 38. UI Primitives
Commit-Step @("frontend/src/app/components/ui") `
    "feat(frontend): implement reusable shadcn UI primitives, buttons, dialogs, and cards"

# 39. Shared & Figma Components
Commit-Step @("frontend/src/app/components/shared", "frontend/src/app/components/figma") `
    "feat(frontend): implement shared layout components and Figma design tokens"

# 40. Theme Switcher
Commit-Step @("frontend/src/app/components/ThemeProvider.tsx", "frontend/src/app/components/ThemeToggle.tsx") `
    "feat(frontend): implement Dark/Light mode theme provider and toggle switch"

# 41. Authentication Integration
Commit-Step @("frontend/src/main.tsx", "frontend/src/app/components/Auth.tsx") `
    "feat(frontend): implement Clerk authentication provider and user login component"

# 42. Dashboard & Analytics
Commit-Step @("frontend/src/app/components/Dashboard.tsx", "frontend/src/app/components/Analytics.tsx", "frontend/src/app/components/Analytics_new.tsx") `
    "feat(frontend): implement Placement Dashboard, metrics cards, and analytics charts"

# 43. Jobs & Opportunities UI
Commit-Step @("frontend/src/app/components/Jobs.tsx", "frontend/src/app/components/CompanyDetail.tsx", "frontend/src/app/components/OpportunityDiscovery.tsx", "frontend/src/app/components/JobAnnouncementForm.tsx") `
    "feat(frontend): implement Job listings, company detail view, and job creation form"

# 44. Resume ATS UI
Commit-Step @("frontend/src/app/components/ResumeAtsAnalysis.tsx") `
    "feat(frontend): implement AI Resume ATS score analysis and keyword optimization UI"

# 45. Mock Interview & Live Coding UI
Commit-Step @("frontend/src/app/components/MockInterview.tsx", "frontend/src/app/components/LiveCodingEditor.tsx", "frontend/src/app/components/LiveCodingPage.tsx", "frontend/src/app/components/ProfessionalLiveEditor.css", "frontend/src/app/components/ProfessionalLiveEditor.tsx") `
    "feat(frontend): implement Mock Interview practice, video simulator, and Live Code editor"

# 46. Student Prep Modules
Commit-Step @("frontend/src/app/components/DSATracker.tsx", "frontend/src/app/components/OAPracticeModule.tsx", "frontend/src/app/components/ProjectInterviewPrep.tsx", "frontend/src/app/components/SkillGapAnalysis.tsx", "frontend/src/app/components/EligibilityAlerts.tsx") `
    "feat(frontend): implement DSA Tracker, OA practice tests, skill gap, and eligibility alerts"

# 47. Profile Management UI
Commit-Step @("frontend/src/app/components/StudentProfile.tsx", "frontend/src/app/components/Profile.tsx", "frontend/src/app/components/ProfileIntegration.tsx") `
    "feat(frontend): implement Student Profile management, academics, and portfolio links"

# 48. Recruiter Outreach & Discussions UI
Commit-Step @("frontend/src/app/components/RecruiterOutreach.tsx", "frontend/src/app/components/RoleCreation.tsx", "frontend/src/app/components/CommunityDiscussions.tsx", "frontend/src/app/components/MessagingChat.tsx") `
    "feat(frontend): implement Recruiter Outreach CRM, messaging chat, and discussion forums"

# 49. Announcements & Admin UI
Commit-Step @("frontend/src/app/components/Announcements.tsx", "frontend/src/app/components/Blogs.tsx", "frontend/src/app/components/admin") `
    "feat(frontend): implement Campus Announcements, placement blogs, and admin portal"

# 50. Main App Router
Commit-Step @("frontend/src/app/App.tsx", "frontend/guidelines") `
    "feat(frontend): implement Root App layout, navigation sidebar, and application routing"

# 51. Launchers & Integration Tools
Commit-Step @("start-all.bat", "start-backend.bat", "start-frontend.bat", "test-connection.js", "test-integration.ps1", "FRONTEND_TEST_CONSOLE.js", "DEPLOYMENT_GUIDE.md", "CI_CD_SETUP.md", "CLOUDINARY_SETUP.md", "QUICK_START.md", "README_DEPLOYMENT.txt") `
    "chore: add automated launcher scripts, test consoles, and complete deployment guide"

# 52. Any remainder
git add -A
$status = git status --porcelain
if ($status) {
    git commit -m "chore: final project assets, configurations, and verification scripts"
}

Write-Output "==> Commit creation finished! Verifying commit count..."
$count = (git log --oneline | Measure-Object -Line).Lines
Write-Output "Total commits created: $count"
