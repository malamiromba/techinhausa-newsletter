const { fetchSubstackJson, SUBSTACK_HOST } = require('./_substack');

/**
 * Vercel Serverless Route: GET /api/post?slug=<post-slug>
 * Fetches the full HTML body for any post (including older back-dated archive posts).
 */
module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=1200');

  try {
    const reqUrl = new URL(req.url, 'http://localhost');
    const slug = (reqUrl.searchParams.get('slug') || '').trim();

    if (!slug || !/^[a-zA-Z0-9-_]+$/.test(slug)) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ error: 'Valid post slug is required' }));
    }

    const post = await fetchSubstackJson(`/api/v1/posts/${encodeURIComponent(slug)}`);
    const byline = Array.isArray(post.publishedBylines) && post.publishedBylines[0];

    res.statusCode = 200;
    return res.end(JSON.stringify({
      id: post.id,
      slug: post.slug || slug,
      title: post.title,
      subtitle: post.subtitle || '',
      post_date: post.post_date,
      body_html: post.body_html || '',
      author: (byline && byline.name) || 'Ibrahim Malamiromba',
      canonical_url: post.canonical_url || `https://${SUBSTACK_HOST}/p/${slug}`
    }));
  } catch (err) {
    res.statusCode = 502;
    return res.end(JSON.stringify({ error: 'Failed to load full Substack post', details: err.message }));
  }
};
