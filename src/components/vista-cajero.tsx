"use client"
import { useEffect, useState, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import RegistrarVenta from './registrar-venta'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { VentaContext } from '@/context/useventa'

interface DetalleVenta {
  id_producto: string;
  cantidad: string;
  precio_unitario: string;
}

export default function VistaCajero() {
  const router = useRouter()
  const [idProducto, setIdProducto] = useState('') // Estado para almacenar el id del producto seleccionado
  const [cantidad, setCantidad] = useState('')
  const [precioUnitario, setPrecioUnitario] = useState('')
  const [metodoPago, setMetodoPago] = useState('')
  const [monto, setMonto] = useState('')
  const [productos, setProductos] = useState([{ id: '', nombre: '', precio: '' }]) // Productos obtenidos del API
  const [nombreProducto, setNombreProducto] = useState('') // Para almacenar el nombre del producto seleccionado
  const [detallesVenta, setDetallesVenta] = useState<DetalleVenta[]>([]) // Lista de detalles de venta
  const [detalleCerrado, setDetalleCerrado] = useState(false) // Estado para controlar si el detalle de la venta ha sido cerrado

  const { idVenta, setIdVentaContext } = useContext(VentaContext)

  useEffect(() => {
    fetch('/api/productos').then(res => res.json()).then(data => {
      console.log('Productos:', data)
      setProductos(data)
    }).catch(err => {
      console.error('Error al obtener productos:', err)
    })
  }, [])

  const agregarProducto = (e: React.FormEvent) => {
    e.preventDefault()
    // Lógica para agregar el producto a la lista de detalles de venta
    const nuevoDetalle = { id_producto: idProducto, cantidad, precio_unitario: precioUnitario }
    setDetallesVenta([...detallesVenta, nuevoDetalle])
    console.log('Producto agregado:', { idProducto, cantidad, precioUnitario })
  }

  const agregarDetalleVenta = (e: React.FormEvent) => {
    e.preventDefault()
    // Lógica para cerrar el detalle de la venta
    fetch('/api/vendedor/agregar_detalle', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id_venta: idVenta, detalles: detallesVenta })
    }).then(res => {
      if (res.status === 201) {
        console.log('Detalle de venta agregado con éxito. Puede continuar con el registro del pago.')
        setDetalleCerrado(true)
      } else if (!res.ok) {
        throw new Error('Network response was not ok')
      }
      return res.json()
    }).then(data => {
      console.log('Detalle de venta agregado:', data)
    }).catch(err => {
      console.error('Error al agregar detalle de venta:', err)
    })

    console.log('Cerrar detalle venta:', { idVenta, detallesVenta })
  }

  const registrarPago = (e: React.FormEvent) => {
    e.preventDefault()
    // Lógica para registrar el pago
    fetch('/api/vendedor/registrar_pago', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id_venta: idVenta, metodo_pago: metodoPago, monto_pagado: monto })
    }).then(res => {
      if (res.status === 201) {
        console.log('Pago registrado con éxito.')
        // Limpiar estados y contexto
        setIdProducto('')
        setCantidad('')
        setPrecioUnitario('')
        setMetodoPago('')
        setMonto('')
        setProductos([{ id: '', nombre: '', precio: '' }])
        setNombreProducto('')
        setDetallesVenta([])
        setDetalleCerrado(false)
        setIdVentaContext('')
      } else if (!res.ok) {
        throw new Error('Network response was not ok')
      }
      return res.json()
    }).then(data => {
      console.log('Pago registrado:', data)
    }).catch(err => {
      console.error('Error al registrar el pago:', err)
    })

    console.log('Registrar pago:', { idVenta, metodoPago, monto })
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
      <h1 className="text-2xl font-bold mb-4">Panel de Cajero</h1>
      <Button onClick={close}>Cerrar</Button>
      <Tabs defaultValue="venta">
        <TabsList>
          <TabsTrigger value="venta">Registrar Venta</TabsTrigger>
          <TabsTrigger value="detalle">Agregar Detalle</TabsTrigger>
          <TabsTrigger value="pago">Registrar Pago</TabsTrigger>
        </TabsList>

        {/* Formulario de "Registrar Venta" */}
        <TabsContent value="venta">
          <RegistrarVenta />
        </TabsContent>

        {/* Formulario de "Agregar Detalle" */}
        <TabsContent value="detalle">
          {/* Verifica si hay un idVenta antes de permitir agregar detalles */}
          {idVenta ? (
            detalleCerrado ? (
              <span>Detalle de venta agregado con éxito. Puede continuar con el registro del pago.</span>
            ) : (
              <form className="space-y-4" onSubmit={agregarProducto}>
                <div>
                  <Label htmlFor="idVenta">ID Venta</Label>
                  <Input id="idVenta" type="number" value={idVenta} readOnly />
                </div>
                <div>
                  <Label htmlFor="idProducto">Producto</Label>
                  <Select
                    value={idProducto}
                    onValueChange={(value) => {
                      setIdProducto(value); // Establece el idProducto cuando el usuario selecciona uno
                      const selectedProduct = productos.find(product => product.id === value);
                      if (selectedProduct) {
                        setNombreProducto(selectedProduct.nombre); // Asigna el nombre del producto
                        setPrecioUnitario(selectedProduct.precio); // Establece el precio unitario
                      }
                    }}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue>{nombreProducto || "Seleccione un producto"}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {productos.map(producto => (
                        <SelectItem key={producto.id} value={producto.id}>
                          {producto.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="cantidad">Cantidad</Label>
                  <Input id="cantidad" type="number" value={cantidad} onChange={(e) => setCantidad(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="precioUnitario">Precio Unitario</Label>
                  <Input id="precioUnitario" type="number" step="0.01" value={precioUnitario} readOnly required />
                </div>
                <Button type="submit">Agregar Producto</Button>
                <Button type="button" onClick={agregarDetalleVenta}>Cerrar Detalle</Button>
              </form>
            )
          ) : (
            <p>Por favor, registre una venta antes de agregar detalles.</p>
          )}

          {/* Lista de detalles de venta agregados */}
          {detallesVenta.length > 0 && (
            <div className="mt-4">
              <h2 className="text-xl font-bold mb-2">Detalles de Venta</h2>
              <ul>
                {detallesVenta.map((detalle, index) => (
                  <li key={index}>
                    Producto: {detalle.id_producto}, Cantidad: {detalle.cantidad}, Precio Unitario: {detalle.precio_unitario}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </TabsContent>

        {/* Formulario de "Registrar Pago" */}
        <TabsContent value="pago">
          {/* Verifica si hay un idVenta antes de permitir registrar un pago */}
          {idVenta ? (
            <form className="space-y-4" onSubmit={registrarPago}>
              <div>
                <Label htmlFor="idVentaPago">ID Venta</Label>
                <Input id="idVentaPago" type="number" value={idVenta} readOnly required />
              </div>
              <div>
                <Label htmlFor="metodoPago">Método de Pago</Label>
                <Select value={metodoPago} onValueChange={setMetodoPago} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un método de pago" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="efectivo">Efectivo</SelectItem>
                    <SelectItem value="tarjeta">Tarjeta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="monto">Monto</Label>
                <Input id="monto" type="number" step="0.01" value={monto} onChange={(e) => setMonto(e.target.value)} required />
              </div>
              <Button type="submit">Registrar Pago</Button>
            </form>
          ) : (
            <p>Por favor, registre una venta antes de registrar un pago.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
