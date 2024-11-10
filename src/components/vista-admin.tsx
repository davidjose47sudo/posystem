'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from 'next/navigation'

interface ProductoBajoStock {
  id: number;
  nombre: string;
  stock: number;
}

export default function VistaAdmin() {
  const router = useRouter();
  const [stockMinimo, setStockMinimo] = useState('')
  const [fechaReporte, setFechaReporte] = useState('')
  const [reporteVentas, setReporteVentas] = useState<{ total_ventas: string, cantidad_ventas: number } | null>(null)
  const [productosBajoStock, setProductosBajoStock] = useState<ProductoBajoStock[]>([])

  const generarReporteVentas = () => {
    fetch(`/api/admin/generar_reporte?fecha=${fechaReporte}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(res => res.json()).then(data => {
      if (data && data.length > 0) {
        setReporteVentas(data[0])
      } else {
        console.error('Error al generar el reporte de ventas')
      }
    }).catch(err => {
      console.error('Error al generar el reporte de ventas:', err)
    })
  }

  const consultarProductosBajoStock = () => {
    console.log('Consultar productos bajo stock:', stockMinimo)

    fetch(`/api/admin/stock?stock_minimo=${stockMinimo}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(res => res.json()).then(data => {
      console.log('Productos bajo stock:', data)
      setProductosBajoStock(data)
    }).catch(err => {
      console.error('Error al consultar productos bajo stock:', err)
    })
  }

  function close() {
    fetch('/api/quit-cookie', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },

    }).then(res => {
      if (res.status === 200) {
        router.push('/')
      }
    }).catch(err => {
      console.error('Error al cerrar sesión:', err)
    }
    )
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>
      <Button onClick={close}>Cerrar</Button>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Generar Reporte de Ventas</CardTitle>
          <CardDescription>Obtenga el reporte de ventas del sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => { e.preventDefault(); generarReporteVentas(); }} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fechaReporte">Fecha del Reporte</Label>
              <Input
                id="fechaReporte"
                type="date"
                value={fechaReporte}
                onChange={(e) => setFechaReporte(e.target.value)}
                required
              />
            </div>
            <Button type="submit">Generar Reporte</Button>
          </form>
          {reporteVentas && (
            <div className="mt-4">
              <h2 className="text-xl font-bold">Reporte de Ventas</h2>
              <p>Total Ventas: {reporteVentas.total_ventas}</p>
              <p>Cantidad de Ventas: {reporteVentas.cantidad_ventas}</p>
            </div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Consultar Productos Bajo Stock</CardTitle>
          <CardDescription>Ingrese el stock mínimo para consultar los productos</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => { e.preventDefault(); consultarProductosBajoStock(); }} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="stockMinimo">Stock Mínimo</Label>
              <Input
                id="stockMinimo"
                type="number"
                value={stockMinimo}
                onChange={(e) => setStockMinimo(e.target.value)}
                required
              />
            </div>
            <Button type="submit">Consultar</Button>
          </form>
          {productosBajoStock.length > 0 && (
            <div className="mt-4">
              <h2 className="text-xl font-bold">Productos Bajo Stock</h2>
              <ul>
                {productosBajoStock.map((producto) => (
                  <li key={producto.id}>
                    ID: {producto.id}, Nombre: {producto.nombre}, Stock: {producto.stock}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}