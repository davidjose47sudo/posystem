'use client'

import { use, useContext, useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { VentaContext } from '@/context/useventa'

type usuario = {
  id: string,
  nombre: string
}

export default function RegistrarVenta() {
  const [idUsuario, setIdUsuario] = useState({ id: '', nombre: 'Seleccione un usuario' })
  const [total, setTotal] = useState('')
  const [usuariosregistrados, setUsuariosregistrados] = useState<usuario[]>()
  const { setIdVentaContext, idVenta } = useContext(VentaContext)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Aquí iría la lógica para llamar al SP registrar_venta
    console.log('Registrar venta:', { id: idUsuario.id, total })

    fetch('/api/vendedor/registrar_venta', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id_usuario: idUsuario.id, total })
    }).then(res => res.json()).then(data => {
      console.log('Venta registrada:', data)
      setIdVentaContext(data.id_venta) // Se actualiza el idVenta en el contexto
    }).catch(err => {
      console.error('Error al registrar la venta:', err)
    })
  }

  // Cargar usuarios registrados al cargar el componente
  useEffect(() => {
    fetch('/api/usuarios/obtener_usuarios').then(res => res.json()).then(data => {
      console.log('Usuarios registrados:', data)
      setUsuariosregistrados(data)
    }).catch(err => {
      console.error('Error al obtener usuarios:', err)
    })
  }, [])

  useEffect(() => {
    console.log('idVenta:', idVenta)
  }, [idVenta])

  // Verificar si los usuarios están cargados
  if (!usuariosregistrados) return <p>Cargando usuarios...</p>

  // Si ya hay un idVenta, mostramos un mensaje y no el formulario
  if (idVenta) {
    return (
      <div>
        <p>Ya se ha registrado una venta con el ID: {idVenta}. Por favor, completa el proceso antes de registrar una nueva venta.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="idUsuario">Usuario</Label>
        <Select required value={idUsuario.id} onValueChange={(value) => {
          const usuarioSeleccionado = usuariosregistrados?.find(usuario => usuario.id === value)
          if (usuarioSeleccionado) {
            setIdUsuario({ id: usuarioSeleccionado.id, nombre: usuarioSeleccionado.nombre })
          }
        }}>
          <SelectTrigger>
            <SelectValue placeholder={idUsuario.nombre} />
          </SelectTrigger>
          <SelectContent>
            {usuariosregistrados?.length ? usuariosregistrados.map((usuario) => (
              <SelectItem key={usuario.id} value={usuario.id}>{usuario.nombre}</SelectItem>
            )) : null}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="total">Total</Label>
        <Input id="total" type="number" step="0.01" value={total} onChange={(e) => setTotal(e.target.value)} required />
      </div>
      <Button type="submit">Registrar Venta</Button>
    </form>
  )
}
