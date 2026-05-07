import type { TreeNode } from "./tree-types"

// ========================================
// CAMINHAMENTOS (TRAVERSALS)
// ========================================

// Pré-ordem: Visita RAIZ primeiro, depois os filhos
export function preOrder(node: TreeNode | null): string[] {
  if (!node) return []
  const result: string[] = [node.id]
  for (const child of node.children) {
    result.push(...preOrder(child))
  }
  return result
}

// Em-ordem: Metade filhos, RAIZ, outra metade (para árvores n-árias)
export function inOrder(node: TreeNode | null): string[] {
  if (!node) return []
  const result: string[] = []
  const mid = Math.floor(node.children.length / 2)
  
  for (let i = 0; i < mid; i++) {
    result.push(...inOrder(node.children[i]))
  }
  result.push(node.id)
  for (let i = mid; i < node.children.length; i++) {
    result.push(...inOrder(node.children[i]))
  }
  return result
}

// Pós-ordem: Visita todos os filhos primeiro, depois a RAIZ
export function postOrder(node: TreeNode | null): string[] {
  if (!node) return []
  const result: string[] = []
  for (const child of node.children) {
    result.push(...postOrder(child))
  }
  result.push(node.id)
  return result
}

// ========================================
// BUSCA (DFS)
// ========================================

// Busca um nó pelo nome e retorna o caminho da raiz até ele
export function searchNode(
  node: TreeNode | null,
  term: string,
  path: string[] = []
): { found: TreeNode | null; path: string[] } {
  if (!node) return { found: null, path: [] }
  
  const currentPath = [...path, node.id]
  
  if (node.name.toLowerCase().includes(term.toLowerCase())) {
    return { found: node, path: currentPath }
  }
  
  for (const child of node.children) {
    const result = searchNode(child, term, currentPath)
    if (result.found) return result
  }
  
  return { found: null, path: [] }
}

// ========================================
// MÉTRICAS
// ========================================

// Altura da árvore
export function getTreeHeight(node: TreeNode | null): number {
  if (!node) return 0
  if (node.children.length === 0) return 1
  return 1 + Math.max(...node.children.map(getTreeHeight))
}

// Grau do nó (número de filhos)
export function getNodeDegree(node: TreeNode): number {
  return node.children.length
}

// Total de nós
export function countNodes(node: TreeNode | null): number {
  if (!node) return 0
  return 1 + node.children.reduce((sum, child) => sum + countNodes(child), 0)
}

// ========================================
// MANIPULAÇÃO
// ========================================

// Encontra nó por ID
export function findNodeById(node: TreeNode | null, id: string): TreeNode | null {
  if (!node) return null
  if (node.id === id) return node
  for (const child of node.children) {
    const found = findNodeById(child, id)
    if (found) return found
  }
  return null
}

// Clona a árvore (deep copy)
export function cloneTree(node: TreeNode): TreeNode {
  return JSON.parse(JSON.stringify(node))
}

// Insere nó como filho
export function insertNode(tree: TreeNode, parentId: string, newNode: TreeNode): TreeNode {
  const clone = cloneTree(tree)
  const parent = findNodeById(clone, parentId)
  if (parent) parent.children.push(newNode)
  return clone
}

// Remove nó da árvore
export function removeNode(tree: TreeNode, nodeId: string): TreeNode {
  if (tree.id === nodeId) return tree // Não remove raiz
  const clone = cloneTree(tree)
  
  function removeFromParent(parent: TreeNode): boolean {
    const idx = parent.children.findIndex(c => c.id === nodeId)
    if (idx !== -1) {
      parent.children.splice(idx, 1)
      return true
    }
    return parent.children.some(removeFromParent)
  }
  
  removeFromParent(clone)
  return clone
}
