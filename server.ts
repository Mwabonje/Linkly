import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock Database / State
  let links = [
    { id: '1', title: 'Portfolio Website', url: 'https://alexthompson.design', clicks: 8400, active: true },
    { id: '2', title: 'Twitter Profile', url: 'https://twitter.com/alex_design', clicks: 2100, active: true },
    { id: '3', title: 'YouTube Channel', url: 'https://youtube.com/c/AlexThompson', clicks: 0, active: false }
  ];

  let analytics = {
    totalViews: 24800,
    viewsGrowth: 12, // percentage
    totalClicks: 12100,
    clicksGrowth: 8.2,
    avgCtr: 4.2
  };

  // --- API ROUTES ---
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.get('/api/user', (req, res) => {
    // Simulated authenticated user
    res.json({
      id: 'usr_1',
      username: 'alex',
      fullName: 'Alex Thompson',
      role: 'UX Designer & Tech Content Creator',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop',
    });
  });

  app.get('/api/analytics', (req, res) => {
    res.json(analytics);
  });

  app.get('/api/links', (req, res) => {
    res.json(links);
  });

  app.post('/api/links', (req, res) => {
    const newLink = { ...req.body, id: Date.now().toString(), clicks: 0, active: true };
    links.push(newLink);
    res.json(newLink);
  });

  app.put('/api/links/:id', (req, res) => {
    const index = links.findIndex(l => l.id === req.params.id);
    if (index !== -1) {
      links[index] = { ...links[index], ...req.body };
      res.json(links[index]);
    } else {
      res.status(404).json({ error: 'Not found' });
    }
  });

  app.delete('/api/links/:id', (req, res) => {
    links = links.filter(l => l.id !== req.params.id);
    res.json({ success: true });
  });

  // Re-order links endpoint
  app.post('/api/links/reorder', (req, res) => {
    const { reorderedLinks } = req.body;
    if (Array.isArray(reorderedLinks)) {
      links = reorderedLinks;
      res.json({ success: true });
    } else {
      res.status(400).json({ error: 'Invalid input' });
    }
  });

  // --- VITE MIDDLEWARE ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Support Express v4 pattern for fallback SPA routing
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
