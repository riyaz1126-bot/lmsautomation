import 'dotenv/config';
import { getRequiredEnv } from '../utils/environment';

const baseURL = getRequiredEnv('LMS_BASE_URL');
const parsedBaseURL = new URL(baseURL);

if (parsedBaseURL.protocol !== 'http:' && parsedBaseURL.protocol !== 'https:') {
  throw new Error('LMS_BASE_URL must use HTTP or HTTPS.');
}

export const environment = {
  baseURL: parsedBaseURL.toString(),
} as const;