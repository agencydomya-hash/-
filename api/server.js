// This file is the Vercel serverless function entrypoint using ES modules import.
// It imports the pre-bundled Express app from the build output.
import app from '../dist/server.cjs';
export default app;
