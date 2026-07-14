import { useState, useCallback, useMemo } from 'react'
import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Sidebar from '../../components/dashboard/Sidebar.jsx'
import Topbar from '../../components/dashboard/Topbar.jsx'
import MasonryGrid from '../../components/dashboard/MasonryGrid.jsx'
import SaveComposer from '../../components/dashboard/SaveComposer.jsx'
import DetailPanel from '../../components/dashboard/DetailPanel.jsx'
import NoCreditsModal from '../../components/ui/NoCreditsModal.jsx'
import useAuthStore from '../../store/authStore.js'
import { fetchItems, searchItems as searchItemsApi, createItem, deleteItem, uploadImage } from '../../api/items.js'
import { getMeApi } from '../../api/auth.js'

export default function Dashboard() {
  const queryClient = useQueryClient()
  const { setCredits } = useAuthStore()

  const [activeType, setActiveType] = useState('')
  const [activeTag, setActiveTag] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isComposerOpen, setIsComposerOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [noCredits, setNoCredits] = useState(false)

  useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const data = await getMeApi()
      setCredits(data.user.credits)
      return data
    },
    refetchOnWindowFocus: true,
    staleTime: 30000,
  })

  const itemsQuery = useInfiniteQuery({
    queryKey: ['items', activeType, activeTag],
    queryFn: ({ pageParam = undefined }) =>
      fetchItems({ cursor: pageParam, type: activeType || undefined, tag: activeTag || undefined }),
    initialPageParam: undefined,
    getNextPageParam: (last) => last.nextCursor || undefined,
    enabled: !searchQuery,
  })

  const searchResultsQuery = useQuery({
    queryKey: ['search', searchQuery],
    queryFn: () => searchItemsApi(searchQuery),
    enabled: !!searchQuery,
  })

  const saveMutation = useMutation({
    mutationFn: async ({ type, url, content, title, imageFile, spaceId }) => {
      if (type === 'image') {
        const { url: uploadedUrl } = await uploadImage(imageFile)
        return createItem({ type, thumbnailUrl: uploadedUrl, title, spaceId })
      }
      if (type === 'link') return createItem({ type, url, spaceId })
      return createItem({ type, content, title, spaceId })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] })
      queryClient.invalidateQueries({ queryKey: ['me'] })
      setIsComposerOpen(false)
    },
    onError: (err) => {
      if (err?.response?.status === 402) {
        setIsComposerOpen(false)
        setNoCredits(true)
        setCredits(0)
      }
    },
  })

  const deleteMutation = useMutation({
    mutationFn: id => deleteItem(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['items'] })
      await queryClient.cancelQueries({ queryKey: ['search'] })
      const previousItems = queryClient.getQueriesData({ queryKey: ['items'] })
      const previousSearch = queryClient.getQueriesData({ queryKey: ['search'] })
      queryClient.setQueriesData({ queryKey: ['items'] }, (old) => {
        if (!old) return old
        return { ...old, pages: old.pages.map(p => ({ ...p, items: p.items.filter(i => i._id !== id) })) }
      })
      queryClient.setQueriesData({ queryKey: ['search'] }, (old) => {
        if (!old) return old
        return { ...old, items: old.items.filter(i => i._id !== id) }
      })
      return { previousItems, previousSearch }
    },
    onError: (err, id, ctx) => {
      ctx?.previousItems?.forEach(([k, d]) => queryClient.setQueryData(k, d))
      ctx?.previousSearch?.forEach(([k, d]) => queryClient.setQueryData(k, d))
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] })
      queryClient.invalidateQueries({ queryKey: ['search'] })
    },
  })

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['items'] })
    queryClient.invalidateQueries({ queryKey: ['search'] })
  }, [queryClient])

  const isSearching = !!searchQuery
  const allPages = itemsQuery.data?.pages.flatMap(p => p.items) || []
  const displayedItems = isSearching ? searchResultsQuery.data?.items || [] : allPages
  const isLoading = isSearching ? searchResultsQuery.isLoading : itemsQuery.isLoading

  const allTags = useMemo(() => {
    const tagSet = new Set()
    allPages.forEach(item => item.tags?.forEach(t => tagSet.add(t)))
    return Array.from(tagSet).sort()
  }, [allPages])

  function handleTypeChange(val) {
    setActiveType(val)
    setActiveTag('')
    setSearchQuery('')
    queryClient.removeQueries({ queryKey: ['items'] })
  }

  function handleTagChange(val) {
    setActiveTag(val)
    setActiveType('')
    setSearchQuery('')
    queryClient.removeQueries({ queryKey: ['items'] })
  }

  return (
    <div className="min-h-screen bg-paper relative">
      {/* ambient lighting gradient — fixed, sits behind everything */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 900px 500px at 12% -8%, rgba(46,91,255,0.09), transparent 60%), ' +
            'radial-gradient(ellipse 700px 550px at 100% 5%, rgba(124,58,237,0.06), transparent 55%), ' +
            'radial-gradient(ellipse 600px 400px at 50% 100%, rgba(56,189,248,0.05), transparent 60%)',
        }}
      />
      {/* dotted grid overlay */}
      <div className="pointer-events-none fixed inset-0 z-0 corpus-dot-grid opacity-70" />

      <div className="flex relative z-10">
        <Sidebar
          activeType={activeType}
          onTypeChange={handleTypeChange}
          activeTag={activeTag}
          onTagChange={handleTagChange}
        />

        <div className="flex-1 min-w-0">
          <Topbar
            onSearch={useCallback(q => setSearchQuery(q), [])}
            onClearSearch={useCallback(() => setSearchQuery(''), [])}
            onOpenComposer={() => setIsComposerOpen(true)}
            allTags={allTags}
            activeTag={activeTag}
            onTagChange={handleTagChange}
          />

          <main className="px-5 md:px-8 py-6">
            {isSearching && (
              <p className="font-mono text-[11px] uppercase tracking-wider text-muted mb-4">
                {displayedItems.length} result{displayedItems.length !== 1 ? 's' : ''} for "{searchQuery}"
              </p>
            )}
            <MasonryGrid
              items={displayedItems}
              onCardClick={setSelectedItem}
              onDelete={id => deleteMutation.mutate(id)}
              onLoadMore={() => itemsQuery.fetchNextPage()}
              hasMore={!isSearching && itemsQuery.hasNextPage}
              isLoading={isLoading}
            />
          </main>
        </div>
      </div>

      <SaveComposer
        isOpen={isComposerOpen}
        onClose={() => setIsComposerOpen(false)}
        onSave={payload => saveMutation.mutateAsync(payload)}
        isSaving={saveMutation.isPending}
      />

      {selectedItem && (
        <DetailPanel
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onDelete={(id) => { deleteMutation.mutate(id); setSelectedItem(null) }}
          onUpdate={invalidate}
        />
      )}

      <NoCreditsModal isOpen={noCredits} onClose={() => setNoCredits(false)} />
    </div>
  )
}
