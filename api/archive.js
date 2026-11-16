const { fetchSubstackJson, SUBSTACK_HOST } = require('./_substack');

/**
 * Vercel Serverless Route: GET /api/archive?offset=0&limit=8
 * Fetches paginated Substack posts (newest through all historical back-dated issues).
 */
module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

  try {
    const reqUrl = new URL(req.url, 'http://localhost');
    const offset = Math.max(0, parseInt(reqUrl.searchParams.get('offset') || '0', 10) || 0);
    const limit = Math.min(24, Math.max(1, parseInt(reqUrl.searchParams.get('limit') || '8', 10) || 8));
    const fetchLimit = Math.min(50, Math.max(12, offset + limit));

    const rawData = await fetchSubstackJson(`/api/v1/archive?sort=new&limit=${fetchLimit}`);
    const rawList = Array.isArray(rawData)
      ? rawData
      : (rawData && Array.isArray(rawData.posts) ? rawData.posts : null);

    if (!rawList) {
      res.statusCode = 502;
      return res.end(JSON.stringify({ error: 'Unexpected response format from Substack archive' }));
    }

    const sliced = rawList.slice(offset, offset + limit);

    const posts = sliced.map((item) => {
      const byline = Array.isArray(item.publishedBylines) && item.publishedBylines[0];
      const tags = [
        ...(Array.isArray(item.postTags)
          ? item.postTags.map((t) => (typeof t === 'string' ? t : t.name || t.slug))
          : []),
        item.section_name,
        item.section_slug
      ].filter(Boolean);

      const excerptSource = item.truncated_body_text || item.subtitle || '';
      return {
        id: item.id,
        slug: item.slug,
        title: item.title,
        subtitle: item.subtitle || '',
        excerpt: excerptSource,
        post_date: item.post_date,
        wordcount: item.wordcount || 0,
        author: (byline && byline.name) || 'Ibrahim Malamiromba',
        tags,
        canonical_url: item.canonical_url || `https://${SUBSTACK_HOST}/p/${item.slug}`
      };
    });

    res.statusCode = 200;
    return res.end(JSON.stringify({
      posts,
      hasMore: Boolean((rawData && rawData.nextCursor) || rawList.length > offset + sliced.length),
      nextOffset: offset + sliced.length
    }));
  } catch (err) {
    res.statusCode = 502;
    return res.end(JSON.stringify({ error: 'Failed to load Substack archive', details: err.message }));
  }
};
