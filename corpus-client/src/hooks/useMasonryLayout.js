import { useMemo } from 'react'

export function useMasonryLayout(items, columnCount, gap = 16) {
  return useMemo(() => {
    const columnHeights = new Array(columnCount).fill(0)
    const positions = []

    items.forEach((item, index) => {
      // Find the shortest column
      let shortestColumnIndex = 0
      let minHeight = columnHeights[0]

      for (let i = 1; i < columnCount; i++) {
        if (columnHeights[i] < minHeight) {
          minHeight = columnHeights[i]
          shortestColumnIndex = i
        }
      }

      // Calculate position
      // Note: This calculates relative to the grid container.
      // x is based on the column index and the gap.
      // Since we don't know the exact column width yet (it's responsive),
      // we return the column index and the y-offset.
      const xPercent = (shortestColumnIndex * (100 / columnCount))
      const y = columnHeights[shortestColumnIndex]

      positions.push({
        index,
        column: shortestColumnIndex,
        xPercent,
        y,
      })

      // Update column height.
      // Since we use virtualization, we might not have the height yet.
      // We'll use an estimate (e.g., 300px) initially.
      columnHeights[shortestColumnIndex] += 300 + gap
    })

    return {
      positions,
      totalHeight: Math.max(...columnHeights),
    }
  }, [items, columnCount, gap])
}
