import express from 'express';
import axios from 'axios';
import { authenticateToken } from '../middleware/auth';
import { logger } from '../utils/logger';

const router = express.Router();

/**
 * POST /api/stats/college-scorecard
 * body: { universityName: string }
 * Returns a subset of College Scorecard stats with a canonical source URL
 */
router.post('/college-scorecard', authenticateToken, async (req, res) => {
  try {
    const { universityName } = (req.body || {}) as { universityName?: string };
    if (!universityName) {
      return res.status(400).json({ success: false, error: 'universityName is required' });
    }

    const API_KEY = process.env['COLLEGE_SCORECARD_API_KEY'];
    if (!API_KEY) {
      return res.status(501).json({ success: false, error: 'COLLEGE_SCORECARD_API_KEY not configured' });
    }

    const params = new URLSearchParams({
      api_key: API_KEY,
      'school.name': universityName,
      per_page: '1',
      page: '0',
      fields: [
        'id',
        'school.name',
        'school.school_url',
        'latest.admissions.admission_rate.overall',
        'latest.cost.tuition.in_state',
        'latest.cost.tuition.out_of_state',
        'latest.student.size',
        'latest.earnings.10_yrs_after_entry.median'
      ].join(',')
    });

    const url = `https://api.data.gov/ed/collegescorecard/v1/schools?${params.toString()}`;
    const resp = await axios.get(url, { timeout: 12000 });
    const item = Array.isArray(resp.data?.results) && resp.data.results.length > 0 ? resp.data.results[0] : null;
    if (!item) {
      return res.json({ success: true, data: { universityName, stats: null } });
    }

    const stats = {
      name: item['school.name'] as string,
      admissionRate: item['latest.admissions.admission_rate.overall'] as number | null,
      tuitionInState: item['latest.cost.tuition.in_state'] as number | null,
      tuitionOutState: item['latest.cost.tuition.out_of_state'] as number | null,
      studentSize: item['latest.student.size'] as number | null,
      earnings10yrMedian: item['latest.earnings.10_yrs_after_entry.median'] as number | null,
      schoolUrl: item['school.school_url'] as string | null,
      scorecardUrl: `https://collegescorecard.ed.gov/school/?${item.id}`
    };

    return res.json({ success: true, data: stats });
  } catch (error) {
    logger.error('College Scorecard fetch failed', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch College Scorecard stats' });
  }
});

export default router;

