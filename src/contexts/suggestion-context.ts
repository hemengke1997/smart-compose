import { useState } from 'react'
import { createContainer } from 'context-state'

function useSuggestionContext() {
  const [suggestion, setSuggestion] = useState<string | null>(null)

  return {
    suggestion,
    setSuggestion,
  }
}

export const SuggestionContext = createContainer(useSuggestionContext)
