import { test, expect } from '@playwright/test';

test.describe('Mind-Elixir Integration', () => {
  test('should load and render mind map editor', async ({ page }) => {
    // Go to a new map
    const mapId = '123e4567-e89b-12d3-a456-426614174000';
    await page.goto(`/maps/${mapId}`);
    
    // Wait for the page to load
    await expect(page.locator('h1')).toContainText('Mind Map Editor');
    
    // Check if Mind-Elixir container is present
    await expect(page.locator('[style*="min-height: 400px"]')).toBeVisible();
    
    // Wait a bit for Mind-Elixir to initialize
    await page.waitForTimeout(2000);
    
    // Check console for Mind-Elixir logs
    const logs = [];
    page.on('console', msg => logs.push(msg.text()));
    
    // Take a screenshot to see what's rendered
    await page.screenshot({ path: 'mind-elixir-debug.png', fullPage: true });
    
    // Check for Mind-Elixir DOM elements
    const mindElixirElements = await page.locator('.mind-elixir').count();
    console.log('Mind-Elixir elements found:', mindElixirElements);
    
    // Check for SVG elements (Mind-Elixir renders as SVG)
    const svgElements = await page.locator('svg').count();
    console.log('SVG elements found:', svgElements);
    
    // Look for specific Mind-Elixir classes
    const nodeElements = await page.locator('.node').count();
    console.log('Node elements found:', nodeElements);
    
    // Try to find any canvas or drawing elements
    const allElements = await page.locator('*').count();
    console.log('Total elements on page:', allElements);
    
    // Log all console messages
    console.log('Console logs:', logs);
    
    // Check if there are any errors in the console
    const errors = logs.filter(log => log.includes('Error') || log.includes('error'));
    if (errors.length > 0) {
      console.log('Errors found:', errors);
    }
    
    // Try to inspect the Mind-Elixir container content
    const containerContent = await page.locator('[style*="min-height: 400px"]').innerHTML();
    console.log('Container content:', containerContent);
    
    // Check if Mind-Elixir actually created any visible elements
    expect(mindElixirElements + svgElements + nodeElements).toBeGreaterThan(0);
  });
  
  test('should debug Mind-Elixir initialization', async ({ page }) => {
    const mapId = '123e4567-e89b-12d3-a456-426614174000';
    
    // Listen for console logs before navigation
    const logs = [];
    page.on('console', msg => {
      logs.push(`[${msg.type()}] ${msg.text()}`);
    });
    
    await page.goto(`/maps/${mapId}`);
    
    // Wait for initialization
    await page.waitForTimeout(3000);
    
    // Evaluate Mind-Elixir in the browser context
    const mindElixirInfo = await page.evaluate(() => {
      const container = document.querySelector('[style*="min-height: 400px"]');
      return {
        containerExists: !!container,
        containerChildren: container ? container.children.length : 0,
        containerHTML: container ? container.innerHTML.substring(0, 500) : 'No container',
        windowMindElixir: typeof window.MindElixir !== 'undefined',
        globalThis: Object.keys(globalThis).filter(k => k.toLowerCase().includes('mind')),
      };
    });
    
    console.log('Mind-Elixir debug info:', JSON.stringify(mindElixirInfo, null, 2));
    console.log('All console logs:', logs);
  });
});