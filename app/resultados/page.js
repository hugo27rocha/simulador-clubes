"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toPng } from "html-to-image"

export default function Resultados() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tipo = searchParams?.get("tipo") || "masculino"
  const ref = useRef(null)

  const [ranking, setRanking] = useState([])

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

  useEffect(() => {
    const data