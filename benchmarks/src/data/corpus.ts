/**
 * Real, live job posting URLs used to exercise the full discovery +
 * extraction pipeline against real-world ATS pages. These are genuinely
 * public job postings (no personal data, nothing scraped/reproduced here —
 * just URLs), seeded across a couple of different ATS platforms since
 * they render very differently (Greenhouse vs. Lever markup).
 *
 * ADD YOUR OWN: the more platforms/company sizes represented here, the more
 * credible "87% discovery success rate across N companies" looks on a CV.
 * Aim for a mix of: different ATS platforms, companies with a footer
 * privacy link vs. buried-in-nav, and at least one you expect to FAIL
 * (e.g. a LinkedIn/Indeed-hosted posting your robots.ts should correctly
 * refuse) — a benchmark with no expected failures isn't testing anything.
 *
 * NOTE: live postings expire. Swap in fresh ones periodically — a job
 * URL 404ing just becomes a `request_failed` data point, it won't crash
 * the run, but it also won't tell you much about your pipeline.
 */
export interface CorpusEntry {
  id: string;
  jobUrl: string;
  jobTitle: string;
  atsHint: "greenhouse" | "lever" | "workday" | "direct" | "other";
}

export const CORPUS: CorpusEntry[] = [
  {
    id: "greenhouse-1",
    jobUrl: "https://job-boards.greenhouse.io/greenhouse/jobs/7315810",
    jobTitle: "Senior Product Marketing Manager, B2C",
    atsHint: "greenhouse",
  },
  {
    id: "greenhouse-2",
    jobUrl: "https://job-boards.greenhouse.io/greenhouse/jobs/2155040",
    jobTitle: "Sales — General Application",
    atsHint: "greenhouse",
  },
  {
    id: "lever-1",
    jobUrl: "https://jobs.lever.co/jobgether/12b0e6b2-064d-4172-80aa-2fdff00f569a",
    jobTitle: "Specialist - Software Engineering",
    atsHint: "lever",
  },

  // --- Add your own below --------------------------------------------
  {
    id: "amazon-warehouse-1",
    jobUrl: "https://www.jobsatamazon.co.uk/app#/jobDetail?jobId=JOB-UK-0000000134&locale=en-GB",
    jobTitle: "Warehouse Operative",
    atsHint: "direct",
  },
  {
    id: "amazon-warehouse-2",
    jobUrl: "https://www.jobsatamazon.co.uk/app#/jobDetail?jobId=JOB-UK-0000000187&locale=en-GB",
    jobTitle: "Warehouse Operative",
    atsHint: "direct",
  },
  {
    id: "amazon-warehouse-3",
    jobUrl: "https://www.jobsatamazon.co.uk/app#/jobDetail?jobId=JOB-UK-0000000192&locale=en-GB",
    jobTitle: "Warehouse Associate",
    atsHint: "direct",
  },
  {
    id: "amazon-warehouse-4",
    jobUrl: "https://www.jobsatamazon.co.uk/app#/jobDetail?jobId=JOB-UK-0000000204&locale=en-GB",
    jobTitle: "Delivery Station Warehouse Associate",
    atsHint: "direct",
  },
  {
    id: "amazon-warehouse-5",
    jobUrl: "https://www.jobsatamazon.co.uk/app#/jobDetail?jobId=JOB-UK-0000000205&locale=en-GB",
    jobTitle: "Delivery Station Warehouse Associate",
    atsHint: "direct",
  },
  {
    id: "amazon-warehouse-6",
    jobUrl: "https://www.jobsatamazon.co.uk/app#/jobDetail?jobId=JOB-UK-0000000339&locale=en-GB",
    jobTitle: "Delivery Station Warehouse Associate",
    atsHint: "direct",
  },
  {
    id: "amazon-warehouse-6",
    jobUrl: "https://www.jobsatamazon.co.uk/app#/jobDetail?jobId=JOB-UK-0000000339&locale=en-GB",
    jobTitle: "Delivery Station Warehouse Associate",
    atsHint: "direct",
  },
  {
    id: "amazon-warehouse-7",
    jobUrl: "https://www.jobsatamazon.co.uk/app#/jobDetail?jobId=JOB-UK-0000000342&locale=en-GB",
    jobTitle: "Warehouse Associate",
    atsHint: "direct",
  },
  {
    id: "amazon-warehouse-8",
    jobUrl: "https://www.jobsatamazon.co.uk/app#/jobDetail?jobId=JOB-UK-0000000538&locale=en-GB",
    jobTitle: "Warehouse Equipment Operator",
    atsHint: "direct",
  },
  {
    id: "amazon-amzl-1",
    jobUrl: "https://www.amazon.jobs/en/jobs/10485855/reliability-maintenance-engineering-area-manager-amzl",
    jobTitle: "Reliability Maintenance Engineering Area Manager, AMZL",
    atsHint: "direct",
  },
  {
    id: "amazon-amzl-2",
    jobUrl: "https://www.amazon.jobs/en/jobs/10406466/reliability-maintenance-engineering-technician-engineering-technician-electrical-engineer-maintenance-engineer-service-and-maintenance-engineer-amzl-dxw3-rme",
    jobTitle: "Reliability Maintenance Engineering Technician / Engineering Technician / Electrical Engineer / Maintenance engineer / Service and Maintenance Engineer, AMZL DXW3-RME",
    atsHint: "direct",
  },
];
