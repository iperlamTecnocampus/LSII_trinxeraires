import { ArrowsIn, ArrowsOut } from "@phosphor-icons/react"
import { useEffect, useState } from "react"

import { Button } from "@/components/video-player/components/button"
import { usePlayerStore } from "@/hooks/limeplay/use-player"

export function FullscreenControl() {
  const container = usePlayerStore((state) => state.containerRef)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const updateFullscreenState = () => {
      setIsFullscreen(document.fullscreenElement === container)
    }

    document.addEventListener("fullscreenchange", updateFullscreenState)
    return () => {
      document.removeEventListener("fullscreenchange", updateFullscreenState)
    }
  }, [container])

  const toggleFullscreen = async () => {
    if (!container) return

    if (document.fullscreenElement === container) {
      await document.exitFullscreen()
    } else {
      await container.requestFullscreen()
    }
  }

  return (
    <Button
      aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      className="cursor-pointer"
      disabled={!container}
      onClick={() => void toggleFullscreen()}
      size="icon"
      title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      variant="glass"
    >
      {isFullscreen ? <ArrowsIn weight="bold" /> : <ArrowsOut weight="bold" />}
    </Button>
  )
}
