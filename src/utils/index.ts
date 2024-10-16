import { type EditorState, type LexicalNode, type NodeKey } from 'lexical'

export function getNodeByKey<T extends LexicalNode>(key: NodeKey, editorState: EditorState): T | null {
  const node = editorState?._nodeMap.get(key) as T
  if (node === undefined) {
    return null
  }
  return node
}
export function generateUUID() {
  return Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, '')
    .substring(0, 5)
}
