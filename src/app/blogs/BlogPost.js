import Link from 'next/link';
import { Card } from 'primereact/card';

export default function BlogPost({ post }) {
  return (
    <Link href={`/blogs/${post.id}`}>
      <div className="cursor-pointer hover:bg-gray-100 transition m-2">
        <Card title={post.title}>
          <p>{post.body}</p>
        </Card>
      </div>
    </Link>
  );
}