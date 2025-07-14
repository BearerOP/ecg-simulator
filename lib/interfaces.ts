import type React from "react"

export interface WaveParams {
  heart_rate: number
  h_p: number
  b_p: number
  h_q: number
  b_q: number
  h_r: number
  b_r: number
  h_s: number
  b_s: number
  h_t: number
  b_t: number
  l_pq: number
  l_st: number
  l_tp: number
  n_p: number
}

export interface CustomBeat {
  id: string
  params: Partial<WaveParams>
}

export interface Point {
  x: number
  y: number
}

export interface TooltipData {
  voltage: number
  time: number
  heartRate: number
  visible: boolean
}

export interface PatientPreset {
  name: string
  description: string
  icon: string
  params: WaveParams
  rWavePattern?: { enabled: boolean; count: number; interval: number }
  pWavePattern?: { enabled: boolean; count: number; interval: number }
  customBeats?: CustomBeat[]
  useCustomBeats?: boolean
  repeatInterval?: number
}

export interface WavePattern {
  enabled: boolean
  count: number
  interval: number
}

export interface GlobalCounters {
  beatCounter: number
  customIdx: number
  waitingNormalBeats: number
  rCycleCounter: number
  pCycleCounter: number
}

export interface ECGDisplayProps {
  waveParams: WaveParams
  pixelsPerMv: number
  tooltip: TooltipData
  isPlaying: boolean
  generateWaveformPoints: () => Point[]
  pointsToPath: (pts: (Point | null)[]) => string
  updateTooltip: (currentPoint: Point, currentTime: number) => void
}

export interface ControlsPanelProps {
  isPlaying: boolean
  waveParams: WaveParams
  pixelsPerMv: number
  rWavePattern: WavePattern
  pWavePattern: WavePattern
  customBeats: CustomBeat[]
  useCustomBeats: boolean
  repeatInterval: number
  onTogglePlayPause: () => void
  onResetAnimation: () => void
  onWaveParamsChange: (params: WaveParams) => void
  onPixelsPerMvChange: (value: number) => void
  onRWavePatternChange: (pattern: WavePattern) => void
  onPWavePatternChange: (pattern: WavePattern) => void
  onCustomBeatsChange: (beats: CustomBeat[]) => void
  onUseCustomBeatsChange: (enabled: boolean) => void
  onRepeatIntervalChange: (interval: number) => void
  onApplyChanges: () => void
}

export interface DemoPatientsProps {
  activePatientTab: string
  onActivePatientTabChange: (value: string) => void
  onLoadPatientPreset: (preset: PatientPreset) => void
} 