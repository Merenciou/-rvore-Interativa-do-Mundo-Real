// Estrutura simples de um nó da árvore
export interface TreeNode {
  id: string
  name: string
  image?: string
  children: TreeNode[]
}

// Tipos da API Rick and Morty
export interface RickMortyLocation {
  id: number
  name: string
  dimension: string
  residents: string[]
}

export interface RickMortyCharacter {
  id: number
  name: string
  status: string
  species: string
  image: string
}
