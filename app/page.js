"use client"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-black to-black text-white flex flex-col items-center justify-center p-6">
      
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold mb-2">
          🏆 Atletismo - Campeonato Nacional de Clubes
        </h1>
        <p className="text-gray-300 text-lg">
          Cria a tua previsão de forma interativa
        </p>
      </div>

      <div className="w-full max-w-sm flex flex-col gap-4">

        <button
          onClick={() => router.push("/simulacao?tipo=masculino")}
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 py-4 rounded-3xl text-lg font-semibold shadow-xl hover:scale-105 transition"
        >
          🏃 Masculino - 1ª Divisão
        </button>

        <button
          onClick={() => router.push("/simulacao?tipo=feminino")}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 py-4 rounded-3xl text-lg font-semibold shadow-xl hover:scale-105 transition"
        >
          🏃‍♀️ Feminino - 1ª Divisão
        </button>

      </div>
    </div>
  )
}