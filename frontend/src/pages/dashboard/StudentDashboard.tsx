import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { useOnboardingStore } from '../../services/onboardingStore';
import { recommendationsAPI } from '../../services/api';
import ChatDock from '../../components/chat/ChatDock';

interface CollegeRequirement {
  id: string;
  name: string;
  website: string;
  deadlines: { type: string; date: string }[];
  requires: string[]; // e.g., ['Common App', 'Supplemental Essays', 'SAT/ACT optional']
  prepChecklist?: { key: string; label: string }[];
}

const MOCK_COLLEGES: Record<string, CollegeRequirement> = {
  'stanford-university': {
    id: 'stanford-university',
    name: 'Stanford University',
    website: 'https://admission.stanford.edu/',
    deadlines: [
      { type: 'Restrictive Early Action', date: '2025-11-01' },
      { type: 'Regular Decision', date: '2026-01-05' }
    ],
    requires: ['Common App', 'Stanford Questions', 'School Report & Transcript', 'Teacher Evaluations', 'SAT/ACT optional'],
    prepChecklist: [
      { key: 'common-app', label: 'Complete Common App profile' },
      { key: 'stanford-questions', label: 'Draft Stanford short answers' },
      { key: 'teacher-rec-1', label: 'Confirm Teacher Recommendation #1' },
      { key: 'teacher-rec-2', label: 'Confirm Teacher Recommendation #2' },
      { key: 'activities-section', label: 'Polish Activities & Honors section' }
    ]
  },
  'harvard-university': {
    id: 'harvard-university',
    name: 'Harvard University',
    website: 'https://college.harvard.edu/admissions',
    deadlines: [
      { type: 'Restrictive Early Action', date: '2025-11-01' },
      { type: 'Regular Decision', date: '2026-01-01' }
    ],
    requires: ['Common App or Coalition', 'Harvard Supplement', 'School Report & Transcript', 'Teacher Recommendations', 'SAT/ACT required'],
    prepChecklist: [
      { key: 'common-app', label: 'Complete Common App profile' },
      { key: 'harvard-supp', label: 'Draft Harvard supplement' },
      { key: 'teacher-rec-1', label: 'Confirm Teacher Recommendation #1' },
      { key: 'teacher-rec-2', label: 'Confirm Teacher Recommendation #2' },
      { key: 'personal-essay', label: 'Finalize personal statement' }
    ]
  },
  'massachusetts-institute-of-technology': {
    id: 'massachusetts-institute-of-technology',
    name: 'Massachusetts Institute of Technology',
    website: 'https://mitadmissions.org/',
    deadlines: [
      { type: 'Early Action', date: '2025-11-01' },
      { type: 'Regular Action', date: '2026-01-06' }
    ],
    requires: ['MIT Application', 'Secondary School Report & Transcript', 'Two Teacher Recommendations', 'Standardized Tests required'],
    prepChecklist: [
      { key: 'mit-app', label: 'Complete MIT application' },
      { key: 'feb-updates', label: 'Prepare February Updates & Notes Form' },
      { key: 'teacher-recs', label: 'Confirm two teacher recommendations' }
    ]
  },
  'mit': {
    id: 'mit',
    name: 'Massachusetts Institute of Technology',
    website: 'https://mitadmissions.org/',
    deadlines: [
      { type: 'Early Action', date: '2025-11-01' },
      { type: 'Regular Action', date: '2026-01-06' }
    ],
    requires: ['MIT Application', 'Secondary School Report & Transcript', 'Two Teacher Recommendations', 'Standardized Tests required'],
    prepChecklist: [
      { key: 'mit-app', label: 'Complete MIT application' },
      { key: 'feb-updates', label: 'Prepare February Updates & Notes Form' },
      { key: 'teacher-recs', label: 'Confirm two teacher recommendations' }
    ]
  },
  'yale-university': {
    id: 'yale-university',
    name: 'Yale University',
    website: 'https://admissions.yale.edu/',
    deadlines: [
      { type: 'Single-Choice Early Action', date: '2025-11-01' },
      { type: 'Regular Decision', date: '2026-01-02' }
    ],
    requires: ['Common App or Coalition', 'Yale-Specific Questions', 'School Report & Transcript', 'Two Teacher Recommendations', 'Standardized Tests required'],
    prepChecklist: [
      { key: 'yale-supp', label: 'Draft Yale short answers' },
      { key: 'teacher-recs', label: 'Confirm two teacher recommendations' },
      { key: 'school-report', label: 'Ensure counselor submits school report' }
    ]
  },
  'princeton-university': {
    id: 'princeton-university',
    name: 'Princeton University',
    website: 'https://admission.princeton.edu/',
    deadlines: [
      { type: 'Single-Choice Early Action', date: '2025-11-01' },
      { type: 'Regular Decision', date: '2026-01-01' }
    ],
    requires: ['Common App or Coalition', 'Princeton Supplement', 'School Report & Transcript', 'Two Teacher Recommendations', 'Standardized Tests required', 'Graded written paper'],
    prepChecklist: [
      { key: 'graded-paper', label: 'Select graded written paper to submit' },
      { key: 'teacher-recs', label: 'Confirm two teacher recommendations' },
      { key: 'supplement', label: 'Draft Princeton supplement' }
    ]
  },
  'columbia-university': {
    id: 'columbia-university',
    name: 'Columbia University',
    website: 'https://undergrad.admissions.columbia.edu/',
    deadlines: [
      { type: 'Early Decision', date: '2025-11-01' },
      { type: 'Regular Decision', date: '2026-01-01' }
    ],
    requires: ['Common App', 'Columbia-Specific Questions', 'School Report & Transcript', 'Two Teacher Recommendations', 'Standardized Tests optional'],
    prepChecklist: [
      { key: 'columbia-supp', label: 'Draft Columbia-specific questions' },
      { key: 'teacher-recs', label: 'Confirm two teacher recommendations' },
      { key: 'activity-depth', label: 'Curate activities for depth and impact' }
    ]
  },
  // Additional top schools
  'university-of-pennsylvania': {
    id: 'university-of-pennsylvania',
    name: 'University of Pennsylvania',
    website: 'https://admissions.upenn.edu/',
    deadlines: [
      { type: 'Early Decision', date: '2025-11-01' },
      { type: 'Regular Decision', date: '2026-01-05' }
    ],
    requires: ['Common App', 'Penn Supplement', 'School Report & Transcript', 'Two Teacher Recommendations', 'Standardized Tests required'],
    prepChecklist: [
      { key: 'penn-supp', label: 'Draft Penn supplement' },
      { key: 'teacher-recs', label: 'Confirm two teacher recommendations' },
      { key: 'program-fit', label: 'Articulate school/program fit' }
    ]
  },
  'brown-university': {
    id: 'brown-university',
    name: 'Brown University',
    website: 'https://admission.brown.edu/',
    deadlines: [
      { type: 'Early Decision', date: '2025-11-01' },
      { type: 'Regular Decision', date: '2026-01-05' }
    ],
    requires: ['Common App', 'Brown Supplement', 'School Report & Transcript', 'Two Teacher Recommendations', 'Standardized Tests required'],
    prepChecklist: [
      { key: 'brown-supp', label: 'Draft Brown supplement' },
      { key: 'teacher-recs', label: 'Confirm two teacher recommendations' },
      { key: 'open-curriculum', label: 'Connect to Open Curriculum' }
    ]
  },
  'cornell-university': {
    id: 'cornell-university',
    name: 'Cornell University',
    website: 'https://admissions.cornell.edu/',
    deadlines: [
      { type: 'Early Decision', date: '2025-11-01' },
      { type: 'Regular Decision', date: '2026-01-02' }
    ],
    requires: ['Common App', 'College-Specific Supplement', 'School Report & Transcript', 'Two Teacher Recommendations', 'Standardized Tests required'],
    prepChecklist: [
      { key: 'college-fit', label: 'Justify chosen Cornell college' },
      { key: 'teacher-recs', label: 'Confirm two teacher recommendations' },
      { key: 'experiences', label: 'Align experiences to program' }
    ]
  },
  'dartmouth-college': {
    id: 'dartmouth-college',
    name: 'Dartmouth College',
    website: 'https://admissions.dartmouth.edu/',
    deadlines: [
      { type: 'Early Decision', date: '2025-11-01' },
      { type: 'Regular Decision', date: '2026-01-02' }
    ],
    requires: ['Common App', 'Dartmouth Supplement', 'School Report & Transcript', 'Two Teacher Recommendations', 'Standardized Tests required'],
    prepChecklist: [
      { key: 'dartmouth-supp', label: 'Draft Dartmouth supplement' },
      { key: 'teacher-recs', label: 'Confirm two teacher recommendations' },
      { key: 'community', label: 'Show community contributions' }
    ]
  },
  'university-of-chicago': {
    id: 'university-of-chicago',
    name: 'University of Chicago',
    website: 'https://collegeadmissions.uchicago.edu/',
    deadlines: [
      { type: 'Early Action / ED I', date: '2025-11-01' },
      { type: 'ED II', date: '2026-01-02' },
      { type: 'Regular Decision', date: '2026-01-02' }
    ],
    requires: ['Common App or Coalition', 'UChicago Supplement', 'School Report & Transcript', 'Two Teacher Recommendations', 'Standardized Tests optional'],
    prepChecklist: [
      { key: 'uchicago-supp', label: 'Complete UChicago creative essay' },
      { key: 'teacher-recs', label: 'Confirm two teacher recommendations' },
      { key: 'fit', label: 'Demonstrate intellectual fit' }
    ]
  },
  'northwestern-university': {
    id: 'northwestern-university',
    name: 'Northwestern University',
    website: 'https://admissions.northwestern.edu/',
    deadlines: [
      { type: 'Early Decision', date: '2025-11-01' },
      { type: 'Regular Decision', date: '2026-01-03' }
    ],
    requires: ['Common App', 'Northwestern Supplement', 'School Report & Transcript', 'Two Teacher Recommendations', 'Standardized Tests required'],
    prepChecklist: [
      { key: 'northwestern-supp', label: 'Draft Northwestern supplement' },
      { key: 'teacher-recs', label: 'Confirm two teacher recommendations' },
      { key: 'program-depth', label: 'Demonstrate program depth' }
    ]
  },
  'duke-university': {
    id: 'duke-university',
    name: 'Duke University',
    website: 'https://admissions.duke.edu/',
    deadlines: [
      { type: 'Early Decision', date: '2025-11-01' },
      { type: 'Regular Decision', date: '2026-01-02' }
    ],
    requires: ['Common App or Coalition', 'Duke Supplement', 'School Report & Transcript', 'Two Teacher Recommendations', 'Standardized Tests required'],
    prepChecklist: [
      { key: 'duke-supp', label: 'Draft Duke supplement' },
      { key: 'teacher-recs', label: 'Confirm two teacher recommendations' },
      { key: 'impact', label: 'Show leadership and impact' }
    ]
  },
  'johns-hopkins-university': {
    id: 'johns-hopkins-university',
    name: 'Johns Hopkins University',
    website: 'https://apply.jhu.edu/',
    deadlines: [
      { type: 'ED I', date: '2025-11-01' },
      { type: 'ED II', date: '2026-01-02' },
      { type: 'Regular Decision', date: '2026-01-02' }
    ],
    requires: ['Common App', 'JHU Supplement', 'School Report & Transcript', 'Two Teacher Recommendations', 'Standardized Tests required'],
    prepChecklist: [
      { key: 'jhu-supp', label: 'Draft JHU supplement' },
      { key: 'teacher-recs', label: 'Confirm two teacher recommendations' },
      { key: 'research', label: 'Highlight research experiences' }
    ]
  },
  'carnegie-mellon-university': {
    id: 'carnegie-mellon-university',
    name: 'Carnegie Mellon University',
    website: 'https://www.cmu.edu/admission/',
    deadlines: [
      { type: 'ED I', date: '2025-11-01' },
      { type: 'ED II', date: '2026-01-03' },
      { type: 'Regular Decision', date: '2026-01-03' }
    ],
    requires: ['Common App', 'CMU Program Materials', 'School Report & Transcript', 'Teacher Recommendations', 'Standardized Tests required'],
    prepChecklist: [
      { key: 'program-materials', label: 'Complete program-specific materials' },
      { key: 'teacher-recs', label: 'Confirm teacher recommendations' },
      { key: 'portfolio', label: 'Prepare portfolio if applicable' }
    ]
  },
  'california-institute-of-technology': {
    id: 'california-institute-of-technology',
    name: 'California Institute of Technology',
    website: 'https://www.admissions.caltech.edu/',
    deadlines: [
      { type: 'Restrictive EA', date: '2025-11-01' },
      { type: 'Regular Decision', date: '2026-01-03' }
    ],
    requires: ['Caltech Application/Coalition', 'School Report & Transcript', 'Teacher Recommendations', 'Standardized Tests required'],
    prepChecklist: [
      { key: 'math-science', label: 'Emphasize math/science rigor' },
      { key: 'teacher-recs', label: 'Confirm teacher recommendations' },
      { key: 'research', label: 'Highlight STEM projects' }
    ]
  },
  'new-york-university': {
    id: 'new-york-university',
    name: 'New York University',
    website: 'https://www.nyu.edu/admissions.html',
    deadlines: [
      { type: 'ED I', date: '2025-11-01' },
      { type: 'ED II', date: '2026-01-01' },
      { type: 'Regular Decision', date: '2026-01-05' }
    ],
    requires: ['Common App', 'NYU Program Questions', 'School Report & Transcript', 'Teacher Recommendations', 'Standardized Tests optional'],
    prepChecklist: [
      { key: 'nyu-choices', label: 'Set campus/program preferences' },
      { key: 'teacher-recs', label: 'Confirm teacher recommendations' },
      { key: 'portfolio', label: 'Portfolio if Tisch/Steinhardt' }
    ]
  },
  'duke': { id: 'duke', name: 'Duke University', website: 'https://admissions.duke.edu/', deadlines: [ { type: 'Early Decision', date: '2025-11-01' }, { type: 'Regular Decision', date: '2026-01-02' } ], requires: ['Common App or Coalition'], prepChecklist: [ { key: 'duke-supp', label: 'Draft Duke supplement' } ] },
  'uchicago': { id: 'uchicago', name: 'University of Chicago', website: 'https://collegeadmissions.uchicago.edu/', deadlines: [ { type: 'EA/ED I', date: '2025-11-01' }, { type: 'ED II / RD', date: '2026-01-02' } ], requires: ['Common App or Coalition'], prepChecklist: [ { key: 'uchicago-supp', label: 'Complete creative essay' } ] },
  // UC system examples
  'university-of-california-berkeley': {
    id: 'university-of-california-berkeley',
    name: 'University of California, Berkeley',
    website: 'https://admissions.berkeley.edu/',
    deadlines: [
      { type: 'Application Deadline', date: '2025-11-30' }
    ],
    requires: ['UC Application', 'Academic History', 'PIQs', 'No Letters of Rec (generally)'],
    prepChecklist: [
      { key: 'piq', label: 'Draft UC Personal Insight Questions' },
      { key: 'activities', label: 'Complete activities & awards' },
      { key: 'transcript-check', label: 'Verify academic history accuracy' }
    ]
  },
  'uc-berkeley': {
    id: 'uc-berkeley',
    name: 'University of California, Berkeley',
    website: 'https://admissions.berkeley.edu/',
    deadlines: [ { type: 'Application Deadline', date: '2025-11-30' } ],
    requires: ['UC Application'],
    prepChecklist: [ { key: 'piq', label: 'Draft UC Personal Insight Questions' } ]
  },
  'university-of-california-los-angeles': {
    id: 'university-of-california-los-angeles',
    name: 'University of California, Los Angeles',
    website: 'https://admission.ucla.edu/',
    deadlines: [ { type: 'Application Deadline', date: '2025-11-30' } ],
    requires: ['UC Application', 'PIQs'],
    prepChecklist: [ { key: 'piq', label: 'Draft UC Personal Insight Questions' } ]
  },
  'ucla': { id: 'ucla', name: 'University of California, Los Angeles', website: 'https://admission.ucla.edu/', deadlines: [ { type: 'Application Deadline', date: '2025-11-30' } ], requires: ['UC Application'], prepChecklist: [ { key: 'piq', label: 'Draft UC Personal Insight Questions' } ] },
  // USC & Georgetown
  'university-of-southern-california': {
    id: 'university-of-southern-california',
    name: 'University of Southern California',
    website: 'https://admission.usc.edu/',
    deadlines: [
      { type: 'Early Action (scholarship)', date: '2025-11-01' },
      { type: 'Regular Decision', date: '2026-01-15' }
    ],
    requires: ['Common App', 'USC Questions', 'Transcript', 'Recommendations (varies by program)'],
    prepChecklist: [
      { key: 'usc-supp', label: 'Draft USC short answers' },
      { key: 'portfolio', label: 'Prepare portfolio if required' },
      { key: 'teacher-recs', label: 'Confirm recommendations if required' }
    ]
  },
  'usc': { id: 'usc', name: 'University of Southern California', website: 'https://admission.usc.edu/', deadlines: [ { type: 'EA (scholarship)', date: '2025-11-01' }, { type: 'Regular Decision', date: '2026-01-15' } ], requires: ['Common App'], prepChecklist: [ { key: 'usc-supp', label: 'Draft USC short answers' } ] },
  'georgetown-university': {
    id: 'georgetown-university',
    name: 'Georgetown University',
    website: 'https://uadmissions.georgetown.edu/',
    deadlines: [
      { type: 'Early Action', date: '2025-11-01' },
      { type: 'Regular Decision', date: '2026-01-10' }
    ],
    requires: ['Georgetown Application', 'Supplement', 'School Report & Transcript', 'Teacher Recommendations', 'Standardized Tests required'],
    prepChecklist: [
      { key: 'georgetown-supp', label: 'Draft Georgetown essays' },
      { key: 'teacher-recs', label: 'Confirm teacher recommendations' },
      { key: 'alumni-interview', label: 'Plan alumni interview (if offered)' }
    ]
  },
  // Public flagships with EA
  'university-of-michigan': {
    id: 'university-of-michigan',
    name: 'University of Michigan',
    website: 'https://admissions.umich.edu/',
    deadlines: [
      { type: 'Early Action', date: '2025-11-01' },
      { type: 'Regular Decision', date: '2026-02-01' }
    ],
    requires: ['Common App', 'Michigan Questions', 'Transcript', 'Teacher Recommendation'],
    prepChecklist: [
      { key: 'michigan-supp', label: 'Draft Michigan essays' },
      { key: 'teacher-rec', label: 'Confirm teacher recommendation' },
      { key: 'fit', label: 'Show fit with college/major' }
    ]
  },
  // Additional additions
  'vanderbilt-university': {
    id: 'vanderbilt-university',
    name: 'Vanderbilt University',
    website: 'https://admissions.vanderbilt.edu/',
    deadlines: [
      { type: 'ED I', date: '2025-11-01' },
      { type: 'ED II', date: '2026-01-01' },
      { type: 'Regular Decision', date: '2026-01-01' }
    ],
    requires: ['Common App or Coalition', 'Transcript', 'Recommendations'],
    prepChecklist: [
      { key: 'vandy-supp', label: 'Draft Vanderbilt essays' },
      { key: 'teachers', label: 'Confirm teacher recommendations' }
    ]
  },
  'vanderbilt': { id: 'vanderbilt', name: 'Vanderbilt University', website: 'https://admissions.vanderbilt.edu/', deadlines: [ { type: 'ED I', date: '2025-11-01' }, { type: 'ED II', date: '2026-01-01' }, { type: 'RD', date: '2026-01-01' } ], requires: ['Common App or Coalition'], prepChecklist: [ { key: 'vandy-supp', label: 'Draft Vanderbilt essays' } ] },
  'rice-university': {
    id: 'rice-university',
    name: 'Rice University',
    website: 'https://admission.rice.edu/',
    deadlines: [ { type: 'ED', date: '2025-11-01' }, { type: 'Regular Decision', date: '2026-01-04' } ],
    requires: ['Common App or Coalition', 'Rice Supplement', 'Recommendations'],
    prepChecklist: [ { key: 'rice-supp', label: 'Draft Rice supplement' } ]
  },
  'rice': { id: 'rice', name: 'Rice University', website: 'https://admission.rice.edu/', deadlines: [ { type: 'ED', date: '2025-11-01' }, { type: 'RD', date: '2026-01-04' } ], requires: ['Common App or Coalition'], prepChecklist: [ { key: 'rice-supp', label: 'Draft Rice supplement' } ] },
  'emory-university': {
    id: 'emory-university',
    name: 'Emory University',
    website: 'https://apply.emory.edu/',
    deadlines: [ { type: 'ED I', date: '2025-11-01' }, { type: 'ED II', date: '2026-01-01' }, { type: 'RD', date: '2026-01-01' } ],
    requires: ['Common App', 'Emory Supplement'],
    prepChecklist: [ { key: 'emory-supp', label: 'Draft Emory supplement' } ]
  },
  'emory': { id: 'emory', name: 'Emory University', website: 'https://apply.emory.edu/', deadlines: [ { type: 'ED I', date: '2025-11-01' }, { type: 'ED II', date: '2026-01-01' }, { type: 'RD', date: '2026-01-01' } ], requires: ['Common App'], prepChecklist: [ { key: 'emory-supp', label: 'Draft Emory supplement' } ] },
  'university-of-notre-dame': {
    id: 'university-of-notre-dame',
    name: 'University of Notre Dame',
    website: 'https://admissions.nd.edu/',
    deadlines: [ { type: 'Restrictive EA', date: '2025-11-01' }, { type: 'RD', date: '2026-01-01' } ],
    requires: ['Common App or Coalition', 'ND Writing Supplement'],
    prepChecklist: [ { key: 'nd-supp', label: 'Draft Notre Dame supplement' } ]
  },
  'notre-dame': { id: 'notre-dame', name: 'University of Notre Dame', website: 'https://admissions.nd.edu/', deadlines: [ { type: 'REA', date: '2025-11-01' }, { type: 'RD', date: '2026-01-01' } ], requires: ['Common App'], prepChecklist: [ { key: 'nd-supp', label: 'Draft Notre Dame supplement' } ] },
  'university-of-virginia': {
    id: 'university-of-virginia',
    name: 'University of Virginia',
    website: 'https://admission.virginia.edu/',
    deadlines: [ { type: 'EA', date: '2025-11-01' }, { type: 'RD', date: '2026-01-05' } ],
    requires: ['Common App', 'UVA Questions'],
    prepChecklist: [ { key: 'uva-supp', label: 'Draft UVA supplement' } ]
  },
  'uva': { id: 'uva', name: 'University of Virginia', website: 'https://admission.virginia.edu/', deadlines: [ { type: 'EA', date: '2025-11-01' }, { type: 'RD', date: '2026-01-05' } ], requires: ['Common App'], prepChecklist: [ { key: 'uva-supp', label: 'Draft UVA supplement' } ] },
  'university-of-north-carolina-at-chapel-hill': {
    id: 'university-of-north-carolina-at-chapel-hill',
    name: 'University of North Carolina at Chapel Hill',
    website: 'https://admissions.unc.edu/',
    deadlines: [ { type: 'Early Action', date: '2025-10-15' }, { type: 'RD', date: '2026-01-15' } ],
    requires: ['Common App', 'UNC Questions'],
    prepChecklist: [ { key: 'unc-supp', label: 'Draft UNC short answers' } ]
  },
  'unc': { id: 'unc', name: 'UNC Chapel Hill', website: 'https://admissions.unc.edu/', deadlines: [ { type: 'EA', date: '2025-10-15' }, { type: 'RD', date: '2026-01-15' } ], requires: ['Common App'], prepChecklist: [ { key: 'unc-supp', label: 'Draft UNC short answers' } ] },
  'georgia-institute-of-technology': {
    id: 'georgia-institute-of-technology',
    name: 'Georgia Institute of Technology',
    website: 'https://admission.gatech.edu/',
    deadlines: [ { type: 'Early Action', date: '2025-10-15' }, { type: 'Regular Decision', date: '2026-01-04' } ],
    requires: ['Common App', 'GaTech Questions'],
    prepChecklist: [ { key: 'gatech-supp', label: 'Complete GaTech questions' } ]
  },
  'georgia-tech': { id: 'georgia-tech', name: 'Georgia Institute of Technology', website: 'https://admission.gatech.edu/', deadlines: [ { type: 'EA', date: '2025-10-15' }, { type: 'RD', date: '2026-01-04' } ], requires: ['Common App'], prepChecklist: [ { key: 'gatech-supp', label: 'Complete GaTech questions' } ] },
  'university-of-illinois-urbana-champaign': {
    id: 'university-of-illinois-urbana-champaign',
    name: 'University of Illinois Urbana-Champaign',
    website: 'https://admissions.illinois.edu/',
    deadlines: [ { type: 'EA', date: '2025-11-01' }, { type: 'RD', date: '2026-01-05' } ],
    requires: ['Common App', 'Major Selection'],
    prepChecklist: [ { key: 'uiuc-major', label: 'Select and justify intended major' } ]
  },
  'uiuc': { id: 'uiuc', name: 'University of Illinois Urbana-Champaign', website: 'https://admissions.illinois.edu/', deadlines: [ { type: 'EA', date: '2025-11-01' }, { type: 'RD', date: '2026-01-05' } ], requires: ['Common App'], prepChecklist: [ { key: 'uiuc-major', label: 'Select and justify intended major' } ] },
  'purdue-university': {
    id: 'purdue-university',
    name: 'Purdue University',
    website: 'https://www.admissions.purdue.edu/',
    deadlines: [ { type: 'Priority', date: '2025-11-01' }, { type: 'RD', date: '2026-01-15' } ],
    requires: ['Common App', 'Purdue Questions'],
    prepChecklist: [ { key: 'purdue-supp', label: 'Draft Purdue responses' } ]
  },
  'purdue': { id: 'purdue', name: 'Purdue University', website: 'https://www.admissions.purdue.edu/', deadlines: [ { type: 'Priority', date: '2025-11-01' }, { type: 'RD', date: '2026-01-15' } ], requires: ['Common App'], prepChecklist: [ { key: 'purdue-supp', label: 'Draft Purdue responses' } ] },
  'university-of-washington': {
    id: 'university-of-washington',
    name: 'University of Washington',
    website: 'https://admit.washington.edu/',
    deadlines: [ { type: 'Application Deadline', date: '2025-11-15' } ],
    requires: ['UW Application', 'Essays'],
    prepChecklist: [ { key: 'uw-essays', label: 'Draft UW essays' } ]
  },
  'uw': { id: 'uw', name: 'University of Washington', website: 'https://admit.washington.edu/', deadlines: [ { type: 'Application Deadline', date: '2025-11-15' } ], requires: ['UW Application'], prepChecklist: [ { key: 'uw-essays', label: 'Draft UW essays' } ] },
  'university-of-wisconsin-madison': {
    id: 'university-of-wisconsin-madison',
    name: 'University of Wisconsin–Madison',
    website: 'https://admissions.wisc.edu/',
    deadlines: [ { type: 'EA', date: '2025-11-01' }, { type: 'RD', date: '2026-01-16' } ],
    requires: ['Common App', 'UW–Madison Questions'],
    prepChecklist: [ { key: 'wisc-supp', label: 'Draft Wisconsin supplement' } ]
  },
  'madison': { id: 'madison', name: 'University of Wisconsin–Madison', website: 'https://admissions.wisc.edu/', deadlines: [ { type: 'EA', date: '2025-11-01' }, { type: 'RD', date: '2026-01-16' } ], requires: ['Common App'], prepChecklist: [ { key: 'wisc-supp', label: 'Draft Wisconsin supplement' } ] },
  'northeastern-university': {
    id: 'northeastern-university',
    name: 'Northeastern University',
    website: 'https://undergraduate.northeastern.edu/',
    deadlines: [ { type: 'ED I', date: '2025-11-01' }, { type: 'ED II', date: '2026-01-01' }, { type: 'RD', date: '2026-01-01' } ],
    requires: ['Common App'],
    prepChecklist: [ { key: 'neusupp', label: 'Highlight co-op alignment' } ]
  },
  'northeastern': { id: 'northeastern', name: 'Northeastern University', website: 'https://undergraduate.northeastern.edu/', deadlines: [ { type: 'ED I', date: '2025-11-01' }, { type: 'ED II', date: '2026-01-01' }, { type: 'RD', date: '2026-01-01' } ], requires: ['Common App'], prepChecklist: [ { key: 'neusupp', label: 'Highlight co-op alignment' } ] },
  'boston-university': {
    id: 'boston-university',
    name: 'Boston University',
    website: 'https://www.bu.edu/admissions/',
    deadlines: [ { type: 'ED I', date: '2025-11-01' }, { type: 'ED II', date: '2026-01-04' }, { type: 'RD', date: '2026-01-04' } ],
    requires: ['Common App'],
    prepChecklist: [ { key: 'bu-supp', label: 'Draft BU responses' } ]
  },
  'bu': { id: 'bu', name: 'Boston University', website: 'https://www.bu.edu/admissions/', deadlines: [ { type: 'ED I', date: '2025-11-01' }, { type: 'ED II', date: '2026-01-04' }, { type: 'RD', date: '2026-01-04' } ], requires: ['Common App'], prepChecklist: [ { key: 'bu-supp', label: 'Draft BU responses' } ] },
  'university-of-florida': {
    id: 'university-of-florida',
    name: 'University of Florida',
    website: 'https://admissions.ufl.edu/',
    deadlines: [ { type: 'Priority', date: '2025-11-01' }, { type: 'Final', date: '2026-03-01' } ],
    requires: ['Common App'],
    prepChecklist: [ { key: 'uf-essays', label: 'Draft UF short essays' } ]
  },
  'uf': { id: 'uf', name: 'University of Florida', website: 'https://admissions.ufl.edu/', deadlines: [ { type: 'Priority', date: '2025-11-01' }, { type: 'Final', date: '2026-03-01' } ], requires: ['Common App'], prepChecklist: [ { key: 'uf-essays', label: 'Draft UF short essays' } ] },
  'university-of-texas-at-austin': {
    id: 'university-of-texas-at-austin',
    name: 'University of Texas at Austin',
    website: 'https://admissions.utexas.edu/',
    deadlines: [ { type: 'Priority', date: '2025-11-01' }, { type: 'Final', date: '2025-12-01' } ],
    requires: ['ApplyTexas or Common App', 'Short Answers'],
    prepChecklist: [ { key: 'utexas-answers', label: 'Draft UT short answers' } ]
  },
  'utexas': { id: 'utexas', name: 'University of Texas at Austin', website: 'https://admissions.utexas.edu/', deadlines: [ { type: 'Priority', date: '2025-11-01' }, { type: 'Final', date: '2025-12-01' } ], requires: ['ApplyTexas or Common App'], prepChecklist: [ { key: 'utexas-answers', label: 'Draft UT short answers' } ] },
  // More UCs
  'university-of-california-san-diego': {
    id: 'university-of-california-san-diego',
    name: 'University of California, San Diego',
    website: 'https://admissions.ucsd.edu/',
    deadlines: [ { type: 'Application Deadline', date: '2025-11-30' } ],
    requires: ['UC Application', 'PIQs'],
    prepChecklist: [ { key: 'piq', label: 'Draft UC Personal Insight Questions' } ]
  },
  'ucsd': { id: 'ucsd', name: 'University of California, San Diego', website: 'https://admissions.ucsd.edu/', deadlines: [ { type: 'Application Deadline', date: '2025-11-30' } ], requires: ['UC Application'], prepChecklist: [ { key: 'piq', label: 'Draft UC Personal Insight Questions' } ] },
  'university-of-california-santa-barbara': {
    id: 'university-of-california-santa-barbara',
    name: 'University of California, Santa Barbara',
    website: 'https://www.ucsb.edu/apply',
    deadlines: [ { type: 'Application Deadline', date: '2025-11-30' } ],
    requires: ['UC Application', 'PIQs'],
    prepChecklist: [ { key: 'piq', label: 'Draft UC Personal Insight Questions' } ]
  },
  'ucsb': { id: 'ucsb', name: 'University of California, Santa Barbara', website: 'https://www.ucsb.edu/apply', deadlines: [ { type: 'Application Deadline', date: '2025-11-30' } ], requires: ['UC Application'], prepChecklist: [ { key: 'piq', label: 'Draft UC Personal Insight Questions' } ] },
  'university-of-california-irvine': {
    id: 'university-of-california-irvine',
    name: 'University of California, Irvine',
    website: 'https://www.admissions.uci.edu/',
    deadlines: [ { type: 'Application Deadline', date: '2025-11-30' } ],
    requires: ['UC Application', 'PIQs'],
    prepChecklist: [ { key: 'piq', label: 'Draft UC Personal Insight Questions' } ]
  },
  'uci': { id: 'uci', name: 'University of California, Irvine', website: 'https://www.admissions.uci.edu/', deadlines: [ { type: 'Application Deadline', date: '2025-11-30' } ], requires: ['UC Application'], prepChecklist: [ { key: 'piq', label: 'Draft UC Personal Insight Questions' } ] },
  'university-of-california-davis': {
    id: 'university-of-california-davis',
    name: 'University of California, Davis',
    website: 'https://www.ucdavis.edu/admissions',
    deadlines: [ { type: 'Application Deadline', date: '2025-11-30' } ],
    requires: ['UC Application', 'PIQs'],
    prepChecklist: [ { key: 'piq', label: 'Draft UC Personal Insight Questions' } ]
  },
  'ucd': { id: 'ucd', name: 'University of California, Davis', website: 'https://www.ucdavis.edu/admissions', deadlines: [ { type: 'Application Deadline', date: '2025-11-30' } ], requires: ['UC Application'], prepChecklist: [ { key: 'piq', label: 'Draft UC Personal Insight Questions' } ] },
  // Liberal arts colleges
  'williams-college': {
    id: 'williams-college',
    name: 'Williams College',
    website: 'https://www.williams.edu/admission/',
    deadlines: [ { type: 'ED', date: '2025-11-15' }, { type: 'RD', date: '2026-01-08' } ],
    requires: ['Common App or Coalition', 'Recommendations'],
    prepChecklist: [ { key: 'williams-supp', label: 'Draft Williams supplement' } ]
  },
  'williams': { id: 'williams', name: 'Williams College', website: 'https://www.williams.edu/admission/', deadlines: [ { type: 'ED', date: '2025-11-15' }, { type: 'RD', date: '2026-01-08' } ], requires: ['Common App'], prepChecklist: [ { key: 'williams-supp', label: 'Draft Williams supplement' } ] },
  'amherst-college': {
    id: 'amherst-college',
    name: 'Amherst College',
    website: 'https://www.amherst.edu/admission',
    deadlines: [ { type: 'ED', date: '2025-11-01' }, { type: 'RD', date: '2026-01-03' } ],
    requires: ['Common App or Coalition'],
    prepChecklist: [ { key: 'amherst-supp', label: 'Draft Amherst supplement' } ]
  },
  'amherst': { id: 'amherst', name: 'Amherst College', website: 'https://www.amherst.edu/admission', deadlines: [ { type: 'ED', date: '2025-11-01' }, { type: 'RD', date: '2026-01-03' } ], requires: ['Common App'], prepChecklist: [ { key: 'amherst-supp', label: 'Draft Amherst supplement' } ] },
  'swarthmore-college': {
    id: 'swarthmore-college',
    name: 'Swarthmore College',
    website: 'https://www.swarthmore.edu/admissions-aid',
    deadlines: [ { type: 'ED I', date: '2025-11-15' }, { type: 'ED II', date: '2026-01-04' }, { type: 'RD', date: '2026-01-04' } ],
    requires: ['Common App or Coalition'],
    prepChecklist: [ { key: 'swat-supp', label: 'Draft Swarthmore supplement' } ]
  },
  'swarthmore': { id: 'swarthmore', name: 'Swarthmore College', website: 'https://www.swarthmore.edu/admissions-aid', deadlines: [ { type: 'ED I', date: '2025-11-15' }, { type: 'ED II/RD', date: '2026-01-04' } ], requires: ['Common App'], prepChecklist: [ { key: 'swat-supp', label: 'Draft Swarthmore supplement' } ] },
  'pomona-college': {
    id: 'pomona-college',
    name: 'Pomona College',
    website: 'https://www.pomona.edu/admissions/apply',
    deadlines: [ { type: 'ED I', date: '2025-11-01' }, { type: 'ED II', date: '2026-01-08' }, { type: 'RD', date: '2026-01-08' } ],
    requires: ['Common App or Coalition'],
    prepChecklist: [ { key: 'pomona-supp', label: 'Draft Pomona supplement' } ]
  },
  'pomona': { id: 'pomona', name: 'Pomona College', website: 'https://www.pomona.edu/admissions/apply', deadlines: [ { type: 'ED I', date: '2025-11-01' }, { type: 'ED II/RD', date: '2026-01-08' } ], requires: ['Common App'], prepChecklist: [ { key: 'pomona-supp', label: 'Draft Pomona supplement' } ] },
  'claremont-mckenna-college': {
    id: 'claremont-mckenna-college',
    name: 'Claremont McKenna College',
    website: 'https://www.cmc.edu/admission',
    deadlines: [ { type: 'ED I', date: '2025-11-01' }, { type: 'ED II', date: '2026-01-10' }, { type: 'RD', date: '2026-01-10' } ],
    requires: ['Common App'],
    prepChecklist: [ { key: 'cmc-supp', label: 'Draft CMC supplement' } ]
  },
  'cmc': { id: 'cmc', name: 'Claremont McKenna College', website: 'https://www.cmc.edu/admission', deadlines: [ { type: 'ED I', date: '2025-11-01' }, { type: 'ED II/RD', date: '2026-01-10' } ], requires: ['Common App'], prepChecklist: [ { key: 'cmc-supp', label: 'Draft CMC supplement' } ] },
  'harvey-mudd-college': {
    id: 'harvey-mudd-college',
    name: 'Harvey Mudd College',
    website: 'https://www.hmc.edu/admission/',
    deadlines: [ { type: 'ED I', date: '2025-11-15' }, { type: 'ED II', date: '2026-01-05' }, { type: 'RD', date: '2026-01-05' } ],
    requires: ['Common App'],
    prepChecklist: [ { key: 'hmc-supp', label: 'Draft Harvey Mudd supplement' } ]
  },
  'harvey-mudd': { id: 'harvey-mudd', name: 'Harvey Mudd College', website: 'https://www.hmc.edu/admission/', deadlines: [ { type: 'ED I', date: '2025-11-15' }, { type: 'ED II/RD', date: '2026-01-05' } ], requires: ['Common App'], prepChecklist: [ { key: 'hmc-supp', label: 'Draft Harvey Mudd supplement' } ] },
  'wellesley-college': {
    id: 'wellesley-college',
    name: 'Wellesley College',
    website: 'https://www.wellesley.edu/admission',
    deadlines: [ { type: 'ED I', date: '2025-11-01' }, { type: 'ED II', date: '2026-01-01' }, { type: 'RD', date: '2026-01-08' } ],
    requires: ['Common App'],
    prepChecklist: [ { key: 'wellesley-supp', label: 'Draft Wellesley supplement' } ]
  },
  'wellesley': { id: 'wellesley', name: 'Wellesley College', website: 'https://www.wellesley.edu/admission', deadlines: [ { type: 'ED I', date: '2025-11-01' }, { type: 'ED II', date: '2026-01-01' }, { type: 'RD', date: '2026-01-08' } ], requires: ['Common App'], prepChecklist: [ { key: 'wellesley-supp', label: 'Draft Wellesley supplement' } ] },
  'barnard-college': {
    id: 'barnard-college',
    name: 'Barnard College',
    website: 'https://barnard.edu/admissions',
    deadlines: [ { type: 'ED', date: '2025-11-01' }, { type: 'RD', date: '2026-01-01' } ],
    requires: ['Common App', 'Barnard Writing'],
    prepChecklist: [ { key: 'barnard-supp', label: 'Draft Barnard writing' } ]
  },
  'barnard': { id: 'barnard', name: 'Barnard College', website: 'https://barnard.edu/admissions', deadlines: [ { type: 'ED', date: '2025-11-01' }, { type: 'RD', date: '2026-01-01' } ], requires: ['Common App'], prepChecklist: [ { key: 'barnard-supp', label: 'Draft Barnard writing' } ] },
  'smith-college': {
    id: 'smith-college',
    name: 'Smith College',
    website: 'https://www.smith.edu/admission',
    deadlines: [ { type: 'ED I', date: '2025-11-01' }, { type: 'ED II', date: '2026-01-01' }, { type: 'RD', date: '2026-01-15' } ],
    requires: ['Common App'],
    prepChecklist: [ { key: 'smith-supp', label: 'Draft Smith responses' } ]
  },
  'vassar-college': {
    id: 'vassar-college',
    name: 'Vassar College',
    website: 'https://www.vassar.edu/admissions',
    deadlines: [ { type: 'ED I', date: '2025-11-01' }, { type: 'ED II', date: '2026-01-01' }, { type: 'RD', date: '2026-01-15' } ],
    requires: ['Common App'],
    prepChecklist: [ { key: 'vassar-supp', label: 'Draft Vassar responses' } ]
  },
  'wesleyan-university': {
    id: 'wesleyan-university',
    name: 'Wesleyan University',
    website: 'https://www.wesleyan.edu/admission',
    deadlines: [ { type: 'ED I', date: '2025-11-15' }, { type: 'ED II', date: '2026-01-01' }, { type: 'RD', date: '2026-01-15' } ],
    requires: ['Common App'],
    prepChecklist: [ { key: 'wes-supp', label: 'Draft Wesleyan responses' } ]
  }
};

function generateICS(summary: string, dateISO: string, url?: string) {
  const dt = new Date(dateISO);
  const y = dt.getUTCFullYear();
  const m = String(dt.getUTCMonth() + 1).padStart(2, '0');
  const d = String(dt.getUTCDate()).padStart(2, '0');
  const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTAMP:${y}${m}${d}T000000Z\nDTSTART;VALUE=DATE:${y}${m}${d}\nSUMMARY:${summary.replace(/\n/g, ' ')}\n${url ? `URL:${url}\n` : ''}END:VEVENT\nEND:VCALENDAR`;
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${summary.replace(/[^a-z0-9]+/gi,'-')}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function buildGoogleCalendarURL(summary: string, dateISO: string, url?: string) {
  const start = new Date(dateISO);
  const end = new Date(start);
  end.setDate(start.getDate() + 1); // all-day event ends next day
  const fmt = (d: Date) => {
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(d.getUTCDate()).padStart(2, '0');
    return `${y}${m}${dd}`;
  };
  const dates = `${fmt(start)}/${fmt(end)}`;
  const query = new URLSearchParams({
    action: 'TEMPLATE',
    text: summary,
    dates,
    details: url ? `See details: ${url}` : '',
    location: url || ''
  }).toString();
  return `https://calendar.google.com/calendar/render?${query}`;
}

const StudentDashboard: React.FC = () => {
  const { answers, prepProgress, togglePrepItem, customPrep, addCustomPrepItem, removeCustomPrepItem, setCollegeNotes, addTargetCollege } = useOnboardingStore();
  const [newItem, setNewItem] = useState<Record<string, string>>({});
  const [selectedCollegeId, setSelectedCollegeId] = useState<string | null>(null);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [cmdQuery, setCmdQuery] = useState('');

  const normalizedTargets = useMemo<CollegeRequirement[]>(() => {
    return answers.targetColleges.map((t) => {
      const key = t.name.toLowerCase().replace(/[^a-z0-9]+/g,'-');
      const base: CollegeRequirement = (MOCK_COLLEGES as any)[key] || {
        id: key,
        name: t.name,
        website: '#',
        deadlines: [],
        requires: ['Common App', 'Supplemental Essays (varies)', 'SAT/ACT optional'],
        prepChecklist: [
          { key: 'common-app', label: 'Complete Common App profile' },
          { key: 'supplement', label: 'Draft supplemental essays' },
          { key: 'teacher-recs', label: 'Confirm teacher recommendations' }
        ]
      } as CollegeRequirement;
      return base;
    });
  }, [answers.targetColleges]);

  const storyline = useMemo<string[]>(() => {
    const pieces: string[] = [];
    if (answers.intendedMajor) pieces.push(`Academic interest in ${answers.intendedMajor}`);
    if (answers.activities.length) pieces.push('Signature activity theme');
    if (answers.region) pieces.push('Global perspective');
    if (answers.gpa) pieces.push('Academic rigor and growth');
    return pieces.length ? pieces : ['We will help you shape a compelling personal narrative.'];
  }, [answers]);

  // Helpers to normalize requirement strings to canonical keys
  const canonicalizeRequirement = (req: string): string => {
    const r = req.toLowerCase();
    if (r.includes('common app')) return 'common-app';
    if (r.includes('uc application') || r.includes('piq') || r.includes('uc')) return 'uc-app';
    if (r.includes('teacher')) return 'teacher-recs';
    if (r.includes('school report') || r.includes('transcript')) return 'school-report';
    if (r.includes('supplement') || r.includes('program') || r.includes('questions')) return 'supplement';
    if (r.includes('sat') || r.includes('act') || r.includes('standardized')) return 'tests';
    return r.replace(/[^a-z0-9]+/g, '-');
  };

  // Aggregate checklist across all targets: how many remaining
  const globalChecklist = useMemo(() => {
    const items: Array<{ id: string; college: string; key: string; label: string; done: boolean }> = [];
    for (const c of normalizedTargets) {
      for (const item of (c.prepChecklist || [])) {
        const done = !!prepProgress[c.id]?.[item.key];
        items.push({ id: `${c.id}:${item.key}`, college: c.name, key: item.key, label: item.label, done });
      }
    }
    const remaining = items.filter(i => !i.done);
    return {
      total: items.length,
      remainingCount: remaining.length,
      next: remaining.slice(0, 3),
    };
  }, [normalizedTargets, prepProgress]);

  // Build a flat list of all known colleges from MOCK_COLLEGES keys (fallback)
  const allColleges = useMemo(() => {
    return Object.values(MOCK_COLLEGES) as CollegeRequirement[];
  }, []);

  const [serverRecs, setServerRecs] = useState<Array<{ id: string; name: string; website: string; ranking?: number; appPlatform: string; nextDeadline: string | null; requires: string[]; score: number; badges: string[] }> | null>(null);
  useEffect(() => {
    recommendationsAPI.getUniversities().then((res) => {
      if (res.success && res.data) setServerRecs(res.data.recommendations);
    }).catch(() => setServerRecs(null));
  }, []);

  const targetIds = useMemo(() => new Set(answers.targetColleges.map(t => t.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'))), [answers.targetColleges]);

  // Low-effort additions: recommendations with high requirement overlap and near deadlines
  const lowEffortAdds = useMemo(() => {
    const haveReqs = new Set<string>();
    for (const c of normalizedTargets) {
      for (const req of c.requires) haveReqs.add(canonicalizeRequirement(req));
    }
    const source = (serverRecs && serverRecs.length ? serverRecs.map(r => ({
      id: r.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: r.name,
      website: r.website,
      requires: r.requires,
      nextDeadline: r.nextDeadline,
    })) : allColleges.map(c => ({ id: c.id, name: c.name, website: c.website, requires: c.requires, nextDeadline: c.deadlines[0]?.date || null })));
    const now = new Date();
    const out: Array<{ id: string; name: string; website: string; overlap: number; nextDeadline: string | null } > = [];
    for (const c of source) {
      if (targetIds.has(c.id)) continue;
      const canon = new Set(c.requires.map(canonicalizeRequirement));
      let overlap = 0;
      canon.forEach((k) => { if (haveReqs.has(k)) overlap++; });
      // Near deadline within ~60 days
      const soon = c.nextDeadline ? new Date(c.nextDeadline) : null;
      const days = soon ? Math.round((+soon - +now) / (1000*60*60*24)) : null;
      const near = days !== null && days >= 0 && days <= 60;
      if (overlap >= 2 && near) out.push({ id: c.id, name: c.name, website: c.website, overlap, nextDeadline: c.nextDeadline });
    }
    // sort by highest overlap then nearest deadline
    out.sort((a,b) => (b.overlap - a.overlap) || ((a.nextDeadline||'').localeCompare(b.nextDeadline||'')));
    return out.slice(0, 4);
  }, [normalizedTargets, serverRecs, allColleges, targetIds]);

  // Heuristic fit scoring: prioritize higher-ranked, application overlap and deadline recency
  const recommended = useMemo(() => {
    if (serverRecs && serverRecs.length) {
      // Map server recs to table shape; filter out already selected targets
      const filtered = serverRecs.filter(r => !targetIds.has(r.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')));
      return filtered.map(r => ({ college: { id: r.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'), name: r.name, website: r.website, deadlines: r.nextDeadline ? [{ type: 'Next', date: r.nextDeadline }] : [], requires: r.requires }, score: r.score })).slice(0, 6);
    }
    const now = new Date();
    const parsed = allColleges
      .filter(c => !targetIds.has(c.id))
      .map(c => {
        // Mock ranking from name if available in id list ordering; lower is better
        const rankingHint = Object.keys(MOCK_COLLEGES).indexOf(c.id) + 1;
        let score = 90 - rankingHint; // crude baseline
        // Application overlap boost: Common App present
        if (c.requires.some(r => r.toLowerCase().includes('common app'))) score += 4;
        // UC if user already has UC target
        const hasUC = Array.from(targetIds).some(id => id.includes('university-of-california') || id.includes('uc-'));
        if (hasUC && c.requires.some(r => r.includes('UC'))) score += 5;
        // Deadline proximity boost (earliest upcoming deadline)
        const soonest = c.deadlines
          .map(d => new Date(d.date))
          .filter(d => !isNaN(d.getTime()) && d > now)
          .sort((a, b) => +a - +b)[0];
        if (soonest) {
          const days = Math.max(1, Math.round((+soonest - +now) / (1000 * 60 * 60 * 24)));
          score += Math.max(0, 15 - Math.min(15, Math.floor(days / 10))); // closer → slightly higher
        }
        score = Math.max(50, Math.min(96, score));
        return { college: c, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);
    return parsed;
  }, [allColleges, targetIds]);

  // Command palette quick actions
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const commandResults = useMemo(() => {
    const q = cmdQuery.trim().toLowerCase();
    const actions = [
      { label: 'Go to Essays', onClick: () => (window.location.href = '/essays') },
      { label: 'Start New Essay', onClick: () => (window.location.href = '/essays/new') },
      { label: 'Add College (Onboarding)', onClick: () => (window.location.href = '/onboarding/advisor') },
      { label: 'Research Universities', onClick: () => (window.location.href = '/universities') },
    ];
    const filteredActions = actions.filter(a => a.label.toLowerCase().includes(q));
    const uniMatches = allColleges
      .filter(c => c.name.toLowerCase().includes(q))
      .slice(0, 5)
      .map(c => ({ label: `Add target: ${c.name}`, onClick: () => addTargetCollege({ id: c.id, name: c.name, plan: 'RD' as any }) }));
    return [...filteredActions, ...uniMatches];
  }, [cmdQuery, allColleges, addTargetCollege]);

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-white">Welcome, {answers.fullName || 'Student'}</h1>
          <p className="text-text-secondary mt-2">Here’s your personalized college application dashboard.</p>
        </header>

        {/* Top Grid: Deadlines & Requirements */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-bg-card border border-white/10 rounded-2xl p-6">
            <h2 className="text-white text-xl font-semibold mb-4">Upcoming Deadlines</h2>
            <div className="space-y-3">
              {normalizedTargets.flatMap((c: CollegeRequirement) => c.deadlines.map((d: { type: string; date: string }) => (
                <div key={c.id+ d.type} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                  <div>
                    <p className="text-white font-medium">{c.name} — {d.type}</p>
                    <a href={c.website} target="_blank" rel="noreferrer" className="text-purple-400 text-sm hover:text-purple-300">Website →</a>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => generateICS(`${c.name} — ${d.type}`, d.date, c.website)}
                      className="text-xs bg-white/10 hover:bg-white/15 text-white rounded px-2 py-1"
                    >
                      Export .ics
                    </button>
                    <a
                      href={buildGoogleCalendarURL(`${c.name} — ${d.type}`, d.date, c.website)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs bg-white/10 hover:bg-white/15 text-white rounded px-2 py-1"
                    >
                      Google Calendar
                    </a>
                    <div className="text-right ml-2">
                      <p className="text-white font-semibold">{d.date}</p>
                      <p className="text-text-muted text-xs">Add to Calendar</p>
                    </div>
                  </div>
                </div>
              )))}
              {normalizedTargets.every(t => t.deadlines.length === 0) && (
                <p className="text-text-secondary">Add target colleges to see your deadlines here.</p>
              )}
            </div>
          </div>

          <div className="bg-bg-card border border-white/10 rounded-2xl p-6">
            <h2 className="text-white text-xl font-semibold mb-4">Requirements Snapshot</h2>
            <ul className="space-y-2">
              {normalizedTargets.map((c: CollegeRequirement) => (
                <li key={c.id} className="bg-white/5 rounded p-3">
                  <p className="text-white font-medium">{c.name}</p>
                  <p className="text-text-secondary text-sm">{c.requires.join(' · ')}</p>
                </li>
              ))}
              {normalizedTargets.length === 0 && (
                <p className="text-text-secondary">Add targets to see requirement details.</p>
              )}
            </ul>
          </div>
        </div>

        {/* You only have this much left */}
        <div className="bg-bg-card border border-white/10 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-white text-xl font-semibold">Your Checklist</h2>
            <span className="px-3 py-1 rounded-full bg-white/10 text-white text-sm">{globalChecklist.remainingCount} remaining</span>
          </div>
          {globalChecklist.total === 0 ? (
            <p className="text-text-secondary mt-2">Add target colleges to generate your checklist.</p>
          ) : (
            <ul className="mt-4 grid md:grid-cols-3 gap-3">
              {globalChecklist.next.map(item => (
                <li key={item.id} className="bg-white/5 rounded p-3 text-sm">
                  <p className="text-white font-medium">{item.label}</p>
                  <p className="text-text-muted text-xs mt-1">{item.college}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Colleges & Prep with custom items and notes */}
        <div className="bg-bg-card border border-white/10 rounded-2xl p-6 mb-8">
          <h2 className="text-white text-xl font-semibold mb-4">Colleges & Prep</h2>
          <div className="space-y-6">
            {normalizedTargets.map((c: CollegeRequirement) => {
              const custom = customPrep[c.id] || { customItems: [], notes: '' };
              return (
                <div key={c.id} className="border border-white/10 rounded-lg p-4 bg-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-white font-semibold">{c.name}</p>
                      <a href={c.website} target="_blank" rel="noreferrer" className="text-purple-400 text-xs hover:text-purple-300">Open admissions site →</a>
                    </div>
                    <div className="text-right text-text-muted text-xs">
                      {c.deadlines[0] ? `${c.deadlines[0].type}: ${c.deadlines[0].date}` : 'No deadline set'}
                    </div>
                  </div>

                  <ul className="mt-2 space-y-2">
                    {(c.prepChecklist || []).map((item: { key: string; label: string }) => (
                      <li key={item.key} className="flex items-center gap-3 text-sm text-white/90">
                        <input type="checkbox" className="accent-purple-500" checked={!!prepProgress[c.id]?.[item.key]} onChange={() => togglePrepItem(c.id, item.key)} />
                        <span>{item.label}</span>
                      </li>
                    ))}
                    {custom.customItems.map((item: { key: string; label: string }) => (
                      <li key={item.key} className="flex items-center gap-3 text-sm text-white/90">
                        <input type="checkbox" className="accent-purple-500" checked={!!prepProgress[c.id]?.[item.key]} onChange={() => togglePrepItem(c.id, item.key)} />
                        <span>{item.label}</span>
                        <button className="ml-auto text-xs text-red-400 hover:text-red-300" onClick={() => removeCustomPrepItem(c.id, item.key)}>Remove</button>
                      </li>
                    ))}
                  </ul>

                  {/* Add custom item */}
                  <div className="mt-3 flex gap-2">
                    <input
                      className="flex-1 bg-white/5 border border-white/10 rounded p-2 text-sm text-white placeholder-white/40"
                      placeholder="Add custom prep item (e.g., Upload portfolio)"
                      value={newItem[c.id] || ''}
                      onChange={(e) => setNewItem({ ...newItem, [c.id]: e.target.value })}
                    />
                    <button
                      className="text-xs bg-white/10 hover:bg-white/15 text-white rounded px-3"
                      onClick={() => { const label = (newItem[c.id] || '').trim(); if (label) { addCustomPrepItem(c.id, label); setNewItem({ ...newItem, [c.id]: '' }); } }}
                    >
                      Add
                    </button>
                  </div>

                  {/* Notes */}
                  <div className="mt-3">
                    <textarea
                      className="w-full bg-white/5 border border-white/10 rounded p-2 text-sm text-white placeholder-white/40"
                      rows={3}
                      placeholder="Notes specific to this college (interview tips, program fit, contacts, etc.)"
                      value={custom.notes}
                      onChange={(e) => setCollegeNotes(c.id, e.target.value)}
                    />
                  </div>
                </div>
              );
            })}
            {normalizedTargets.length === 0 && (
              <p className="text-text-secondary">No target colleges yet—add them in onboarding to see prep lists here.</p>
            )}
          </div>
        </div>

        {/* Storyline Suggestions */}
        <div className="bg-bg-card border border-white/10 rounded-2xl p-6 mb-8">
          <h2 className="text-white text-xl font-semibold mb-4">Suggested Storyline Framework</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {storyline.map((s, i) => (
              <div key={i} className="bg-white/5 rounded-lg p-4">
                <p className="text-white font-medium">{s}</p>
                <p className="text-text-secondary text-sm mt-1">We’ll help you translate this into compelling essay topics and activities alignment.</p>
              </div>
            ))}
          </div>
        </div>

        {/* Essays Overview (one graph + 3 CTAs) */}
        <div className="bg-bg-card border border-white/10 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-xl font-semibold">Essays</h2>
            <Link to="/essays" className="text-sm text-indigo-400 hover:text-indigo-300">View all →</Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Graph */}
            <div className="md:col-span-2 bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-text-secondary text-sm mb-2">Drafts over last 8 weeks</p>
              <div className="h-28 relative">
                <svg viewBox="0 0 240 80" className="absolute inset-0 w-full h-full opacity-90">
                  <defs>
                    <linearGradient id="essayGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(99,102,241,0.35)" />
                      <stop offset="100%" stopColor="rgba(99,102,241,0.05)" />
                    </linearGradient>
                  </defs>
                  <path d="M0,60 C30,58 50,52 80,45 C110,38 140,40 170,30 C200,22 220,18 240,16" stroke="rgba(129,140,248,0.9)" strokeWidth="2" fill="none" />
                  <path d="M0,68 C30,65 50,59 80,50 C110,43 140,45 170,35 C200,27 220,23 240,21 L240,80 L0,80 Z" fill="url(#essayGrad)" />
                </svg>
              </div>
              <div className="flex items-center gap-3 mt-2 text-xs text-text-muted">
                <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-400"></span> drafts</span>
                <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-white/30"></span> trend</span>
              </div>
            </div>
            {/* CTAs */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10 flex flex-col gap-3">
              <button onClick={() => (window.location.href = '/essays/new')} className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm">Start writing</button>
              <button onClick={() => (window.location.href = '/essays')} className="w-full px-4 py-2 bg-white/10 hover:bg-white/15 text-white rounded-lg text-sm">See my 3 essays</button>
              <button onClick={() => (window.location.href = '/essays/new')} className="w-full px-4 py-2 bg-white/10 hover:bg-white/15 text-white rounded-lg text-sm">Paste existing</button>
              <p className="text-text-muted text-xs">Create a new draft or open your list to manage three key essays.</p>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-bg-card border border-white/10 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-xl font-semibold">Recommended Universities</h2>
            <p className="text-text-muted text-xs">Cmd/Ctrl + K to quick add</p>
          </div>
          {recommended.length === 0 ? (
            <p className="text-text-secondary">Add a few targets and details to see recommendations.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-text-muted">
                    <th className="text-left font-medium pb-2">School</th>
                    <th className="text-left font-medium pb-2">Fit</th>
                    <th className="text-left font-medium pb-2">App</th>
                    <th className="text-left font-medium pb-2">Next Deadline</th>
                    <th className="text-right font-medium pb-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {recommended.map(({ college, score }) => {
                    const app = college.requires.find(r => r.includes('UC')) ? 'UC' : (college.requires.find(r => r.toLowerCase().includes('common app')) ? 'Common App' : 'Other');
                    const soonest = college.deadlines[0]?.date || '—';
                    return (
                      <tr key={college.id} className="hover:bg-white/5">
                        <td className="py-3">
                          <button className="text-white hover:underline" onClick={() => setSelectedCollegeId(college.id)}>{college.name}</button>
                        </td>
                        <td className="py-3">
                          <span className="px-2 py-1 rounded-full bg-white/10 text-white/90">{Math.round(score)} / 100</span>
                        </td>
                        <td className="py-3 text-text-secondary">{app}</td>
                        <td className="py-3 text-text-secondary">{soonest}</td>
                        <td className="py-3 text-right">
                          <Button size="sm" variant="outline" onClick={() => addTargetCollege({ id: college.id, name: college.name, plan: 'RD' as any })} className="mr-2">Add to Targets</Button>
                          <Button size="sm" variant="outline" href={college.website}>Research</Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Low-effort add-ons */}
        {lowEffortAdds.length > 0 && (
          <div className="bg-bg-card border border-white/10 rounded-2xl p-6 mb-8">
            <h2 className="text-white text-xl font-semibold mb-2">Low-effort add-ons</h2>
            <p className="text-text-secondary text-sm mb-4">Same application process as your current targets—consider applying.</p>
            <div className="grid md:grid-cols-2 gap-3">
              {lowEffortAdds.map(c => (
                <div key={c.id} className="bg-white/5 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">{c.name}</p>
                    <p className="text-text-muted text-xs">Overlap: {c.overlap} · Next: {c.nextDeadline || '—'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" href={c.website}>Research</Button>
                    <Button size="sm" variant="primary" onClick={() => addTargetCollege({ id: c.id, name: c.name, plan: 'RD' as any })}>Add</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Inspector Drawer */}
        {selectedCollegeId && (() => {
          const c = (MOCK_COLLEGES as any)[selectedCollegeId] as CollegeRequirement | undefined;
          if (!c) return null;
          return (
            <div className="fixed inset-0 z-40 flex" onClick={() => setSelectedCollegeId(null)}>
              <div className="flex-1 bg-black/50" />
              <div className="w-full max-w-lg h-full bg-[#0d0d10] border-l border-white/10 p-6 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white text-lg font-semibold">{c.name}</h3>
                  <button className="text-text-secondary hover:text-white" onClick={() => setSelectedCollegeId(null)}>Close</button>
                </div>
                <a href={c.website} target="_blank" rel="noreferrer" className="text-purple-400 text-sm hover:text-purple-300">Admissions website →</a>
                <div className="mt-4">
                  <p className="text-white font-medium mb-2">Why this match</p>
                  <ul className="list-disc list-inside text-text-secondary text-sm space-y-1">
                    <li>Application platform: {c.requires.find(r => r.includes('UC')) ? 'UC' : (c.requires.find(r => r.toLowerCase().includes('common app')) ? 'Common App' : 'Other')}</li>
                    <li>Deadline cadence aligned with your targets</li>
                    <li>Opportunities to reuse essay themes</li>
                  </ul>
                </div>
                <div className="mt-4">
                  <p className="text-white font-medium mb-2">Upcoming deadlines</p>
                  <ul className="text-text-secondary text-sm space-y-1">
                    {c.deadlines.map(d => (<li key={d.type}>{d.type}: {d.date}</li>))}
                    {c.deadlines.length === 0 && <li>—</li>}
                  </ul>
                </div>
                <div className="mt-4">
                  <p className="text-white font-medium mb-2">Requirements</p>
                  <p className="text-text-secondary text-sm">{c.requires.join(' · ')}</p>
                </div>
                <div className="mt-6 flex gap-2">
                  <Button variant="primary" onClick={() => { addTargetCollege({ id: c.id, name: c.name, plan: 'RD' as any }); setSelectedCollegeId(null); }}>Add to Targets</Button>
                  <Button variant="outline" href={c.website}>Open Website</Button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Command Palette */}
        {cmdOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/60" onClick={() => setCmdOpen(false)}>
            <div className="w-full max-w-2xl bg-[#0d0d10] border border-white/10 rounded-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="p-3 border-b border-white/10">
                <input
                  autoFocus
                  className="w-full bg-[#0b0b0e] border border-white/10 rounded-lg p-3.5 text-white placeholder-white/40 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30"
                  placeholder="Search actions or universities…"
                  value={cmdQuery}
                  onChange={(e) => setCmdQuery(e.target.value)}
                />
              </div>
              <ul className="max-h-80 overflow-y-auto p-2">
                {commandResults.length === 0 ? (
                  <li className="text-text-secondary text-sm p-3">No results</li>
                ) : (
                  commandResults.map((item, idx) => (
                    <li key={idx}>
                      <button className="w-full text-left px-3 py-2 hover:bg-white/5 text-white text-sm rounded" onClick={() => { item.onClick(); setCmdOpen(false); }}>
                        {item.label}
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Link to="/essays/new" className="bg-purple-500 hover:bg-purple-600 text-white rounded-xl p-5 text-left">
            <p className="text-lg font-semibold">Start Essay Builder</p>
            <p className="text-white/80 text-sm mt-1">Convert your storyline into polished drafts.</p>
          </Link>
          <Link to="/onboarding/advisor" className="bg-white/10 hover:bg-white/15 text-white rounded-xl p-5 text-left">
            <p className="text-lg font-semibold">Add College</p>
            <p className="text-text-secondary text-sm mt-1">Add a new target and see deadlines instantly.</p>
          </Link>
          <Link to="/resources" className="bg-white/10 hover:bg-white/15 text-white rounded-xl p-5 text-left">
            <p className="text-lg font-semibold">Upload Transcript</p>
            <p className="text-text-secondary text-sm mt-1">We’ll analyze your rigor and recommend fits.</p>
          </Link>
        </div>
      </div>
      <ChatDock />
    </div>
  );
};

export default StudentDashboard;