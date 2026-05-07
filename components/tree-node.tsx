"use client"

import type { TreeNode } from "@/lib/tree-types"
import { getNodeDegree } from "@/lib/tree-algorithms"
import { ChevronDown, ChevronRight, User, MapPin, Globe } from "lucide-react"
import { useState } from "react"

interface TreeNodeProps {
  node: TreeNode
  level: number
  selectedId: string | null
  highlightedIds: string[]
  pathIds: string[]
  onSelect: (node: TreeNode) => void
  onHover: (node: TreeNode | null) => void
}

export function TreeNodeComponent({
  node,
  level,
  selectedId,
  highlightedIds,
  pathIds,
  onSelect,
  onHover
}: TreeNodeProps) {
  const [expanded, setExpanded] = useState(level < 2)
  const hasChildren = node.children.length > 0
  const isSelected = selectedId === node.id
  const isHighlighted = highlightedIds.includes(node.id)
  const isInPath = pathIds.includes(node.id)
  const degree = getNodeDegree(node)

  // Determina o icone baseado no tipo de no
  const Icon = node.image ? User : level === 0 ? Globe : MapPin

  return (
    <div className="select-none">
      <div
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all
          ${isSelected ? "bg-primary text-primary-foreground" : ""}
          ${isHighlighted && !isSelected ? "bg-primary/30 ring-2 ring-primary" : ""}
          ${isInPath && !isSelected && !isHighlighted ? "bg-accent/50" : ""}
          ${!isSelected && !isHighlighted && !isInPath ? "hover:bg-secondary" : ""}
        `}
        style={{ marginLeft: level * 24 }}
        onClick={() => onSelect(node)}
        onMouseEnter={() => onHover(node)}
        onMouseLeave={() => onHover(null)}
      >
        {/* Botao expandir/colapsar */}
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation()
              setExpanded(!expanded)
            }}
            className="p-0.5 hover:bg-background/50 rounded"
          >
            {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        ) : (
          <span className="w-5" />
        )}

        {/* Imagem ou icone */}
        {node.image ? (
          <img src={node.image} alt={node.name} className="w-8 h-8 rounded-full object-cover" />
        ) : (
          <Icon size={18} className="text-muted-foreground" />
        )}

        {/* Nome do no */}
        <span className="font-medium flex-1">{node.name}</span>

        {/* Grau do no */}
        {hasChildren && (
          <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">
            Grau: {degree}
          </span>
        )}
      </div>

      {/* Filhos */}
      {expanded && hasChildren && (
        <div>
          {node.children.map((child) => (
            <TreeNodeComponent
              key={child.id}
              node={child}
              level={level + 1}
              selectedId={selectedId}
              highlightedIds={highlightedIds}
              pathIds={pathIds}
              onSelect={onSelect}
              onHover={onHover}
            />
          ))}
        </div>
      )}
    </div>
  )
}
