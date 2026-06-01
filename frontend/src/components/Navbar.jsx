export default function Navbar() {
  return (
    <div className="bg-white/60 backdrop-blur-lg p-5 rounded-3xl m-4 shadow-lg flex justify-between">

      <div>
        <h2 className="text-2xl font-bold">
          Hello Aarav 👋
        </h2>

        <p>
          Ready for today's adventure?
        </p>
      </div>

      <div className="flex gap-6 text-3xl">

        <span>⭐ 250</span>
        <span>🏆 15</span>
        <span>🎈</span>

      </div>
    </div>
  );
}