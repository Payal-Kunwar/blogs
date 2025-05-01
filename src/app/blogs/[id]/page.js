"use client"; // mark this as a client component

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card } from "primereact/card";

export default function PostDetail() {
  const { id } = useParams(); // get `id` from dynamic route
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchPost = async () => {
      try {
        const res = await fetch(`/posts/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }

        const data = await res.json();
        setPost(data);
      } catch (err) {
        throw err;
      }
    };

    if (id) fetchPost();
  }, [id]);

  if (error) return <div>{error}</div>;
  if (!post) return <div>Loading...</div>;

  return (
    <Card className="p-4">
      <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
      <p>{post.body}</p>
    </Card>
  );
}
