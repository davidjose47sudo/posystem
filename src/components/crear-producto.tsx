'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function CrearProducto() {
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [precio, setPrecio] = useState('')
  const [stock, setStock] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica para llamar al SP crear_producto
    console.log('Crear producto:', { nombre, descripcion, precio, stock })

    fetch('/api/admin/crear_producto', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nombre, descripcion, precio, stock})
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        alert('Producto creado exitosamente')
      })
      .catch(error => {
        console.error('Error:', error)
        alert('Ocurrió un error al crear el producto')
      })

  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="nombre">Nombre</Label>
        <Input id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="descripcion">Descripción</Label>
        <Textarea id="descripcion" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="precio">Precio</Label>
        <Input id="precio" type="number" step="0.01" value={precio} onChange={(e) => setPrecio(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="stock">Stock</Label>
        <Input id="stock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />
      </div>
      <Button type="submit">Crear Producto</Button>
    </form>
  )
}