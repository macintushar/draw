import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/page/$id')({
  component: () => <div>Hello /_authenticated/page/$id!</div>
})