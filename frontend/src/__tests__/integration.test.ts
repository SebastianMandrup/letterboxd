import dotenv from 'dotenv';
dotenv.config();

import { describe, expect, it } from 'vitest';
import axios from 'axios';

describe('Full Workflow runs', () => {
    it('returns 200 from /', async () => {
        const response = await axios.get('http://nginx-proxy/api/');
        expect(response.status).toBe(200);
    });
});
