export default function AdminHome() {
  return (
    <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <div className="text-center space-y-6 p-8">
        <div className="w-20 h-20 bg-purple-500 rounded-lg mx-auto flex items-center justify-center">
          <span className="text-4xl font-black">N</span>
        </div>
        <h1 className="text-5xl font-black tracking-tight">
          NtikaApp Admin
        </h1>
        <p className="text-xl text-gray-400 max-w-md">
          Admin dashboard for managing users, analytics, and content moderation.
        </p>
        <div className="pt-4">
          <div className="inline-block bg-green-500 text-black px-6 py-3 rounded-lg font-bold">
            Deployment Successful
          </div>
        </div>
        <p className="text-sm text-gray-500 pt-4">
          Coming soon: User management, analytics dashboards, and moderation tools
        </p>
      </div>
    </main>
  );
}
