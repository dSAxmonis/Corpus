import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/dashboard/Sidebar.jsx'
import SpaceCard from '../../components/spaces/SpaceCard.jsx'
import CreateSpaceModal from '../../components/spaces/CreateSpaceModal.jsx'
import { fetchSpaces, createSpace } from '../../api/spaces.js'

export default function SpacesPage() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['spaces'],
    queryFn: fetchSpaces,
  })

  const createMutation = useMutation({
    mutationFn: createSpace,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['spaces'] }),
  })

  const spaces = data?.spaces || []

  return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar
        activeType=""
        onTypeChange={() => navigate('/dashboard')}
        activeTag=""
        onTagChange={() => navigate('/dashboard')}
        allTags={[]}
      />

      <div className="flex-1 min-w-0">
        <div className="px-6 md:px-10 py-8 border-b border-line flex items-center justify-between">
          <h1 className="font-serif italic text-[32px] text-ink">All Spaces</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="font-mono text-[11px] uppercase tracking-wide bg-white border border-line px-4 py-2.5 rounded-full hover:border-ink/40 transition-colors flex items-center gap-2"
          >
            <span className="w-2.5 h-2.5 rounded-full border-2 border-accent" />
            Create a new space
          </button>
        </div>

        <div className="px-6 md:px-10 py-10">
          {isLoading ? (
            <p className="font-mono text-[11px] text-muted uppercase tracking-wider">loading…</p>
          ) : spaces.length === 0 ? (
            <div className="py-20 text-center">
              <p className="font-serif text-[20px] mb-2">No spaces yet.</p>
              <p className="text-[14px] text-muted mb-6">Create one to start organizing your archive.</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="font-mono text-[12px] uppercase tracking-wide bg-ink text-paper px-5 py-2.5 rounded-full hover:bg-accent transition-colors"
              >
                Create a space
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-10">
              {spaces.map(space => (
                <SpaceCard key={space._id} space={space} />
              ))}
            </div>
          )}
        </div>
      </div>

      <CreateSpaceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={payload => createMutation.mutateAsync(payload)}
      />
    </div>
  )
}
