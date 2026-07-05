import { useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useInfiniteQuery, useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from '../../components/dashboard/Sidebar.jsx'
import MasonryGrid from '../../components/dashboard/MasonryGrid.jsx'
import DetailPanel from '../../components/dashboard/DetailPanel.jsx'
import { fetchItems, deleteItem } from '../../api/items.js'
import { fetchSpace, updateSpace, deleteSpace } from '../../api/spaces.js'
import ColorPicker from '../../components/spaces/ColorPicker.jsx'

export default function SpaceDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [selectedItem, setSelectedItem] = useState(null)
  const [showSettings, setShowSettings] = useState(false)

  const { data: spaceData } = useQuery({
    queryKey: ['space', id],
    queryFn: () => fetchSpace(id),
  })
  const space = spaceData?.space

  const itemsQuery = useInfiniteQuery({
    queryKey: ['items', 'space', id],
    queryFn: ({ pageParam }) => fetchItems({ cursor: pageParam, spaceId: id }),
    getNextPageParam: last => last.nextCursor || undefined,
  })

  const deleteMutation = useMutation({
    mutationFn: itemId => deleteItem(itemId),
    onMutate: async (itemId) => {
      await queryClient.cancelQueries({ queryKey: ['items', 'space', id] })
      const previous = queryClient.getQueryData(['items', 'space', id])
      queryClient.setQueryData(['items', 'space', id], (old) => {
        if (!old) return old
        return { ...old, pages: old.pages.map(p => ({ ...p, items: p.items.filter(i => i._id !== itemId) })) }
      })
      return { previous }
    },
    onError: (err, itemId, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(['items', 'space', id], ctx.previous)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['items', 'space', id] }),
  })

  const updateColorMutation = useMutation({
    mutationFn: (color) => updateSpace(id, { color }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['space', id] }),
  })

  const deleteSpaceMutation = useMutation({
    mutationFn: () => deleteSpace(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spaces'] })
      navigate('/spaces')
    },
  })

  const items = itemsQuery.data?.pages.flatMap(p => p.items) || []

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['items', 'space', id] })
  }, [queryClient, id])

  function handleDeleteSpace() {
    if (!confirm(`Delete "${space?.name}"? Items inside will stay in your archive.`)) return
    deleteSpaceMutation.mutate()
  }

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
        <div className="px-6 md:px-10 py-8 border-b border-line flex items-center justify-between relative">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/spaces')} className="font-mono text-[12px] text-muted hover:text-ink">←</button>
            <span className="w-3 h-3 rounded-full border-2" style={{ borderColor: space?.color || '#2E5BFF' }} />
            <h1 className="font-serif italic text-[28px] text-ink">{space?.name || '…'}</h1>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowSettings(s => !s)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F0EFE9] transition-colors text-muted"
            >
              ⌄
            </button>
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="absolute right-0 top-10 bg-white border border-line rounded-md shadow-lg p-4 w-60 z-20"
                >
                  <p className="font-mono text-[10px] uppercase tracking-wider text-muted mb-2">Change color</p>
                  <ColorPicker value={space?.color} onChange={c => updateColorMutation.mutate(c)} />
                  <button
                    onClick={handleDeleteSpace}
                    className="w-full mt-4 font-mono text-[11px] uppercase tracking-wide text-white bg-red-600 hover:bg-red-700 py-2 rounded-full transition-colors"
                  >
                    Delete Space
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <main className="px-6 md:px-10 py-8">
          {!itemsQuery.isLoading && items.length === 0 ? (
            <div className="py-24 text-center">
              <p className="font-serif italic text-[20px] mb-2">This space is empty.</p>
              <p className="text-[14px] text-muted">
                Add items to this space from the save dialog or the detail panel.
              </p>
            </div>
          ) : (
            <MasonryGrid
              items={items}
              onCardClick={setSelectedItem}
              onDelete={itemId => deleteMutation.mutate(itemId)}
              onLoadMore={() => itemsQuery.fetchNextPage()}
              hasMore={itemsQuery.hasNextPage}
              isLoading={itemsQuery.isLoading}
            />
          )}
        </main>
      </div>

      {selectedItem && (
        <DetailPanel
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onDelete={(itemId) => { deleteMutation.mutate(itemId); setSelectedItem(null) }}
          onUpdate={invalidate}
        />
      )}
    </div>
  )
}
