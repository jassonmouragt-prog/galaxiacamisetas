import {defineConfig,devices} from '@playwright/test';
import nextEnv from '@next/env';
nextEnv.loadEnvConfig(process.cwd());
export default defineConfig({testDir:'./tests/e2e',fullyParallel:false,workers:1,retries:0,reporter:'list',use:{baseURL:process.env.APP_URL||'http://localhost:3000',trace:'retain-on-failure'},projects:[{name:'chromium',use:{...devices['Desktop Chrome']}}],webServer:{command:'npm run dev',url:process.env.APP_URL||'http://localhost:3000',reuseExistingServer:!process.env.CI,timeout:120000}});
