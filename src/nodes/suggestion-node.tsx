import { type ReactElement } from 'react'
import { DecoratorNode, type LexicalNode, type NodeKey, type SerializedLexicalNode, type Spread } from 'lexical'
import Suggestion from '../components/suggestion'

type SerializedSuggestionNode = Spread<
  {
    __uuid: string
  },
  SerializedLexicalNode
>

export class SuggestionNode extends DecoratorNode<ReactElement | null> {
  __uuid: string

  constructor(text: string, key?: NodeKey) {
    super(key)
    this.__uuid = text
  }

  static clone(node: SuggestionNode): SuggestionNode {
    return new SuggestionNode(node.__uuid, node.__key)
  }

  static getType(): 'suggestion' {
    return 'suggestion'
  }

  static importJSON(serializedNode: SerializedSuggestionNode): LexicalNode {
    return createSuggestionNode(serializedNode.__uuid)
  }

  exportJSON(): SerializedSuggestionNode {
    return {
      ...super.exportJSON(),
      type: 'suggestion',
      __uuid: this.__uuid,
      version: 1,
    }
  }

  createDOM() {
    return document.createElement('span')
  }

  updateDOM() {
    return false
  }

  decorate() {
    return <Suggestion as='span' className={'text-gray-400'}></Suggestion>
  }
}

export function createSuggestionNode(text: string): SuggestionNode {
  return new SuggestionNode(text)
}
