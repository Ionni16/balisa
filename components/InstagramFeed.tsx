"use client";

import { useEffect, useMemo, useState } from 'react';
import { Instagram } from 'lucide-react';
import SmartImage from '@/components/SmartImage';

type ManualPost = {
  image?: string;
  url?: string;
};

type LivePost = {
  id?: string;
  image?: string;
  url?: string;
  caption?: string;
  type?: string;
};

export default function InstagramFeed({
  handle,
  instagramUrl,
  mode,
  manualPosts,
}: {
  handle: string;
  instagramUrl: string;
  mode: string;
  manualPosts: ManualPost[];
}) {
  const cleanManualPosts = useMemo(
    () => manualPosts.filter((post) => Boolean(post.image)),
    [manualPosts]
  );

  const [livePosts, setLivePosts] = useState<LivePost[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (mode !== 'latest') {
      setLoaded(true);
      return;
    }

    let active = true;

    fetch(`/api/instagram?t=${Date.now()}`, { cache: 'no-store' })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!active) return;
        setLivePosts(Array.isArray(data?.posts) ? data.posts : []);
        setLoaded(true);
      })
      .catch(() => {
        if (!active) return;
        setLivePosts([]);
        setLoaded(true);
      });

    return () => {
      active = false;
    };
  }, [mode]);

  const posts = mode === 'latest' && livePosts.length ? livePosts : cleanManualPosts;

  if (!posts.length && loaded) return null;

  return (
    <section className="instagram-section" aria-labelledby="instagram-title">
      <p className="instagram-kicker">Follow us</p>
      <a
        id="instagram-title"
        href={instagramUrl}
        target="_blank"
        rel="noreferrer"
        className="social-handle"
      >
        {handle}
      </a>

      <div className="instagram-feed-wrap">
        <div className="instagram-feed">
          {(posts.length ? posts : cleanManualPosts).slice(0, 3).map((post, index) => (
            <a
              href={post.url || instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="instagram-post"
              key={`${post.image}-${index}`}
              aria-label={`Open ${handle} Instagram post ${index + 1}`}
            >
              <SmartImage src={post.image} alt={`${handle} Instagram post ${index + 1}`} />
              <span className="instagram-post-badge">
                View post
                <Instagram size={16} strokeWidth={1.8} aria-hidden="true" />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
