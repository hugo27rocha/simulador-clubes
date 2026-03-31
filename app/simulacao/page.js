"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

// ITEM
function Item({ id, index, onRemove }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-2 mb-2 rounded-xl flex justify-between items-center text-sm border
        ${isDragging ? "bg-purple-600 border-purple-400" : "bg-white/10 border-white/20"}
      `}
    >
      {/* 🔥 ZONA DRAG (só aqui funciona drag) */}
      <div
        {...attributes}
        {...listeners}
        className="flex items-center gap-2 flex-1"
      >
        <span>{index + 1}. {id}</span>
      </div>

      {/* 🔥 BOTÃO REMOVER (agora funciona!) */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onRemove(id)
        }}
        className="text-red-400 px-2"
      >
        ✕
      </button>
    </div>
  )
}

export default function Simulacao() {
  const router = useRouter()

  const [tipo, setTipo] = useState("masculino")
  const [provaIndex, setProvaIndex] = useState(0)
  const [activeId, setActiveId] = useState(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setTipo(params.get("tipo") || "masculino")
  }, [])

  // CLUBES
  const clubesMasculino = ["SCP","SLB","AJS","JV","ACPV","GDE","CPTSC","CAMG"]
  const clubesFeminino = ["SCP","GDE","AJS","JV","SCB","ACPV","JOMA","MAC"]

  const clubes = tipo === "feminino" ? clubesFeminino : clubesMasculino

  // PROVAS
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
    useSensor(PointerSensor),
    useSensor(TouchSensor)
  )

  const [provas, setProvas] = useState([])
  const [submetidas, setSubmetidas] = useState([])

  useEffect(() => {
    const inicial = listaProvas.map((nome) => ({
      nome,
      ordem: [...clubes],
    }))
    setProvas(inicial)
    setSubmetidas([])
  }, [tipo])

  // DRAG
  const handleDragEnd = (event) => {
    const { active, over } = event
    setActiveId(null)

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

  // 🔥 REMOVER EQUIPA (DSQ)
  const removerEquipa = (id) => {
    const nova = [...provas]

    nova[provaIndex].ordem =
      nova[provaIndex].ordem.filter(e => e !== id)

    setProvas(nova)
  }

  // SUBMETER
  const submeter = () => {
    if (!submetidas.includes(provaIndex)) {
      setSubmetidas([...submetidas, provaIndex])
    }
  }

  // RESET
  const resetProva = () => {
    const nova = [...provas]
    nova[provaIndex].ordem = [...clubes]

    setProvas(nova)
    setSubmetidas(submetidas.filter(p => p !== provaIndex))
  }

  // 🔥 CLASSIFICAÇÃO CORRETA
  const calcularRanking = () => {
    const totais = {}

    // todas começam com 0
    clubes.forEach((c) => {
      totais[c] = 0
    })

    submetidas.forEach((i) => {
      const prova = provas[i]
      const n = prova.ordem.length

      prova.ordem.forEach((equipa, index) => {
        totais[equipa] += (n - index)
      })
    })

    return Object.entries(totais)
      .sort((a, b) => b[1] - a[1])
  }

  const ranking = calcularRanking()

  const feitas = submetidas.length
  const total = listaProvas.length

  return (
    <div className="min-h-screen bg-black text-white p-4">

      <h1 className="text-center font-bold mb-3">
        {tipo === "feminino" ? "1ª Divisão - Feminino 🏃‍♀️" : "1ª Divisão -Masculino 🏃"}
      </h1>

      {/* GRID PROVAS */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {listaProvas.map((p, i) => (
          <button
            key={i}
            onClick={() => setProvaIndex(i)}
            className={`text-xs py-2 rounded-xl
              ${provaIndex === i ? "bg-purple-600" : "bg-gray-700"}
              ${submetidas.includes(i) ? "bg-green-600" : ""}
            `}
          >
            {p}
          </button>
        ))}
      </div>

      {/* LISTA */}
      <div className="max-w-xs mx-auto">

        <h2 className="text-center mb-2">
          {listaProvas[provaIndex]}
        </h2>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={(e) => setActiveId(e.active.id)}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={provas[provaIndex]?.ordem || []}
            strategy={verticalListSortingStrategy}
          >
            {provas[provaIndex]?.ordem.map((sigla, i) => (
              <Item
                key={sigla}
                id={sigla}
                index={i}
                onRemove={removerEquipa}
              />
            ))}
          </SortableContext>

          <DragOverlay>
            {activeId ? (
              <div className="p-2 bg-purple-600 rounded-xl">
                {activeId}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        {/* BOTÕES */}
        <div className="flex justify-center gap-2 mt-3">
          {!submetidas.includes(provaIndex) ? (
            <button
              onClick={submeter}
              className="bg-green-600 px-4 py-2 rounded-xl text-sm"
            >
              Submeter
            </button>
          ) : (
            <button
              onClick={resetProva}
              className="bg-red-600 px-4 py-2 rounded-xl text-sm"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* CLASSIFICAÇÃO */}
      <div className="mt-6 max-w-xs mx-auto">

        <h2 className="text-center font-bold mb-2">
          Classificação Geral
        </h2>

        <div className="w-full bg-gray-700 h-2 rounded-full mb-3">
          <div
            className="bg-green-500 h-2 rounded-full"
            style={{ width: `${(feitas / total) * 100}%` }}
          />
        </div>

        {ranking.map(([sigla, pts], i) => (
          <div
            key={sigla}
            className={`p-2 mb-2 rounded-xl flex justify-between text-sm
              ${i === 0 ? "bg-yellow-500" : ""}
              ${i === 1 ? "bg-gray-300 text-black" : ""}
              ${i === 2 ? "bg-amber-700" : ""}
              ${i >= clubes.length - 2 ? "bg-red-600" : ""}
              ${i > 2 && i < clubes.length - 2 ? "bg-white/10" : ""}
            `}
          >
            <span>{i + 1}. {sigla}</span>
            <span>{pts}</span>
          </div>
        ))}

        <button
          onClick={() => router.push("/")}
          className="w-full mt-4 bg-purple-600 py-3 rounded-xl"
        >
          Nova Simulação
        </button>

      </div>

    </div>
  )
}