export type TestStatus = 'Passed' | 'Failed' | 'Not Run';
export type TestSeverity = 'Critical' | 'High' | 'Medium' | 'Low';
export type TestModule = 
  | 'All Modules'
  | 'Authentication & SSO'
  | 'Checkout & Stripe Gateway'
  | 'Search & Filter Engine'
  | 'User Profile & Settings'
  | 'REST API & Webhooks'
  | 'Responsive Layout & A11y';

export interface EvidenceAttachment {
  id: string;
  name: string;
  type: 'image' | 'log' | 'trace';
  dataUrl?: string; // base64 or object url
  content?: string;
  timestamp: string;
  size?: string;
}

export interface DefectDetail {
  id: string;
  testCaseId: string;
  title: string;
  severity: TestSeverity;
  targetElement?: string; // Target DOM element / selector where defect occurs
  description: string;
  stepsToReproduce: string[];
  expectedResult: string;
  actualResult: string;
  errorCode?: string;
  errorLogs: string; // HTTP logs, console trace
  screenshotUrl?: string;
  attachments: EvidenceAttachment[];
  aiAnalysis?: {
    rootCause: string;
    confidence: number;
    recommendedFix: string;
    codeSnippet?: string;
  };
  reportedAt: string;
}

export interface TestCase {
  id: string;
  title: string;
  module: string;
  status: TestStatus;
  severity: TestSeverity;
  durationMs?: number;
  lastRun?: string;
  route?: string;
  defect?: DefectDetail;
  description?: string;
}

export interface RunLog {
  id: string;
  timestamp: string;
  testId: string;
  message: string;
  level: 'info' | 'success' | 'warn' | 'error';
}

export interface DashboardMetrics {
  total: number;
  passed: number;
  failed: number;
  notRun: number;
  passRate: number;
  criticalIssues: number;
}

