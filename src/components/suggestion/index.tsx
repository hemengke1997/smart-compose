import { SuggestionContext } from '../../contexts/suggestion-context'

export default function Suggestion(props: { as: keyof JSX.IntrinsicElements; className: string }) {
  const { as: Tag, className } = props
  const { suggestion } = SuggestionContext.usePicker(['suggestion'])

  console.log(suggestion, 'suggestion')

  return (
    <Tag spellCheck='false' className={className}>
      {suggestion}
    </Tag>
  )
}
