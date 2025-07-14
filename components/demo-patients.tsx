"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Activity, AlertTriangle, Baby, User } from "lucide-react"
import { DemoPatientsProps } from "@/lib/interfaces"
import { PATIENT_PRESETS } from "@/data/patient-presets"

const iconMap = {
  heart: Heart,
  activity: Activity,
  "alert-triangle": AlertTriangle,
  baby: Baby,
  user: User,
}

export function DemoPatients({ activePatientTab, onActivePatientTabChange, onLoadPatientPreset }: DemoPatientsProps) {
  return (
    <div className="relative">
      <Card className="shadow-2xl bg-white/20 backdrop-blur-md border border-white/30">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <div className="w-5 h-5 text-blue-500">👤</div>
            Demo Patients
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activePatientTab} onValueChange={onActivePatientTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6 bg-white/30 backdrop-blur-sm">
              <TabsTrigger value="normal" className="text-xs bg-white/20 data-[state=active]:bg-white/60">
                Normal
              </TabsTrigger>
              <TabsTrigger value="critical" className="text-xs bg-white/20 data-[state=active]:bg-white/60">
                Critical
              </TabsTrigger>
              <TabsTrigger value="abnormal" className="text-xs bg-white/20 data-[state=active]:bg-white/60">
                Abnormal
              </TabsTrigger>
              <TabsTrigger value="infant" className="text-xs bg-white/20 data-[state=active]:bg-white/60">
                Infant
              </TabsTrigger>
              <TabsTrigger value="elderly" className="text-xs bg-white/20 data-[state=active]:bg-white/60">
                Elderly
              </TabsTrigger>
            </TabsList>

            {Object.entries(PATIENT_PRESETS).map(([category, presets]) => (
              <TabsContent key={category} value={category}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {presets.map((preset, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-lg bg-white/30 backdrop-blur-sm hover:bg-white/40 transition-all duration-200 cursor-pointer border-white/40 hover:border-white/60 hover:shadow-lg"
                      onClick={() => onLoadPatientPreset(preset)}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-1 bg-white/40 rounded-full">
                          {(() => {
                            const IconComponent = iconMap[preset.icon as keyof typeof iconMap]
                            return IconComponent ? <IconComponent className="w-4 h-4" /> : null
                          })()}
                        </div>
                        <h4 className="font-medium text-sm">{preset.name}</h4>
                        <Badge variant="outline" className="ml-auto text-xs bg-white/50">
                          {preset.params.heart_rate} BPM
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-600">{preset.description}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
} 