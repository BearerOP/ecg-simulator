"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, RotateCcw, Plus, Trash2, Heart } from "lucide-react"
import { ControlsPanelProps, CustomBeat, WaveParams } from "@/lib/interfaces"
import { WAVE_PARAM_CONFIGS } from "@/lib/constants"

export function ControlsPanel({
  isPlaying,
  waveParams,
  pixelsPerMv,
  rWavePattern,
  pWavePattern,
  customBeats,
  useCustomBeats,
  repeatInterval,
  onTogglePlayPause,
  onResetAnimation,
  onWaveParamsChange,
  onPixelsPerMvChange,
  onRWavePatternChange,
  onPWavePatternChange,
  onCustomBeatsChange,
  onUseCustomBeatsChange,
  onRepeatIntervalChange,
  onApplyChanges,
}: ControlsPanelProps) {
  const addCustomBeat = () => {
    const newBeat: CustomBeat = {
      id: Date.now().toString(),
      params: { ...waveParams },
    }
    onCustomBeatsChange([...customBeats, newBeat])
  }

  const removeCustomBeat = (id: string) => {
    onCustomBeatsChange(customBeats.filter((beat) => beat.id !== id))
  }

  return (
    <div className="lg:col-span-1 space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar">
      <Card className="shadow-xl bg-white/20 backdrop-blur-md border border-white/30">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Heart className="w-4 h-4 text-red-500" />
            Playback Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Button
              onClick={onTogglePlayPause}
              className="flex-1 transition-all duration-200 hover:scale-105 text-xs"
              variant={isPlaying ? "destructive" : "default"}
              size="sm"
            >
              {isPlaying ? <Pause className="w-3 h-3 mr-1" /> : <Play className="w-3 h-3 mr-1" />}
              {isPlaying ? "Pause" : "Play"}
            </Button>
            <Button
              onClick={onResetAnimation}
              variant="outline"
              size="sm"
              className="transition-all duration-200 hover:scale-105 bg-white/50 backdrop-blur-sm"
            >
              <RotateCcw className="w-3 h-3" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="animate-pulse text-xs">
              {waveParams.heart_rate} BPM
            </Badge>
            <Badge variant="outline" className="text-xs bg-white/50">
              {pixelsPerMv} px/mV
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-xl bg-white/20 backdrop-blur-md border border-white/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Basic Parameters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="heart_rate" className="text-xs">
              Heart Rate (BPM)
            </Label>
            <Input
              id="heart_rate"
              type="number"
              value={waveParams.heart_rate}
              onChange={(e) =>
                onWaveParamsChange({ ...waveParams, heart_rate: Number.parseFloat(e.target.value) })
              }
              min="20"
              max="250"
              className="transition-all duration-200 focus:ring-2 focus:ring-red-500 bg-white/50 backdrop-blur-sm text-xs h-8"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pixelsPerMv" className="text-xs">
              Pixels per mV
            </Label>
            <Input
              id="pixelsPerMv"
              type="number"
              value={pixelsPerMv}
              onChange={(e) => onPixelsPerMvChange(Number.parseFloat(e.target.value))}
              min="10"
              step="10"
              className="transition-all duration-200 focus:ring-2 focus:ring-red-500 bg-white/50 backdrop-blur-sm text-xs h-8"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-xl bg-white/20 backdrop-blur-md border border-white/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Wave Parameters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
          {WAVE_PARAM_CONFIGS.map(({ key, label, step }) => (
            <div key={key} className="space-y-1">
              <Label htmlFor={key} className="text-xs">
                {label}
              </Label>
              <Input
                id={key}
                type="number"
                value={waveParams[key as keyof WaveParams]}
                onChange={(e) =>
                  onWaveParamsChange({
                    ...waveParams,
                    [key]: key === "n_p" ? Number.parseInt(e.target.value) : Number.parseFloat(e.target.value),
                  })
                }
                step={step}
                className="transition-all duration-200 focus:ring-2 focus:ring-red-500 bg-white/50 backdrop-blur-sm text-xs h-7"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="shadow-xl bg-white/20 backdrop-blur-md border border-white/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Dynamic Patterns</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="rWaveEnabled"
                checked={rWavePattern.enabled}
                onCheckedChange={(checked) => onRWavePatternChange({ ...rWavePattern, enabled: !!checked })}
              />
              <Label htmlFor="rWaveEnabled" className="text-xs font-medium">
                R Wave Pattern
              </Label>
            </div>
            {rWavePattern.enabled && (
              <div className="grid grid-cols-2 gap-2 pl-4">
                <div className="space-y-1">
                  <Label className="text-xs">R Waves Count</Label>
                  <Input
                    type="number"
                    value={rWavePattern.count}
                    onChange={(e) =>
                      onRWavePatternChange({ ...rWavePattern, count: Number.parseInt(e.target.value) })
                    }
                    min="0"
                    className="transition-all duration-200 bg-white/50 backdrop-blur-sm text-xs h-7"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Apply After N QRS</Label>
                  <Input
                    type="number"
                    value={rWavePattern.interval}
                    onChange={(e) =>
                      onRWavePatternChange({ ...rWavePattern, interval: Number.parseInt(e.target.value) })
                    }
                    min="0"
                    className="transition-all duration-200 bg-white/50 backdrop-blur-sm text-xs h-7"
                  />
                </div>
              </div>
            )}
          </div>

          <Separator className="bg-white/30" />

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="pWaveEnabled"
                checked={pWavePattern.enabled}
                onCheckedChange={(checked) => onPWavePatternChange({ ...pWavePattern, enabled: !!checked })}
              />
              <Label htmlFor="pWaveEnabled" className="text-xs font-medium">
                P Wave Pattern
              </Label>
            </div>
            {pWavePattern.enabled && (
              <div className="grid grid-cols-2 gap-2 pl-4">
                <div className="space-y-1">
                  <Label className="text-xs">P Waves Count</Label>
                  <Input
                    type="number"
                    value={pWavePattern.count}
                    onChange={(e) =>
                      onPWavePatternChange({ ...pWavePattern, count: Number.parseInt(e.target.value) })
                    }
                    min="0"
                    className="transition-all duration-200 bg-white/50 backdrop-blur-sm text-xs h-7"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Apply After N QRS</Label>
                  <Input
                    type="number"
                    value={pWavePattern.interval}
                    onChange={(e) =>
                      onPWavePatternChange({ ...pWavePattern, interval: Number.parseInt(e.target.value) })
                    }
                    min="0"
                    className="transition-all duration-200 bg-white/50 backdrop-blur-sm text-xs h-7"
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-xl bg-white/20 backdrop-blur-md border border-white/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Custom Beat Sequence</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="useCustomBeats"
              checked={useCustomBeats}
              onCheckedChange={(checked) => onUseCustomBeatsChange(!!checked)}
            />
            <Label htmlFor="useCustomBeats" className="text-xs font-medium">
              Enable Custom Beats
            </Label>
          </div>

          {useCustomBeats && (
            <>
              <div className="space-y-1">
                <Label className="text-xs">Normal Beats Before Repeat</Label>
                <Input
                  type="number"
                  value={repeatInterval}
                  onChange={(e) => onRepeatIntervalChange(Number.parseInt(e.target.value))}
                  min="0"
                  className="transition-all duration-200 bg-white/50 backdrop-blur-sm text-xs h-7"
                />
              </div>

              <div className="space-y-2">
                {customBeats.map((beat, index) => (
                  <div key={beat.id} className="p-2 border rounded-lg bg-white/30 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-1">
                      <Badge variant="outline" className="text-xs bg-white/50">
                        Beat {index + 1}
                      </Badge>
                      <Button
                        onClick={() => removeCustomBeat(beat.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 h-6 w-6 p-0"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      {Object.entries(beat.params)
                        .slice(0, 4)
                        .map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-slate-600">{key}:</span>
                            <span className="font-mono">{value}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>

              <Button
                onClick={addCustomBeat}
                variant="outline"
                size="sm"
                className="w-full transition-all duration-200 hover:scale-105 bg-white/50 backdrop-blur-sm text-xs"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add Custom Beat
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <Button
        onClick={onApplyChanges}
        className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-200 hover:scale-105 shadow-lg text-xs"
        size="sm"
      >
        Apply Changes
      </Button>
    </div>
  )
} 