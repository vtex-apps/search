declare module 'debounce' {
  export default function (fn: () => void, delayms: number): () => void
}
