'use client'

import AppLayout from '@/components/layout/AppLayout'
import AppGuard from '@/components/auth/AppGuard'
import SwipeList from '@/components/feed/SwipeList'

export default function SwipesPage() {
  return (
    <AppGuard>
      <AppLayout>
        <SwipeList limit={20} />
      </AppLayout>
    </AppGuard>
  )
}
