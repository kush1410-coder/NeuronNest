export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-300 via-pink-200 to-yellow-200 p-10">

      <div className="max-w-4xl mx-auto bg-white rounded-[50px] shadow-2xl p-10">

        <div className="text-center">

          <div className="text-9xl">
            🧒
          </div>

          <h1 className="text-5xl font-black mt-4">
            Aarav
          </h1>

          <p className="text-xl text-gray-600">
            Level 3 Explorer 🚀
          </p>

        </div>

        <div className="mt-10 grid md:grid-cols-3 gap-6">

          <div className="bg-pink-100 rounded-3xl p-6 text-center">
            <h2 className="text-3xl font-bold">
              350
            </h2>
            <p>XP</p>
          </div>

          <div className="bg-yellow-100 rounded-3xl p-6 text-center">
            <h2 className="text-3xl font-bold">
              12
            </h2>
            <p>Badges</p>
          </div>

          <div className="bg-blue-100 rounded-3xl p-6 text-center">
            <h2 className="text-3xl font-bold">
              21
            </h2>
            <p>Stories</p>
          </div>

        </div>

      </div>
    </div>
  );
}