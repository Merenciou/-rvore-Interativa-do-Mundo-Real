"use client"

import { useState, useEffect } from "react"
import type { TreeNode } from "@/lib/tree-types"
import { buildTree } from "@/lib/rick-morty-api"
import {
  preOrder,
  inOrder,
  postOrder,
  searchNode,
  getTreeHeight,
  countNodes,
  getNodeDegree,
  insertNode,
  removeNode,
  findNodeById
} from "@/lib/tree-algorithms"
import { TreeNodeComponent } from "./tree-node"
import { ControlPanel } from "./control-panel"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"

export function TreeApp() {
  const [tree, setTree] = useState<TreeNode | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Estados de selecao e hover
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null)
  const [hoveredNode, setHoveredNode] = useState<TreeNode | null>(null)

  // Estados de busca
  const [searchTerm, setSearchTerm] = useState("")
  const [highlightedIds, setHighlightedIds] = useState<string[]>([])
  const [pathIds, setPathIds] = useState<string[]>([])

  // Estados de caminhamento
  const [traversalResult, setTraversalResult] = useState<string[]>([])

  // Dialog de insercao
  const [showInsertDialog, setShowInsertDialog] = useState(false)
  const [newNodeName, setNewNodeName] = useState("")

  // Carrega a arvore da API
  useEffect(() => {
    async function load() {
      try {
        const data = await buildTree()
        setTree(data)
      } catch (e) {
        setError("Erro ao carregar dados da API")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Calcula metricas
  const height = tree ? getTreeHeight(tree) : 0
  const totalNodes = tree ? countNodes(tree) : 0
  const hoveredDegree = hoveredNode ? getNodeDegree(hoveredNode) : 0

  // Funcao de busca
  function handleSearch() {
    if (!tree || !searchTerm.trim()) {
      setHighlightedIds([])
      setPathIds([])
      return
    }

    const result = searchNode(tree, searchTerm.trim())
    if (result.found) {
      setHighlightedIds([result.found.id])
      setPathIds(result.path)
      setSelectedNode(result.found)
    } else {
      setHighlightedIds([])
      setPathIds([])
      alert("No nao encontrado")
    }
  }

  // Funcao de caminhamento
  function handleTraversal(type: "pre" | "in" | "post") {
    if (!tree) return

    let order: string[] = []
    switch (type) {
      case "pre":
        order = preOrder(tree)
        break
      case "in":
        order = inOrder(tree)
        break
      case "post":
        order = postOrder(tree)
        break
    }

    // Converte IDs para nomes
    const names = order.map((id) => {
      const node = findNodeById(tree, id)
      return node ? node.name : id
    })

    setTraversalResult(names)
    setHighlightedIds(order)
    setPathIds([])
  }

  // Funcao de insercao
  function handleInsert() {
    if (!tree || !selectedNode || !newNodeName.trim()) return

    const newNode: TreeNode = {
      id: `custom-${Date.now()}`,
      name: newNodeName.trim(),
      children: []
    }

    const newTree = insertNode(tree, selectedNode.id, newNode)
    setTree(newTree)
    setShowInsertDialog(false)
    setNewNodeName("")
    
    // Atualiza o no selecionado para refletir a mudanca
    const updated = findNodeById(newTree, selectedNode.id)
    setSelectedNode(updated)
  }

  // Funcao de remocao
  function handleDelete() {
    if (!tree || !selectedNode || selectedNode.id === "root") return

    if (confirm(`Remover "${selectedNode.name}" e todos os seus filhos?`)) {
      const newTree = removeNode(tree, selectedNode.id)
      setTree(newTree)
      setSelectedNode(null)
      setHighlightedIds([])
      setPathIds([])
    }
  }

  // Limpa destaques ao selecionar
  function handleSelect(node: TreeNode) {
    setSelectedNode(node)
    setHighlightedIds([])
    setPathIds([])
    setTraversalResult([])
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando dados da API...</p>
        </div>
      </div>
    )
  }

  if (error || !tree) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-destructive mb-4">{error || "Erro desconhecido"}</p>
          <Button onClick={() => window.location.reload()}>Tentar novamente</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <h1 className="text-xl font-bold">Visualizador de Arvore - Rick and Morty</h1>
        <p className="text-sm text-muted-foreground">
          Estrutura de dados em arvore com dados da API Rick and Morty
        </p>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Arvore */}
        <div className="flex-1 overflow-auto p-6">
          <TreeNodeComponent
            node={tree}
            level={0}
            selectedId={selectedNode?.id || null}
            highlightedIds={highlightedIds}
            pathIds={pathIds}
            onSelect={handleSelect}
            onHover={setHoveredNode}
          />
        </div>

        {/* Painel de controle */}
        <ControlPanel
          height={height}
          totalNodes={totalNodes}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onSearch={handleSearch}
          onTraversal={handleTraversal}
          traversalResult={traversalResult}
          selectedNode={selectedNode}
          onInsert={() => setShowInsertDialog(true)}
          onDelete={handleDelete}
          hoveredNode={hoveredNode}
          hoveredDegree={hoveredDegree}
        />
      </div>

      {/* Dialog de insercao */}
      <Dialog open={showInsertDialog} onOpenChange={setShowInsertDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Inserir Novo No</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-3">
              O novo no sera inserido como filho de: <strong>{selectedNode?.name}</strong>
            </p>
            <Input
              placeholder="Nome do novo no"
              value={newNodeName}
              onChange={(e) => setNewNodeName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleInsert()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInsertDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleInsert} disabled={!newNodeName.trim()}>
              Inserir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
