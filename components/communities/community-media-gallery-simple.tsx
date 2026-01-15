'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Images, Video, Grid, List, Upload, Filter, BarChart3, Play, Eye, Heart, Share2, Download } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MediaItem {
  id: string
  type: 'image' | 'video'
  url: string
  thumbnail?: string
  title?: string
  description?: string
  likes?: number
  isLiked?: boolean
  uploadedBy?: string
  uploadedAt?: string
  tags?: string[]
}

interface CommunityMediaGalleryProps {
  communityId: string
  media: MediaItem[]
  canUpload?: boolean
  viewMode?: 'grid' | 'compact' | 'horizontal'
  showFilters?: boolean
  showStats?: boolean
  onUpload?: () => void
  onLike?: (id: string) => void
  onShare?: (item: MediaItem) => void
  onDownload?: (item: MediaItem) => void
}

export function CommunityMediaGallery({
  communityId,
  media,
  canUpload = false,
  viewMode: initialViewMode = 'grid',
  showFilters = true,
  showStats = true,
  onUpload,
  onLike,
  onShare,
  onDownload
}: CommunityMediaGalleryProps) {
  const [viewMode, setViewMode] = useState(initialViewMode)
  const [filterType, setFilterType] = useState<'all' | 'images' | 'videos'>('all')
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'oldest'>('recent')

  // Filter media based on type
  const filteredMedia = media.filter(item => {
    if (filterType === 'all') return true
    if (filterType === 'images') return item.type === 'image'
    if (filterType === 'videos') return item.type === 'video'
    return true
  })

  // Sort media
  const sortedMedia = [...filteredMedia].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.uploadedAt || '').getTime() - new Date(a.uploadedAt || '').getTime()
      case 'popular':
        return (b.likes || 0) - (a.likes || 0)
      case 'oldest':
        return new Date(a.uploadedAt || '').getTime() - new Date(b.uploadedAt || '').getTime()
      default:
        return 0
    }
  })

  const imageCount = media.filter(item => item.type === 'image').length
  const videoCount = media.filter(item => item.type === 'video').length

  // Calculate stats
  const mediaStats = {
    totalImages: imageCount,
    totalVideos: videoCount,
    totalLikes: media.reduce((sum, item) => sum + (item.likes || 0), 0),
    totalViews: media.length * 150,
    totalDownloads: media.length * 45,
    weeklyUploads: Math.floor(media.length * 0.3)
  }

  if (!media || media.length === 0) {
    return (
      <div className="text-center py-12">
        <Images className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No hay medios compartidos
        </h3>
        <p className="text-gray-600 mb-6">
          Sé el primero en compartir fotos y videos en esta comunidad
        </p>
        {canUpload && onUpload && (
          <Button onClick={onUpload} className="gap-2">
            <Upload className="w-4 h-4" />
            Subir medios
          </Button>
        )}
      </div>
    )
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  return (
    <div className="space-y-6">
      {/* Media Stats Widget */}
      {showStats && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-neon-green" />
            <h3 className="text-lg font-semibold text-white">Estadísticas de Medios</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Imágenes</p>
                    <p className="text-2xl font-bold text-white">{formatNumber(mediaStats.totalImages)}</p>
                  </div>
                  <div className="bg-blue-500/20 p-3 rounded-lg">
                    <Images className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Videos</p>
                    <p className="text-2xl font-bold text-white">{formatNumber(mediaStats.totalVideos)}</p>
                  </div>
                  <div className="bg-purple-500/20 p-3 rounded-lg">
                    <Video className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Me gusta</p>
                    <p className="text-2xl font-bold text-white">{formatNumber(mediaStats.totalLikes)}</p>
                  </div>
                  <div className="bg-red-500/20 p-3 rounded-lg">
                    <Heart className="w-6 h-6 text-red-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Vistas</p>
                    <p className="text-2xl font-bold text-white">{formatNumber(mediaStats.totalViews)}</p>
                  </div>
                  <div className="bg-green-500/20 p-3 rounded-lg">
                    <Eye className="w-6 h-6 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Header with stats and controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Images className="w-4 h-4" />
            <span className="text-white">{imageCount} fotos</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Video className="w-4 h-4" />
            <span className="text-white">{videoCount} videos</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {canUpload && onUpload && (
            <Button onClick={onUpload} size="sm" className="gap-2">
              <Upload className="w-4 h-4" />
              Subir
            </Button>
          )}
          
          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-2 rounded-md transition-colors",
                viewMode === 'grid' 
                  ? "bg-white shadow-sm text-blue-600" 
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('compact')}
              className={cn(
                "p-2 rounded-md transition-colors",
                viewMode === 'compact' 
                  ? "bg-white shadow-sm text-blue-600" 
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filtros:</span>
          </div>
          
          {/* Type Filter */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setFilterType('all')}
              className={cn(
                "px-3 py-1 text-sm rounded-md transition-colors",
                filterType === 'all' 
                  ? "bg-white shadow-sm text-blue-600 font-medium" 
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              Todos
            </button>
            <button
              onClick={() => setFilterType('images')}
              className={cn(
                "px-3 py-1 text-sm rounded-md transition-colors",
                filterType === 'images' 
                  ? "bg-white shadow-sm text-blue-600 font-medium" 
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              Fotos
            </button>
            <button
              onClick={() => setFilterType('videos')}
              className={cn(
                "px-3 py-1 text-sm rounded-md transition-colors",
                filterType === 'videos' 
                  ? "bg-white shadow-sm text-blue-600 font-medium" 
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              Videos
            </button>
          </div>

          {/* Sort Filter */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="recent">Más recientes</option>
            <option value="popular">Más populares</option>
            <option value="oldest">Más antiguos</option>
          </select>
        </div>
      )}

      {/* Gallery Grid */}
      <div className={cn(
        "grid gap-4",
        viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
      )}>
        {sortedMedia.map((item, index) => (
          <div
            key={item.id}
            className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
          >
            <Image
              src={item.thumbnail || item.url}
              alt={item.title || `Media ${index + 1}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            
            {item.type === 'video' && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <Play className="w-12 h-12 text-white opacity-80" />
              </div>
            )}
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-2 left-2 right-2">
                {item.title && (
                  <p className="text-white text-sm font-medium truncate">
                    {item.title}
                  </p>
                )}
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-white" />
                    <span className="text-white text-xs">{item.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {onLike && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onLike(item.id)
                        }}
                        className="p-1 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                      >
                        <Heart className={cn("w-3 h-3", item.isLiked && "fill-current text-red-500")} />
                      </button>
                    )}
                    {onShare && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onShare(item)
                        }}
                        className="p-1 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                      >
                        <Share2 className="w-3 h-3" />
                      </button>
                    )}
                    {onDownload && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onDownload(item)
                        }}
                        className="p-1 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                      >
                        <Download className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {sortedMedia.length > 0 && (
        <div className="text-center pt-6">
          <Button variant="outline" className="gap-2">
            Cargar más medios
          </Button>
        </div>
      )}
    </div>
  )
}