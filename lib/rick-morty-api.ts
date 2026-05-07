import type { TreeNode } from "./tree-types"

const API = "https://rickandmortyapi.com/api"

// Busca localizações e personagens, monta a árvore
export async function buildTree(): Promise<TreeNode> {
  const res = await fetch(`${API}/location?page=1`)
  const data = await res.json()
  const locations = data.results.slice(0, 4) // 4 localizações

  const root: TreeNode = {
    id: "root",
    name: "Multiverso",
    children: []
  }

  for (const loc of locations) {
    const locNode: TreeNode = {
      id: `loc-${loc.id}`,
      name: loc.name,
      children: []
    }

    // Busca até 3 residentes
    const residentUrls = loc.residents.slice(0, 3)
    for (const url of residentUrls) {
      try {
        const charRes = await fetch(url)
        const char = await charRes.json()
        locNode.children.push({
          id: `char-${char.id}`,
          name: char.name,
          image: char.image,
          children: []
        })
      } catch {
        // ignora erros
      }
    }

    root.children.push(locNode)
  }

  return root
}
