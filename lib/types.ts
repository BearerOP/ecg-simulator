export type { 
  WaveParams, 
  CustomBeat, 
  Point, 
  TooltipData, 
  PatientPreset,
  WavePattern,
  GlobalCounters,
  ECGDisplayProps,
  ControlsPanelProps,
  DemoPatientsProps
} from "./interfaces"

export type WaveParamKey = keyof WaveParams
export type WaveParamConfig = {
  key: WaveParamKey
  label: string
  step: number
} 