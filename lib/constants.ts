export const PIXELS_PER_SECOND = 150
export const POINTER_RADIUS = 6
export const ERASE_WIDTH = 12
export const SVG_WIDTH = 1000
export const SVG_HEIGHT = 400

export const DEFAULT_WAVE_PARAMS = {
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
}

export const DEFAULT_R_WAVE_PATTERN = {
  enabled: false,
  count: 2,
  interval: 5,
}

export const DEFAULT_P_WAVE_PATTERN = {
  enabled: false,
  count: 0,
  interval: 3,
}

export const DEFAULT_TOOLTIP_DATA = {
  voltage: 0,
  time: 0,
  heartRate: 70,
  visible: false,
}

export const WAVE_PARAM_CONFIGS = [
  { key: "h_p", label: "P Wave Height (mV)", step: 0.01 },
  { key: "b_p", label: "P Wave Breadth (s)", step: 0.01 },
  { key: "h_q", label: "Q Wave Height (mV)", step: 0.01 },
  { key: "b_q", label: "Q Wave Breadth (s)", step: 0.005 },
  { key: "h_r", label: "R Wave Height (mV)", step: 0.1 },
  { key: "b_r", label: "R Wave Breadth (s)", step: 0.01 },
  { key: "h_s", label: "S Wave Height (mV)", step: 0.01 },
  { key: "b_s", label: "S Wave Breadth (s)", step: 0.005 },
  { key: "h_t", label: "T Wave Height (mV)", step: 0.01 },
  { key: "b_t", label: "T Wave Breadth (s)", step: 0.01 },
  { key: "l_pq", label: "PQ Segment Length (s)", step: 0.01 },
  { key: "l_st", label: "ST Segment Length (s)", step: 0.01 },
  { key: "l_tp", label: "TP Segment Length (s)", step: 0.01 },
  { key: "n_p", label: "P Waves per QRS", step: 1 },
] 