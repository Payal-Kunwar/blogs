"use client";
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useRef, useCallback, useState } from 'react';
import BlogPost from './BlogPost';
import React from 'react';
import { InputText } from 'primereact/inputtext';

const PAGE_SIZE = 10;

async function fetchPosts({ pageParam = 1 }) {
  const token = localStorage.getItem('token');
  const res = await fetch(`/posts?page=${pageParam}&limit=${PAGE_SIZE}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  if (!res.ok) throw new Error('Error fetching posts');
  return res.json();
}

export default function Blogs() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < PAGE_SIZE) return undefined;
      return allPages.length + 1;
    },
  });

  const [searchVal, setSearchVal] = useState('');
  const loadMoreRef = useRef();

  const onIntersect = useCallback(
    ([entry]) => {
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(onIntersect, {
      threshold: 1.0,
    });
    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }
    return () => observer.disconnect();
  }, [onIntersect]);

  const allPosts = data?.pages.flat() || [];

  const filteredPosts = searchVal
    ? allPosts.filter(post =>
        post.title.toLowerCase().includes(searchVal.toLowerCase())
      )
    : allPosts;

  return (
    <div>
      <div className="my-4">
        <InputText
          value={searchVal}
          placeholder="Search by title..."
          onChange={(e) => setSearchVal(e.target.value)}
          className="w-full"
        />
      </div>

      {filteredPosts.map((post) => (
        <BlogPost key={post.id} post={post} />
      ))}

      <div ref={loadMoreRef} className="h-10 text-center">
        {isFetchingNextPage ? 'Loading more...' : ''}
      </div>
    </div>
  );
}
