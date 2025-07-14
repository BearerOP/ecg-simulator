import { WaveParams, Point, CustomBeat, GlobalCounters } from "./interfaces"
import { PIXELS_PER_SECOND, SVG_WIDTH, SVG_HEIGHT } from "./constants"

export const raisedCosinePulse = (t: number, h: number, b: number, t0: number): number => {
  if (b === 0 || t < t0 || t > t0 + b) return 0
  return (h / 2) * (1 - Math.cos((2 * Math.PI * (t - t0)) / b))
}

export const generateWaveformPoints = (
  waveParams: WaveParams,
  pixelsPerMv: number,
  rWavePattern: { enabled: boolean; count: number; interval: number },
  pWavePattern: { enabled: boolean; count: number; interval: number },
  customBeats: CustomBeat[],
  useCustomBeats: boolean,
  repeatInterval: number,
  globalCountersRef: React.MutableRefObject<GlobalCounters>,
): Point[] => {
  const totalTime = SVG_WIDTH / PIXELS_PER_SECOND
  const y0 = SVG_HEIGHT / 2
  const pts: Point[] = []
  const dt = 1 / PIXELS_PER_SECOND

  let { beatCounter, customIdx, waitingNormalBeats, rCycleCounter, pCycleCounter } = globalCountersRef.current
  let tElapsed = 0

  while (tElapsed <= totalTime) {
    let currentParams = { ...waveParams }

    if (useCustomBeats && customBeats.length > 0 && waitingNormalBeats === 0) {
      currentParams = { ...currentParams, ...customBeats[customIdx].params }
      customIdx++
      if (customIdx >= customBeats.length) {
        customIdx = 0
        waitingNormalBeats = repeatInterval
      }
    } else if (waitingNormalBeats > 0) {
      waitingNormalBeats--
    }

    let curPCount = currentParams.n_p
    if (pWavePattern.enabled) {
      pCycleCounter++
      if (pWavePattern.interval > 0 && pCycleCounter >= pWavePattern.interval) {
        curPCount = pWavePattern.count
        pCycleCounter = 0
      }
    }

    let curRCount = 1
    if (rWavePattern.enabled) {
      rCycleCounter++
      if (rWavePattern.interval > 0 && rCycleCounter >= rWavePattern.interval) {
        curRCount = rWavePattern.count
        rCycleCounter = 0
      }
    }

    const base =
      curPCount * (currentParams.b_p + currentParams.l_pq) +
      (currentParams.b_q + currentParams.b_r + currentParams.b_s) * (curRCount > 0 ? 1 : 0) +
      currentParams.l_st +
      currentParams.b_t +
      currentParams.l_tp

    const heartPeriod = 60 / (currentParams.heart_rate || 60)
    const sf = heartPeriod / base

    const scaledParams = {
      b_p: currentParams.b_p * sf,
      l_pq: currentParams.l_pq * sf,
      b_q: currentParams.b_q * sf,
      b_r: currentParams.b_r * sf,
      b_s: currentParams.b_s * sf,
      l_st: currentParams.l_st * sf,
      b_t: currentParams.b_t * sf,
      l_tp: currentParams.l_tp * sf,
    }

    const cycleDuration =
      curPCount * (scaledParams.b_p + scaledParams.l_pq) +
      (curRCount > 0 ? scaledParams.b_q + scaledParams.b_r + scaledParams.b_s : 0) +
      scaledParams.l_st +
      scaledParams.b_t +
      scaledParams.l_tp

    let offset = tElapsed
    const times = {
      P: [] as number[],
      Q: 0,
      R: [] as number[],
      S: [] as number[],
      T: 0,
    }

    for (let i = 0; i < curPCount; i++) {
      times.P.push(offset + i * (scaledParams.b_p + scaledParams.l_pq))
    }
    offset += curPCount * (scaledParams.b_p + scaledParams.l_pq)

    if (curRCount > 0) {
      for (let i = 0; i < curRCount; i++) {
        times.Q = offset
        offset += scaledParams.b_q
        times.R.push(offset)
        offset += scaledParams.b_r
        times.S.push(offset)
        offset += scaledParams.b_s
        if (i < curRCount - 1) offset += scaledParams.l_pq / 2
      }
    }
    offset += scaledParams.l_st
    times.T = offset

    const tEnd = tElapsed + cycleDuration

    for (let t = tElapsed; t < tEnd; t += dt) {
      let v = 0

      for (const start of times.P) {
        if (t >= start && t < start + scaledParams.b_p) {
          v = raisedCosinePulse(t, currentParams.h_p, scaledParams.b_p, start)
          break
        }
      }

      if (!v && curRCount > 0 && t >= times.Q && t < times.Q + scaledParams.b_q) {
        v = raisedCosinePulse(t, currentParams.h_q, scaledParams.b_q, times.Q)
      }

      if (!v && curRCount > 0) {
        for (const r of times.R) {
          if (t >= r && t < r + scaledParams.b_r) {
            v = raisedCosinePulse(t, currentParams.h_r, scaledParams.b_r, r)
            break
          }
        }
      }

      if (!v && curRCount > 0) {
        for (const s of times.S) {
          if (t >= s && t < s + scaledParams.b_s) {
            v = raisedCosinePulse(t, currentParams.h_s, scaledParams.b_s, s)
            break
          }
        }
      }

      if (!v && t >= times.T && t < times.T + scaledParams.b_t) {
        v = raisedCosinePulse(t, currentParams.h_t, scaledParams.b_t, times.T)
      }

      pts.push({
        x: t * PIXELS_PER_SECOND,
        y: y0 - v * pixelsPerMv,
      })
    }

    tElapsed += cycleDuration
    beatCounter++
  }

  globalCountersRef.current = {
    beatCounter,
    customIdx,
    waitingNormalBeats,
    rCycleCounter,
    pCycleCounter,
  }

  return pts
}

export const pointsToPath = (pts: (Point | null)[]): string => {
  return pts.reduce((str, p, i) => {
    if (!p) return str
    return str + (i === 0 || !pts[i - 1] ? "M" : " L") + ` ${p.x} ${p.y}`
  }, "")
} 