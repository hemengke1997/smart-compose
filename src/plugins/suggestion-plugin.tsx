import { useEffect } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $isAtNodeEnd } from '@lexical/selection'
import { mergeRegister } from '@lexical/utils'
import { useRequest } from 'ahooks'
import {
  $createTextNode,
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  $setSelection,
  type BaseSelection,
  COMMAND_PRIORITY_LOW,
  KEY_ARROW_RIGHT_COMMAND,
  KEY_TAB_COMMAND,
  type NodeKey,
} from 'lexical'
import { SuggestionContext } from '@/contexts/suggestion-context'
import { createSuggestionNode, SuggestionNode } from '@/nodes/suggestion-node'
import { smartComposeApi } from '@/server/query'
import { generateUUID, getNodeByKey } from '@/utils'

const uuid = generateUUID()

function search(selection: null | BaseSelection): [boolean, string] {
  if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
    return [false, '']
  }
  const node = selection.getNodes()[0]
  const anchor = selection.anchor
  if (!$isTextNode(node) || !node.isSimpleText() || !$isAtNodeEnd(anchor)) {
    return [false, '']
  }
  const word: string[] = []
  const text = node.getTextContent()
  let i = node.getTextContentSize()
  let c: string
  while (i-- && i >= 0 && (c = text[i]) !== ' ') {
    word.push(c)
  }
  if (word.length === 0) {
    return [false, '']
  }
  return [true, word.reverse().join('')]
}

export default function SuggestionPlugin() {
  const [editor] = useLexicalComposerContext()
  const { setSuggestion } = SuggestionContext.usePicker(['setSuggestion'])

  const { runAsync, cancel } = useRequest(smartComposeApi, {
    manual: true,
    debounceWait: 200,
  })

  useEffect(() => {
    let suggestionNodeKey: null | NodeKey = null
    let lastMatch: null | string = null
    let lastSuggestion: null | string = null
    function clearSuggestion() {
      const suggestionNode = suggestionNodeKey !== null ? getNodeByKey(suggestionNodeKey, editor._editorState) : null
      if (suggestionNode !== null && suggestionNode.isAttached()) {
        suggestionNode.remove()
        suggestionNodeKey = null
      }
      cancel()
      lastMatch = null
      lastSuggestion = null
      setSuggestion(null)
    }
    function updateAsyncSuggestion(newSuggestion: null | string) {
      if (newSuggestion === null) {
        return
      }
      editor.update(
        () => {
          const selection = $getSelection()
          const [hasMatch, match] = search(selection)
          if (!hasMatch || match !== lastMatch || !$isRangeSelection(selection)) {
            return
          }
          const selectionCopy = selection.clone()
          const node = createSuggestionNode(uuid)
          suggestionNodeKey = node.getKey()
          selection.insertNodes([node])
          $setSelection(selectionCopy)
          lastSuggestion = newSuggestion
          setSuggestion(newSuggestion)
        },
        { tag: 'history-merge' },
      )
    }

    function handleSuggestionNodeTransform(node: SuggestionNode) {
      const key = node.getKey()
      if (node.__uuid === uuid && key !== suggestionNodeKey) {
        clearSuggestion()
      }
    }
    function handleUpdate() {
      editor.update(() => {
        const selection = $getSelection()
        const [hasMatch, match] = search(selection)
        if (!hasMatch) {
          clearSuggestion()
          return
        }
        if (match === lastMatch) {
          return
        }
        clearSuggestion()
        runAsync(match).then(({ completion }) => {
          updateAsyncSuggestion(completion)
        })

        lastMatch = match
      })
    }

    function handleSuggestionIntent(): boolean {
      if (lastSuggestion === null || suggestionNodeKey === null) {
        return false
      }
      const suggestionNode = getNodeByKey(suggestionNodeKey, editor._editorState)
      if (suggestionNode === null) {
        return false
      }
      const textNode = $createTextNode(lastSuggestion)
      suggestionNode.replace(textNode)
      textNode.selectNext()
      clearSuggestion()
      return true
    }

    function handleKeypressCommand(e: Event) {
      if (handleSuggestionIntent()) {
        e.preventDefault()
        return true
      }
      return false
    }

    function unmountSuggestion() {
      editor.update(() => {
        clearSuggestion()
      })
    }

    return mergeRegister(
      editor.registerNodeTransform(SuggestionNode, handleSuggestionNodeTransform),
      editor.registerUpdateListener(handleUpdate),
      editor.registerCommand(KEY_TAB_COMMAND, handleKeypressCommand, COMMAND_PRIORITY_LOW),
      editor.registerCommand(KEY_ARROW_RIGHT_COMMAND, handleKeypressCommand, COMMAND_PRIORITY_LOW),
      unmountSuggestion,
    )
  }, [editor, setSuggestion])

  return null
}
