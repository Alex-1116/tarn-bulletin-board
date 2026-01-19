
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { KanbanBoard } from './features/kanban/components/KanbanBoard'
import './index.css'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background p-8">
        <KanbanBoard />
      </div>
    </QueryClientProvider>
  )
}

export default App
