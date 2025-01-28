"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import * as math from "mathjs"

export default function HarmonicExcitation() {
  const [params, setParams] = useState({
    m1: 2.5,
    m2: 2.5,
    c11: 250,
    c22: 0,
    k11: 8000,
    k12: -4000,
    k22: 4000,
    F1: 5,
    F2: 10,
    omega: 5,
  })

  const [results, setResults] = useState<{ t: number; x1: number; x2: number }[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setParams((prev) => ({ ...prev, [name]: Number.parseFloat(value) || 0 }))
  }

  const calculateResults = () => {
    try {
      const M = math.matrix([
        [params.m1, 0],
        [0, params.m2],
      ])
      const C = math.matrix([
        [params.c11, 0],
        [0, params.c22],
      ])
      const K = math.matrix([
        [params.k11, params.k12],
        [params.k12, params.k22],
      ])
      const F = math.matrix([params.F1, params.F2])

      const Z = math.add(
        math.subtract(
          math.multiply(-math.pow(params.omega, 2), M),
          math.multiply(math.complex(0, 1), math.multiply(params.omega, C)),
        ),
        K,
      )

      const X = math.multiply(math.inv(Z), F)

      const data = []
      for (let t = 0; t <= 10; t += 0.01) {
        // @ts-expect-error Correct later
        const x1 = math.re(math.multiply(X.get([0]).valueOf(), math.exp(math.complex(0, params.omega * t))))
        // @ts-expect-error Correct later
        const x2 = math.re(math.multiply(X.get([1]), math.exp(math.complex(0, params.omega * t))))
        data.push({ t, x1, x2 })
      }
      // @ts-expect-error Correct later
      setResults(data)
      setError(null)
    } catch (err) {
      setError("Error calculating results. Please check your input parameters.")
      console.error(err)
    }
  }

  const MatrixInput = ({ label, names, values }: { label: string; names: string[]; values: number[] }) => (
    <Card>
      <CardHeader>
        <CardTitle>{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {names.map((name, index) => (
            <Input
              key={name}
              id={name}
              name={name}
              type="number"
              value={values[index]}
              onChange={handleInputChange}
              className="text-center"
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Harmonic Excitation</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Mass Matrix (M)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <Input
                id="m1"
                name="m1"
                type="number"
                value={params.m1}
                onChange={handleInputChange}
                className="text-center"
              />
              <Input disabled value="0" className="text-center bg-gray-100" />
              <Input disabled value="0" className="text-center bg-gray-100" />
              <Input
                id="m2"
                name="m2"
                type="number"
                value={params.m2}
                onChange={handleInputChange}
                className="text-center"
              />
            </div>
          </CardContent>
        </Card>
        <MatrixInput label="Damping Matrix (C)" names={["c11", "c22"]} values={[params.c11, params.c22]} />
        <MatrixInput
          label="Stiffness Matrix (K)"
          names={["k11", "k12", "k12", "k22"]}
          values={[params.k11, params.k12, params.k12, params.k22]}
        />
        <Card>
          <CardHeader>
            <CardTitle>Force Vector (F)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="F1">F1</Label>
                <Input id="F1" name="F1" type="number" value={params.F1} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="F2">F2</Label>
                <Input id="F2" name="F2" type="number" value={params.F2} onChange={handleInputChange} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Frequency</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="omega">ω (rad/s)</Label>
            <Input id="omega" name="omega" type="number" value={params.omega} onChange={handleInputChange} />
          </CardContent>
        </Card>
      </div>
      <Button onClick={calculateResults} className="w-full">
        Calculate
      </Button>
      {error && <p className="text-red-500">{error}</p>}
      {results.length > 0 && !error && (
        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={results}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="t" />
                <YAxis />

                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="x1" stroke="#8884d8" name="x1(t)" />
                <Line type="monotone" dataKey="x2" stroke="#82ca9d" name="x2(t)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

