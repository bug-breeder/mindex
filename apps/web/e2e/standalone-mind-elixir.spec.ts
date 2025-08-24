import { test } from '@playwright/test';

test('Test standalone Mind-Elixir', async ({ page }) => {
  // Capture console logs
  const logs = [];
  page.on('console', msg => {
    logs.push(`[${msg.type()}] ${msg.text()}`);
  });
  
  // Capture any errors
  page.on('pageerror', error => {
    logs.push(`[ERROR] ${error.message}`);
  });
  
  await page.goto('/src/test-mind-elixir.html');
  
  // Wait for initialization
  await page.waitForTimeout(3000);
  
  // Take screenshot
  await page.screenshot({ path: 'standalone-mind-elixir.png', fullPage: true });
  
  // Get container content
  const containerInfo = await page.evaluate(() => {
    const container = document.getElementById('map');
    return {
      exists: !!container,
      innerHTML: container ? container.innerHTML : 'No container',
      childrenCount: container ? container.children.length : 0,
      hasNodes: container ? container.querySelector('me-nodes') !== null : false,
      hasCanvas: container ? container.querySelector('canvas') !== null : false,
      hasSvg: container ? container.querySelector('svg') !== null : false,
    };
  });
  
  console.log('Standalone Mind-Elixir container info:', JSON.stringify(containerInfo, null, 2));
  console.log('All logs:', logs);
});