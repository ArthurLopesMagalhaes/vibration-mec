"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TwoDegreesOfFreedom from "./components/TwoDegreesOfFreedom"
import HarmonicExcitation from "./components/HarmonicExcitation"

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Dynamic Systems Visualization</h1>
      <Tabs defaultValue="problem1" className="space-y-4">
        <TabsList>
          <TabsTrigger value="problem1">Two Degrees of Freedom</TabsTrigger>
          <TabsTrigger value="problem2">Harmonic Excitation</TabsTrigger>
        </TabsList>
        <TabsContent value="problem1">
          <TwoDegreesOfFreedom />
        </TabsContent>
        <TabsContent value="problem2">
          <HarmonicExcitation />
        </TabsContent>
      </Tabs>
    </div>
  )
}

