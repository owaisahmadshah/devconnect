import { JobRepository } from '../repositories/job.repository.js';
import { JobService } from '../services/job.service.js';
import { JobController } from '../controllers/job.controller.js';
import { JobMapper } from '../mapper/job.mapper.js';

const jobRepository = new JobRepository();
const jobMapper = new JobMapper();
const jobService = new JobService({ repo: jobRepository, mapper: jobMapper });
const jobController = new JobController(jobService);

export { jobRepository, jobMapper, jobService, jobController };
