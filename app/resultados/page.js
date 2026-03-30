"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function Resultados() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tipo = searchParams.get("tipo") || "masculino"

  const [ranking, setRanking] = useState([])

  // CLUBES
  const clubesMasculino = [
    { sigla: "SCP", nome: "Sporting Clube de Portugal" },
    { sigla: "SLB", nome: "Sport Lisboa e Benfica" },
    { sigla: "AJS", nome: "Associação Cultural e Desportiva do Jardim da Serra" },
    { sigla: "JV", nome: "Juventude Vidigalense" },
    { sigla: "ACPV", nome: "Atlético Clube da Póvoa de Varzim" },
    { sigla: "GDE", nome: "Grupo Desportivo do Estreito" },
    { sigla: "CPTSC", nome: "Centro Popular de Trabalhadores do Sobral de Ceira" },
    { sigla: "CAMG", nome: "Clube Atletismo de Marinha Grande" },
  ]

  const clubesFeminino = [
    { sigla: "SCP", nome: "Sporting Clube de Portugal" },
    { sigla: "GDE", nome: "Grupo Desportivo do Estreito" },
    { sigla: "AJS", nome: "Associação Cultural e Desportiva do Jardim da Serra" },
    { sigla: "JV", nome: "Juventude Vidigalense" },
    { sigla: "SCB", nome: "Sporting Clube de Braga" },
    { sigla: "ACPV", nome: "Atlético Clube da Póvoa de Varzim" },
    { sigla: "JOMA", nome: "Juventude Operária do Monte Abraão" },
    { sigla: "MAC", nome: "Maia Atlético Clube" },
  ]

  const clubes = tipo === "feminino" ? clubesFeminino : clubesMasculino

  // LOAD COM PROTEÇÃO
  useEffect(() => {
    const data = localStorage.getItem(`ranking-${tipo}`)

    if (!data) {
      router.push("/") // 🔥 evita crash / acesso direto
      return
    }

    setRanking(JSON.parse(data))
  }, [tipo])

  // CORES
  const getStyle = (index) => {
    if (index === 0) return "bg-yellow-500/80 scale-105"
    if (index === 1) return "bg-gray-300 text-black"
    if (index === 2) return "bg-amber-700/80"
    if (index === 6 || index === 7) return "bg-red-600/80"
    return "bg-white/10"
  }

  // POSIÇÃO
  const getPos = (i) => {
    if (i === 0) return "🥇"
    if (i === 1) return "🥈"
    if (i === 2) return "🥉"
    return `${i + 1}º`
  }

  // RESET
  const handleReset = () => {
    localStorage.removeItem(`ranking-${tipo}`)
    localStorage.removeItem(`provas-${tipo}`)
    router.push("/")
  }

  // PARTILHAR
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Minha previsão",
        text: "Vê a minha classificação!",
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Link copiado!")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-black to-black text-white flex flex-col items-center justify-center p-6">

      <h1 className="text-3xl font-extrabold mb-6">
        {tipo === "feminino" ? "🏆 Resultado Feminino" : "🏆 Resultado Masculino"}
      </h1>

      <div className="w-full max-w-md">
        {ranking.map(([sigla, pontos], i) => {
          const clube = clubes.find(c => c.sigla === sigla)
          const nome = clube ? clube.nome : sigla

          return (
            <div
              key={sigla}
              className={`p-4 mb-3 rounded-3xl flex justify-between items-center shadow-xl backdrop-blur-md border border-white/20 transition-all duration-300 animate-fadeInUp ${getStyle(i)}`}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <span className="flex items-center gap-2 font-semibold">
                <span className="text-lg font-extrabold text-purple-300">
                  {getPos(i)}
                </span>
                {sigla}
              </span>

              <span className="font-bold">{pontos} pts</span>
            </div>
          )
        })}
      </div>

      <div className="mt-6 flex flex-col gap-4 w-full max-w-md">

        <button
          onClick={handleShare}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-4 rounded-3xl text-lg font-semibold shadow-xl hover:scale-105 transition"
        >
          📤 Partilhar
        </button>

        <button
          onClick={handleReset}
          className="w-full bg-gradient-to-r from-gray-700 to-gray-900 py-4 rounded-3xl text-lg font-semibold shadow-xl hover:scale-105 transition"
        >
          🔄 Nova Simulação
        </button>

      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.4s ease forwards;
        }
      `}</style>

    </div>
  )
}