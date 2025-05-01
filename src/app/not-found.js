'use client'; // Mark this file as a client component

import { Button } from 'primereact/button';
import { useRouter } from "next/navigation";

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center px-4">
            <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
            <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
            <p className="text-gray-600 mb-6">
                Sorry, the page you're looking for doesn't exist or has been moved.
            </p>
            <Button
                size="small"
                className="self-center"
                severity="success"
                outlined
                label="Go To Previous Page"
                onClick={() => router.back()}
            />
        </div>
    );
}
