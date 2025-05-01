import { Plugin } from 'vite';

/**
 * Simplified SEO plugin without sitemap functionality
 * Sitemap generation was removed due to compatibility issues
 * @returns Vite plugin
 */
export function seoPlugin(): Plugin {
    return {
        name: 'vite-plugin-seo',
        configureServer(server) {
            server.middlewares.use((req, res, next) => {
                if (req.url === '/robots.txt') {
                    res.setHeader('Content-Type', 'text/plain');
                    const robotsTxt = `# robots.txt for MiniMax Games
User-agent: *
Allow: /`;
                    res.statusCode = 200;
                    res.end(robotsTxt);
                } else {
                    next();
                }
            });
        },
    };
}
