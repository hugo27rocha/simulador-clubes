"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

// ITEM
function Item({ id, index, nomeCompleto }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: "none", // 🔥 evita conflito com scroll
    userSelect: "none",
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      title={nomeCompleto}
      className="p-3 mb-2 bg-white/10 backdrop-blur-md rounded-2xl shadow-md border border-white/20 flex items-center justify-between text-sm text-white"
    >
      <div className="flex items-center gap-2">
        <span className="font-bold text-purple-300">
          {index + 1}.
        </span>
        <span>{id}</span>
      </div>

      {/* indicador drag */}
      <span className="opacity-50 text-lg">⋮⋮</span>
    </div>
  )
}

export default function Simulacao() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tipo = searchParams.get("tipo") || "masculino"

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

  const provasMasculino = [
    "4x100m","Peso","1500m","5000m Marcha","Vara","100m","Dardo","Comprimento",
    "400m","5000m","Martelo","Altura","400m bar","800m","110m bar","200m",
    "Triplo Salto","3000m Obst","Disco","3000m","4x400m"
  ]

  const provasFeminino = [
    "4x100m","Disco","1500m","Comprimento","3000m Marcha","100m","Altura","3000 Obst",
    "Martelo","400m","5000m","400m bar","Triplo Salto","Vara","800m","Dardo",
    "100m bar","200m","Peso","3000m","4x400m"
  ]

  const listaProvas = tipo === "feminino" ? provasFeminino : provasMasculino

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 5 } })
  )

  const storageKey = `provas-${tipo}`

  const [provas, setProvas] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          if (parsed.length === listaProvas.length) return parsed
        } catch {}
      }
    }

    return listaProvas.map((nome) => ({
      nome,
      ordem: clubes.map((c) => c.sigla),
    }))
  })

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(provas))
  }, [provas, storageKey])

  const handleDragEnd = (event, provaIndex) => {
    const { active, over } = event
    if (!over) return

    if (active.id !== over.id) {
      const nova = [...provas]
      const oldIndex = nova[provaIndex].ordem.indexOf(active.id)
      const newIndex = nova[provaIndex].ordem.indexOf(over.id)

      nova[provaIndex].ordem = arrayMove(
        nova[provaIndex].ordem,
        oldIndex,
        newIndex
      )

      setProvas(nova)
    }
  }

  const calcular = () => {
    const totais = {}

    provas.forEach((prova) => {
      const n = prova.ordem.length
      prova.ordem.forEach((equipa, index) => {
        totais[equipa] = (totais[equipa] || 0) + (n - index)
      })
    })

    const ranking = Object.entries(totais).sort((a, b) => b[1] - a[1])

    localStorage.setItem(`ranking-${tipo}`, JSON.stringify(ranking))
    router.push(`/resultados?tipo=${tipo}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-900 text-white p-5">
      
      <h1 className="text-xl mb-2 text-center font-bold">
        {tipo === "feminino"
          ? "Simulação Feminina 🏃‍♀️"
          : "Simulação Masculina 🏃"}
      </h1>

      {/* INSTRUÇÃO */}
      <p className="text-center text-gray-400 text-sm mb-4">
        Arrasta as equipas para ordenar a classificação em cada prova.
      </p>

      <div className="max-w-md mx-auto">
        {provas.map((prova, provaIndex) => (
          <div key={prova.nome} className="mb-5">
            <h2 className="mb-2 font-semibold text-purple-300 text-base">
              {prova.nome}
            </h2>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(e) => handleDragEnd(e, provaIndex)}
            >
              <SortableContext
                items={prova.ordem}
                strategy={verticalListSortingStrategy}
              >
                {prova.ordem.map((sigla, i) => {
                  const clube = clubes.find((c) => c.sigla === sigla)
                  return (
                    <Item
                      key={sigla}
                      id={sigla}
                      index={i}
                      nomeCompleto={clube ? clube.nome : sigla}
                    />
                  )
                })}
              </SortableContext>
            </DndContext>
          </div>
        ))}

        <button
          onClick={calcular}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-4 rounded-3xl text-base font-semibold mt-4 shadow-xl flex items-center justify-center transition-transform transform active:scale-95"
        >
          Calcular Classificação
        </button>
      </div>
    </div>
  )
}