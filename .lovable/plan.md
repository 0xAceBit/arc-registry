

## Plan: Trigger a Fresh Deployment

**Problem**: The "Update" button is grayed out because the system doesn't detect any new changes to deploy.

**Solution**: Make a minor, harmless code change (like adding a comment or updating a timestamp) to trigger the build system to recognize a new version, then you can click "Update" to publish.

### Steps
1. Add a small comment to `src/App.tsx` (e.g., `// force rebuild`) — this is invisible to users but triggers a new build
2. After the change, click **Publish → Update** to deploy the latest version with the correct environment variables baked in

This will resolve the blank page issue on the published site by ensuring the build includes the proper configuration.

