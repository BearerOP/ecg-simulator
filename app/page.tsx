"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Activity } from "lucide-react"
import { ECGDisplay } from "@/components/ecg-display"
import { ControlsPanel } from "@/components/controls-panel"
import { DemoPatients } from "@/components/demo-patients"
import { WaveParams, CustomBeat, Point, TooltipData, PatientPreset } from "@/lib/interfaces"
import { generateWaveformPoints, pointsToPath } from "@/lib/waveform-utils"

export default function ECGAnimator() {
  const globalCountersRef = useRef({
    beatCounter: 0,
    customIdx: 0,
    waitingNormalBeats: 0,
    rCycleCounter: 0,
    pCycleCounter: 0,
  })

  const [isPlaying, setIsPlaying] = useState(true)
  const [pixelsPerMv, setPixelsPerMv] = useState(100)
  const [tooltip, setTooltip] = useState<TooltipData>({
    voltage: 0,
    time: 0,
    heartRate: 70,
    visible: false,
  })
  const [activePatientTab, setActivePatientTab] = useState("normal")
  const [waveParams, setWaveParams] = useState<WaveParams>({
    heart_rate: 70,
    h_p: 0.15,
    b_p: 0.08,
    h_q: -0.1,
    b_q: 0.025,
    h_r: 1.2,
    b_r: 0.05,
    h_s: -0.25,
    b_s: 0.025,
    h_t: 0.2,
    b_t: 0.16,
    l_pq: 0.08,
    l_st: 0.12,
    l_tp: 0.3,
    n_p: 1,
  })

  const [rWavePattern, setRWavePattern] = useState({
    enabled: false,
    count: 2,
    interval: 5,
  })

  const [pWavePattern, setPWavePattern] = useState({
    enabled: false,
    count: 0,
    interval: 3,
  })

  const [customBeats, setCustomBeats] = useState<CustomBeat[]>([])
  const [useCustomBeats, setUseCustomBeats] = useState(false)
  const [repeatInterval, setRepeatInterval] = useState(10)

  const generateWaveformPointsCallback = useCallback((): Point[] => {
    return generateWaveformPoints(
      waveParams,
      pixelsPerMv,
      rWavePattern,
      pWavePattern,
      customBeats,
      useCustomBeats,
      repeatInterval,
      globalCountersRef,
    )
  }, [waveParams, pixelsPerMv, rWavePattern, pWavePattern, customBeats, useCustomBeats, repeatInterval])

  const pointsToPathCallback = useCallback((pts: (Point | null)[]): string => {
    return pointsToPath(pts)
  }, [])

  const updateTooltip = useCallback(
    (currentPoint: Point, currentTime: number) => {
      const SVG_HEIGHT = 400
      const voltage = (SVG_HEIGHT / 2 - currentPoint.y) / pixelsPerMv

      setTooltip({
        voltage: Math.round(voltage * 1000) / 1000,
        time: Math.round(currentTime * 1000) / 1000,
        heartRate: waveParams.heart_rate,
        visible: true,
      })
    },
    [pixelsPerMv, waveParams.heart_rate],
  )

  const applyChanges = useCallback(() => {
    // This will trigger a re-render with new parameters
  }, [])

  const resetAnimation = useCallback(() => {
    globalCountersRef.current = {
      beatCounter: 0,
      customIdx: 0,
      waitingNormalBeats: 0,
      rCycleCounter: 0,
      pCycleCounter: 0,
    }
    applyChanges()
  }, [applyChanges])

  const togglePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev)
  }, [])

  const loadPatientPreset = useCallback(
    (preset: PatientPreset) => {
      setWaveParams(preset.params)
      if (preset.rWavePattern) {
        setRWavePattern(preset.rWavePattern)
      } else {
        setRWavePattern({ enabled: false, count: 2, interval: 5 })
      }
      if (preset.pWavePattern) {
        setPWavePattern(preset.pWavePattern)
      } else {
        setPWavePattern({ enabled: false, count: 0, interval: 3 })
      }
      if (preset.customBeats) {
        setCustomBeats(preset.customBeats)
        setUseCustomBeats(preset.useCustomBeats || false)
        setRepeatInterval(preset.repeatInterval || 10)
      } else {
        setCustomBeats([])
        setUseCustomBeats(false)
      }

      setTimeout(() => {
        resetAnimation()
      }, 100)
    },
    [resetAnimation],
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* <div className="bg-white/30 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-2 bg-red-100/80 backdrop-blur-sm rounded-full">
              <Activity className="w-6 h-6 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">ECG Waveform Animator</h1>
          </div>
        </div>
      </div> */}

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <ControlsPanel
            isPlaying={isPlaying}
            waveParams={waveParams}
            pixelsPerMv={pixelsPerMv}
            rWavePattern={rWavePattern}
            pWavePattern={pWavePattern}
            customBeats={customBeats}
            useCustomBeats={useCustomBeats}
            repeatInterval={repeatInterval}
            onTogglePlayPause={togglePlayPause}
            onResetAnimation={resetAnimation}
            onWaveParamsChange={setWaveParams}
            onPixelsPerMvChange={setPixelsPerMv}
            onRWavePatternChange={setRWavePattern}
            onPWavePatternChange={setPWavePattern}
            onCustomBeatsChange={setCustomBeats}
            onUseCustomBeatsChange={setUseCustomBeats}
            onRepeatIntervalChange={setRepeatInterval}
            onApplyChanges={applyChanges}
          />

          <div className="lg:col-span-3 space-y-6 sticky top-24 z-40">
            <ECGDisplay
              waveParams={waveParams}
              pixelsPerMv={pixelsPerMv}
              tooltip={tooltip}
              isPlaying={isPlaying}
              generateWaveformPoints={generateWaveformPointsCallback}
              pointsToPath={pointsToPathCallback}
              updateTooltip={updateTooltip}
            />

            <DemoPatients
              activePatientTab={activePatientTab}
              onActivePatientTabChange={setActivePatientTab}
              onLoadPatientPreset={loadPatientPreset}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
