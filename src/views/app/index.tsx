import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { type InitialConfigType, LexicalComposer } from '@lexical/react/LexicalComposer'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin'
import { SuggestionNode } from '@/nodes/suggestion-node'
import SuggestionPlugin from '@/plugins/suggestion-plugin'

const placeholder = 'Type...'

const initialConfig: InitialConfigType = {
  namespace: 'Smart Compose',
  onError: (error) => {
    console.error(error)
  },
  editable: true,
  theme: {},
  nodes: [SuggestionNode],
}

function App() {
  return (
    <div className={'w-screen h-screen flex justify-center items-center flex-col gap-4'}>
      <h1 className={'font-bold text-3xl'}>Smart Compose</h1>
      <div className={'relative w-[70%]'}>
        <LexicalComposer initialConfig={initialConfig}>
          <PlainTextPlugin
            contentEditable={
              <ContentEditable
                aria-placeholder={placeholder}
                placeholder={
                  <div className={'text-gray-400 absolute truncate top-4 left-4 inline-block pointer-events-none'}>
                    {placeholder}
                  </div>
                }
                className={'relative bg-white p-4 rounded text-black'}
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />

          <HistoryPlugin />
          <AutoFocusPlugin />
          <SuggestionPlugin />
        </LexicalComposer>
      </div>
    </div>
  )
}

export default App
