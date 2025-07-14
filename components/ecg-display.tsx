"use client"

import { useRef, useCallback, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity } from "lucide-react"
import { ECGDisplayProps, Point } from "@/lib/interfaces"
import { POINTER_RADIUS, SVG_WIDTH, SVG_HEIGHT } from "@/lib/constants"

export function ECGDisplay({
  waveParams,
  pixelsPerMv,
  tooltip,
  isPlaying,
  generateWaveformPoints,
  pointsToPath,
  updateTooltip,
}: ECGDisplayProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const animationRef = useRef<number | undefined>()
  const lastTimestampRef = useRef<number>(0)
  const pointerXRef = useRef<number>(0)
  const firstSweepRef = useRef<boolean>(true)
  const pathPointsRef = useRef<Point[]>([])
  const drawnPointsRef = useRef<(Point | null)[]>([])

  const drawGrid = useCallback(() => {
    const svg = svgRef.current
    if (!svg) return

    const existingGrid = svg.querySelector(".grid-group")
    if (existingGrid) existingGrid.remove()

    const gridGroup = document.createElementNS("http://www.w3.org/2000/svg", "g")
    gridGroup.setAttribute("class", "grid-group")

    const smallGrid = 8
    const largeGrid = smallGrid * 5

    for (let x = 0; x <= SVG_WIDTH; x += smallGrid) {
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line")
      line.setAttribute("x1", x.toString())
      line.setAttribute("y1", "0")
      line.setAttribute("x2", x.toString())
      line.setAttribute("y2", SVG_HEIGHT.toString())
      line.setAttribute("stroke", x % largeGrid === 0 ? "#ddd" : "#f0f0f0")
      line.setAttribute("stroke-width", x % largeGrid === 0 ? "1" : "0.5")
      gridGroup.appendChild(line)
    }

    for (let y = 0; y <= SVG_HEIGHT; y += smallGrid) {
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line")
      line.setAttribute("x1", "0")
      line.setAttribute("y1", y.toString())
      line.setAttribute("x2", SVG_WIDTH.toString())
      line.setAttribute("y2", y.toString())
      line.setAttribute("stroke", y % largeGrid === 0 ? "#ddd" : "#f0f0f0")
      line.setAttribute("stroke-width", y % largeGrid === 0 ? "1" : "0.5")
      gridGroup.appendChild(line)
    }

    svg.appendChild(gridGroup)
  }, [])

  const initializeSVG = useCallback(() => {
    const svg = svgRef.current
    if (!svg) return

    drawGrid()

    const existingPath = svg.querySelector(".waveform-path")
    const existingPointer = svg.querySelector(".pointer-head")
    if (existingPath) existingPath.remove()
    if (existingPointer) existingPointer.remove()

    const waveformPath = document.createElementNS("http://www.w3.org/2000/svg", "path")
    waveformPath.setAttribute("class", "waveform-path")
    waveformPath.setAttribute("stroke", "#ef4444")
    waveformPath.setAttribute("fill", "none")
    waveformPath.setAttribute("stroke-width", "2")
    waveformPath.setAttribute("stroke-linecap", "round")
    waveformPath.setAttribute("stroke-linejoin", "round")
    svg.appendChild(waveformPath)

    const pointerHead = document.createElementNS("http://www.w3.org/2000/svg", "circle")
    pointerHead.setAttribute("class", "pointer-head")
    pointerHead.setAttribute("r", POINTER_RADIUS.toString())
    pointerHead.setAttribute("fill", "#ef4444")
    pointerHead.setAttribute("stroke", "#fff")
    pointerHead.setAttribute("stroke-width", "2")
    pointerHead.setAttribute("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.2))")
    svg.appendChild(pointerHead)
  }, [drawGrid])

  const animationLoop = useCallback(
    (timestamp: number) => {
      if (!isPlaying) return

      const svg = svgRef.current
      if (!svg) return

      const dt = lastTimestampRef.current ? (timestamp - lastTimestampRef.current) / 1000 : 0
      lastTimestampRef.current = timestamp
      pointerXRef.current += 150 * dt

      const pathPoints = pathPointsRef.current
      const drawnPoints = drawnPointsRef.current

      let idx = pathPoints.findIndex((pt) => pt.x >= pointerXRef.current)
      if (idx < 0) idx = pathPoints.length - 1

      const waveformPath = svg.querySelector(".waveform-path") as SVGPathElement
      const pointerHead = svg.querySelector(".pointer-head") as SVGCircleElement

      if (firstSweepRef.current) {
        drawnPointsRef.current = pathPoints.slice(0, idx + 1).map((p) => p)
        if (waveformPath) {
          waveformPath.setAttribute("d", pointsToPath(drawnPointsRef.current))
        }
        if (pointerXRef.current > SVG_WIDTH) {
          firstSweepRef.current = false
        }
      } else {
        if (pointerXRef.current > SVG_WIDTH) {
          pointerXRef.current = 0
          pathPointsRef.current = generateWaveformPoints()
        }

        const eraseStart = pointerXRef.current - 6
        const eraseEnd = pointerXRef.current + 6
        const startIdx = drawnPoints.findIndex((pt) => pt && pt.x >= eraseStart)
        const endIdx = drawnPoints.findIndex((pt) => pt && pt.x > eraseEnd)

        for (let i = startIdx < 0 ? 0 : startIdx; i < (endIdx < 0 ? drawnPoints.length : endIdx); i++) {
          drawnPointsRef.current[i] = pathPoints[i]
        }

        if (waveformPath) {
          waveformPath.setAttribute("d", pointsToPath(drawnPointsRef.current))
        }
      }

      const currentPoint = pathPoints[idx]
      if (currentPoint && pointerHead) {
        pointerHead.setAttribute("cx", currentPoint.x.toString())
        pointerHead.setAttribute("cy", currentPoint.y.toString())

        const currentTime = pointerXRef.current / 150
        updateTooltip(currentPoint, currentTime)
      }

      animationRef.current = requestAnimationFrame(animationLoop)
    },
    [isPlaying, generateWaveformPoints, pointsToPath, updateTooltip],
  )

  useEffect(() => {
    initializeSVG()
    pathPointsRef.current = generateWaveformPoints()
    drawnPointsRef.current = Array(pathPointsRef.current.length).fill(null)

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animationLoop)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [initializeSVG, generateWaveformPoints, animationLoop, isPlaying])

  return (
    <div>
      <Card className="shadow-2xl bg-white/20 backdrop-blur-md border border-white/30">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-sm">
            <span>ECG Waveform Display</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-slate-600">Live</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative bg-white/80 backdrop-blur-sm rounded-lg border border-white/40 overflow-hidden">
            <svg
              ref={svgRef}
              width={SVG_WIDTH}
              height={SVG_HEIGHT}
              className="w-full h-auto"
              viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
              style={{ background: "linear-gradient(135deg, #fefefe 0%, #f8f9fa 100%)" }}
            />

            {tooltip.visible && (
              <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm text-white text-xs rounded-lg px-3 py-2 shadow-lg border border-white/20">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Activity className="w-3 h-3" />
                    <span className="font-medium text-xs">Live ECG Data</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-gray-300">Voltage:</span>
                      <span className="ml-1 font-mono text-green-400">{tooltip.voltage} mV</span>
                    </div>
                    <div>
                      <span className="text-gray-300">Time:</span>
                      <span className="ml-1 font-mono text-blue-400">{tooltip.time} s</span>
                    </div>
                    <div>
                      <span className="text-gray-300">HR:</span>
                      <span className="ml-1 font-mono text-red-400">{tooltip.heartRate} BPM</span>
                    </div>
                    <div>
                      <span className="text-gray-300">Scale:</span>
                      <span className="ml-1 font-mono text-yellow-400">{pixelsPerMv} px/mV</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm rounded-lg px-2 py-1 shadow-lg border border-white/40">
              <div className="text-xs text-slate-600 space-y-0.5">
                <div>Speed: 150 px/s</div>
                <div>Scale: {pixelsPerMv} px/mV</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 