"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import * as math from "mathjs"

export default function TwoDegreesOfFreedom() {
  const [params, setParams] = useState({
    m1: 2,
    m2: 10,
    c11: 20,
    c12: -5,
    c22: 5,
    k11: 50,
    k12: -10,
    k22: 10,
    x1_0: 1,
    x2_0: -1,
    x1_dot_0: 0,
    x2_dot_0: 0,
  })

  const [results, setResults] = useState<{ t: number; x1: number; x2: number }[]>([])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setParams((prev) => ({ ...prev, [name]: Number.parseFloat(value) }))
  }

  const calculateResults = () => {
    const M = math.matrix([
      [params.m1, 0],
      [0, params.m2],
    ])
    const C = math.matrix([
      [params.c11, params.c12],
      [params.c12, params.c22],
    ])
    const K = math.matrix([
      [params.k11, params.k12],
      [params.k12, params.k22],
    ])

    const data = []
    const dt = 0.1
    let t = 0
    let x = math.matrix([params.x1_0, params.x2_0])
    let x_dot = math.matrix([params.x1_dot_0, params.x2_dot_0])

    while (t <= 50) {
      const F = math.matrix([2 * Math.sin(3 * t), 5 * Math.cos(5 * t)])
      const x_ddot = math.multiply(
        math.inv(M),
        math.subtract(F, math.add(math.multiply(C, x_dot), math.multiply(K, x))),
      )

      x = math.add(x, math.multiply(x_dot, dt))
      x_dot = math.add(x_dot, math.multiply(x_ddot, dt))

      data.push({ t, x1: x.get([0]), x2: x.get([1]) })
      t += dt
    }

    setResults(data)
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
      <h2 className="text-2xl font-bold">Two Degrees of Freedom System</h2>
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
        <MatrixInput
          label="Damping Matrix (C)"
          names={["c11", "c12", "c12", "c22"]}
          values={[params.c11, params.c12, params.c12, params.c22]}
        />
        <MatrixInput
          label="Stiffness Matrix (K)"
          names={["k11", "k12", "k12", "k22"]}
          values={[params.k11, params.k12, params.k12, params.k22]}
        />
        <Card>
          <CardHeader>
            <CardTitle>Initial Conditions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="x1_0">x1(0)</Label>
                <Input id="x1_0" name="x1_0" type="number" value={params.x1_0} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="x2_0">x2(0)</Label>
                <Input id="x2_0" name="x2_0" type="number" value={params.x2_0} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="x1_dot_0">x1&apos;(0)</Label>
                <Input
                  id="x1_dot_0"
                  name="x1_dot_0"
                  type="number"
                  value={params.x1_dot_0}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="x2_dot_0">x2&apos;(0)</Label>
                <Input
                  id="x2_dot_0"
                  name="x2_dot_0"
                  type="number"
                  value={params.x2_dot_0}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Button onClick={calculateResults} className="w-full">
        Calculate
      </Button>
      {/* {error && <p className="text-red-500">{error}</p>} */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardContent>
          {results.length > 0 && (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={results}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="t" />
                <YAxis />
                <Tooltip />
                <Legend  />
                <Line type="monotone" dataKey="x1" stroke="#8884d8" name="x1(t)" />
                <Line type="monotone" dataKey="x2" stroke="#82ca9d" name="x2(t)" />
              </LineChart>
            </ResponsiveContainer>
        )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

