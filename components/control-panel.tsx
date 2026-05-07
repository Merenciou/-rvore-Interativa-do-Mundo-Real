"use client"

import type { TreeNode } from "@/lib/tree-types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Plus, Trash2, TreeDeciduous } from "lucide-react"

interface ControlPanelProps {
  // Metricas
  height: number
  totalNodes: number
  // Busca
  searchTerm: string
  onSearchChange: (term: string) => void
  onSearch: () => void
  // Caminhamentos
  onTraversal: (type: "pre" | "in" | "post") => void
  traversalResult: string[]
  // Manipulacao
  selectedNode: TreeNode | null
  onInsert: () => void
  onDelete: () => void
  // Hover info
  hoveredNode: TreeNode | null
  hoveredDegree: number
}

export function ControlPanel({
  height,
  totalNodes,
  searchTerm,
  onSearchChange,
  onSearch,
  onTraversal,
  traversalResult,
  selectedNode,
  onInsert,
  onDelete,
  hoveredNode,
  hoveredDegree
}: ControlPanelProps) {
  return (
    <div className="w-80 space-y-4 p-4 border-l border-border bg-card h-full overflow-y-auto">
      {/* Metricas */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <TreeDeciduous size={16} />
            Metricas da Arvore
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Altura:</span>
            <span className="font-mono font-bold text-primary">{height}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total de Nos:</span>
            <span className="font-mono font-bold">{totalNodes}</span>
          </div>
          {hoveredNode && (
            <div className="pt-2 border-t border-border">
              <p className="text-muted-foreground text-xs mb-1">No sob o mouse:</p>
              <p className="font-medium truncate">{hoveredNode.name}</p>
              <p className="text-muted-foreground">Grau: <span className="text-primary font-bold">{hoveredDegree}</span></p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Busca */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Search size={16} />
            Busca (DFS)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="Nome do no..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSearch()}
              className="h-9"
            />
            <Button size="sm" onClick={onSearch} className="h-9">
              Buscar
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Destaca o no e mostra o caminho da raiz
          </p>
        </CardContent>
      </Card>

      {/* Caminhamentos */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Caminhamentos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <Button size="sm" variant="outline" onClick={() => onTraversal("pre")}>
              Pre-ordem
            </Button>
            <Button size="sm" variant="outline" onClick={() => onTraversal("in")}>
              Em-ordem
            </Button>
            <Button size="sm" variant="outline" onClick={() => onTraversal("post")}>
              Pos-ordem
            </Button>
          </div>
          {traversalResult.length > 0 && (
            <div className="bg-secondary/50 rounded-lg p-3 max-h-40 overflow-y-auto">
              <p className="text-xs text-muted-foreground mb-2">Ordem de visitacao:</p>
              <div className="flex flex-wrap gap-1">
                {traversalResult.map((name, i) => (
                  <span key={i} className="text-xs bg-primary/20 px-2 py-0.5 rounded">
                    {i + 1}. {name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Manipulacao */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Manipulacao</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground">
            {selectedNode ? (
              <>Selecionado: <span className="text-foreground font-medium">{selectedNode.name}</span></>
            ) : (
              "Clique em um no para selecionar"
            )}
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={onInsert}
              disabled={!selectedNode}
            >
              <Plus size={14} className="mr-1" />
              Inserir Filho
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="flex-1"
              onClick={onDelete}
              disabled={!selectedNode || selectedNode.id === "root"}
            >
              <Trash2 size={14} className="mr-1" />
              Remover
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
