const { fetchSubstackJson, SUBSTACK_HOST } = require('./_substack');

/**
 * Vercel Serverless Route: GET /api/archive?limit=25&cursor=<cursor>&offset=0
 * Fetches Substack archive posts (newest through all historical back-dated issues).
 * Substack API maximum limit is 25 posts per request and paginates via cursor.
 */
module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

  try {
    const reqUrl = new URL(req.url, 'http://localhost');
    const cursor = (reqUrl.searchParams.get('cursor') || '').trim();
    const offset = Math.max(0, parseInt(reqUrl.searchParams.get('offset') || '0', 10) || 0);
    const limit = Math.min(25, Math.max(1, parseInt(reqUrl.searchParams.get('limit') || '25', 10) || 25));

    let substackPath = `/api/v1/archive?sort=new&limit=${limit}`;
    if (cursor) {
      substackPath += `&cursor=${encodeURIComponent(cursor)}`;
    }

    const rawData = await fetchSubstackJson(substackPath);
    const rawList = Array.isArray(rawData)
      ? rawData
      : (rawData && Array.isArray(rawData.posts) ? rawData.posts : null);

    if (!rawList) {
      res.statusCode = 502;
      return res.end(JSON.stringify({ error: 'Unexpected response format from Substack archive' }));
    }

    // If offset is requested without cursor, slice locally; if cursor is used, take rawList directly
    const sliced = cursor ? rawList.slice(0, limit) : (offset > 0 ? rawList.slice(offset, offset + limit) : rawList);

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

    const nextCursor = (rawData && rawData.nextCursor) || null;
    const hasMore = Boolean(nextCursor || (!cursor && rawList.length > offset + sliced.length));

    res.statusCode = 200;
    return res.end(JSON.stringify({
      posts,
      nextCursor,
      hasMore,
      nextOffset: offset + sliced.length
    }));
  } catch (err) {
    res.statusCode = 502;
    return res.end(JSON.stringify({ error: 'Failed to load Substack archive', details: err.message }));
  }
};
