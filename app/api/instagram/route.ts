import { NextResponse } from 'next/server';
import { getSiteSettings } from '@/lib/settings';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type InstagramMedia = {
  id: string;
  caption?: string;
  media_url?: string;
  thumbnail_url?: string;
  media_type?: string;
  permalink?: string;
};

export async function GET() {
  const settings = await getSiteSettings();
  const token =
    process.env.INSTAGRAM_ACCESS_TOKEN ||
    settings.instagram_access_token ||
    '';

  if (!token) {
    return NextResponse.json(
      { posts: [], mode: 'manual', error: 'Instagram access token missing' },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  }

  try {
    const endpoint =
      'https://graph.instagram.com/me/media' +
      '?fields=id,caption,media_url,thumbnail_url,media_type,permalink,timestamp' +
      '&limit=8' +
      `&access_token=${encodeURIComponent(token)}`;

    const response = await fetch(endpoint, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { posts: [], mode: 'manual', error: `Instagram API error ${response.status}` },
        { headers: { 'Cache-Control': 'no-store, max-age=0' } }
      );
    }

    const json = await response.json();
    const posts = ((json.data || []) as InstagramMedia[])
      .filter((post) => post.media_url || post.thumbnail_url)
      .slice(0, 4)
      .map((post) => ({
        id: post.id,
        image:
          post.media_type === 'VIDEO'
            ? post.thumbnail_url || post.media_url
            : post.media_url || post.thumbnail_url,
        url: post.permalink,
        caption: post.caption || '',
        type: post.media_type || 'IMAGE',
      }));

    return NextResponse.json(
      { posts, mode: 'latest' },
      { headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=600' } }
    );
  } catch (error) {
    return NextResponse.json(
      { posts: [], mode: 'manual', error: 'Unable to load Instagram feed' },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  }
}
