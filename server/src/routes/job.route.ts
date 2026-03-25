import { Router } from 'express';

import { validateSchema } from '../middleware/validateRequest.middleware.js';
import auth from '../middleware/auth.middleware.js';

import {
  createJobSchema,
  deleteJobSchema,
  getSearchJobSchema,
  updateJobStatusSchema,
} from '../schemas/job.js';

import { jobController } from '../di/job.container.js';

const router = Router();

router.post('/create', auth, validateSchema(createJobSchema), jobController.createJob);
router.delete('/:_id', auth, validateSchema(deleteJobSchema), jobController.deleteJob);
router.patch(
  '/update-status',
  auth,
  validateSchema(updateJobStatusSchema),
  jobController.updateJobStatus,
);
router.get('/feed', auth, jobController.getJobFeed);
router.get('/search', auth, validateSchema(getSearchJobSchema), jobController.searchJobs);
router.get('/:_id', auth, jobController.findJobById);
router.get('/:organizationId/jobs', auth, jobController.findAllJobsOfOrganization);

export default router;
