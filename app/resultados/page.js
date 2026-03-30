"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function Resultados() {
  const router = useRouter()

  const [ranking, setRanking] = useState([])
  const [tipo, setTipo] = useState("masculino")

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

  // 🔥 LER PARAMS NO CLIENTE
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const tipoURL = params.get("tipo") || "masculino"
    setTipo(tipoURL)

    const data = localStorage.getItem(`ranking-${tipoURL}`)

    if (!data) {
      router.push("/")
      return
    }

    setRanking(JSON.parse(data))
  }, [])

  const clubes = tipo === "feminino" ? clubesFeminino : clubesMasculino

  const getStyle = (index) => {
    if (index === 0) return "bg-yellow-500/80 scale-105"
    if (index === 1) return "bg-gray-300 text-black"
    if (index === 2) return "bg-amber-700/80"
    if (index === 6 || index === 7) return "bg-red-600/80"
    return "bg-white/10"
  }

  const getPos = (i) => {
    if (i === 0) return "🥇"
    if (i === 1) return "🥈"
    if (i === 2) return "🥉"
    return `${i + 1}º`
  }

  const handleReset = () => {
    localStorage.removeItem(`ranking-${tipo}`)
    localStorage.removeItem(`provas-${tipo}`)
    router.push("/")
  }

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
        {ranking.map(([sigla, pontos], i) => (
          <div
            key={sigla}
            className={`p-4 mb-3 rounded-3xl flex justify-between items-center shadow-xl backdrop-blur-md border border-white/20 ${getStyle(i)}`}
          >
            <span className="flex items-center gap-2 font-semibold">
              <span className="text-lg font-extrabold text-purple-300">
                {getPos(i)}
              </span>
              {sigla}
            </span>

            <span className="font-bold">{pontos} pts</span>
          </div>
        ))}
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
    </div>
  )
}