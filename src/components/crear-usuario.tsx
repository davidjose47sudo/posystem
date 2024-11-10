'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CrearUsuario() {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [idRol, setIdRol] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica para llamar al SP crear_usuario
    console.log('Crear usuario:', { nombre, email, contrasena, idRol })

    fetch('/api/admin/crear_usuario', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nombre, email, contrasena, id_rol:idRol })
    })
    .then(response => response.json())
    .then(data => {
      console.log(data)
      alert('Usuario creado exitosamente')
    })
    .catch(error => {
      console.error('Error:', error)
      alert('Ocurrió un error al crear el usuario')
    })
  }

  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-100 flex-col">
      <h1 className="text-3xl font-bold text-center">Crear Usuario</h1>
      <form onSubmit={handleSubmit} className="space-y-4 w-1/2">
        <div>
          <Label htmlFor="nombre">Nombre</Label>
          <Input id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="contrasena">Contraseña</Label>
          <Input id="contrasena" type="password" value={contrasena} onChange={(e) => setContrasena(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="idRol">Rol</Label>
          <Select onValueChange={setIdRol} required>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione un rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">Administrador</SelectItem>
              <SelectItem value="3">Cajero</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit">Crear Usuario</Button>
      </form>
    </section>
  )
}