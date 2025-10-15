import Link from "next/link";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen space-y-4 text-center">
      <h1 className="text-3xl font-bold">Welcome to AI Customer Support Bot</h1>
      <p className="text-gray-600">Your AI-powered assistant is ready.</p>
      <Link
        href="/chat"
        className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
      >
        Open Chat
      </Link>
    </main>
  );
}
