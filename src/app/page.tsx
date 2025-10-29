export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white p-6">
      <div className="text-center space-y-4 animate-fade-in">
        <h1 className="text-5xl font-extrabold tracking-tight">SE Project</h1>
        <p className="text-xl text-gray-300">Pay Order Management App</p>
        <div className="mt-6">
          <a
            href="#"
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition font-medium shadow-lg"
          >
            Get Started
          </a>
        </div>
      </div>
    </main>
  );
}
