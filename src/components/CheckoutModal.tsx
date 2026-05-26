'use client'

import { useState } from 'react'

export default function CheckoutModal({
  cart,
  onClose
}:any){

  const [name,setName] =
    useState('')

  const [phone,setPhone] =
    useState('')

  const [department,setDepartment] =
    useState('La Paz')

  function sendWhatsApp(){

    const total = cart.reduce(
      (acc:any,item:any)=>
        acc + (item.price * item.quantity),
      0
    )

    const products = cart.map(
      (item:any,index:number)=>
      `${index+1}. ${item.name}
Cantidad: ${item.quantity}
Precio: Bs.${item.price}`
    ).join('%0A%0A')

    const text =
      `Hola ALDRSTORE 👋%0A%0A` +
      `Nombre: ${name}%0A` +
      `Celular: ${phone}%0A` +
      `Departamento: ${department}%0A%0A` +
      `Pedido:%0A%0A` +
      `${products}%0A%0A` +
      `TOTAL: Bs.${total}`

    window.open(
      `https://wa.me/59169580486?text=${text}`,
      '_blank'
    )
  }

  return (

    <div className='fixed inset-0 bg-black/70 z-50 flex justify-center items-center p-5'>

      <div className='bg-white rounded-3xl p-8 w-full max-w-xl'>

        <h2 className='text-4xl font-black mb-8'>
          Finalizar pedido
        </h2>

        <div className='grid gap-5'>

          <input
            placeholder='Nombre completo'
            value={name}
            onChange={(e)=>
              setName(e.target.value)
            }
            className='p-4 border rounded-2xl'
          />

          <input
            placeholder='Número celular'
            value={phone}
            onChange={(e)=>
              setPhone(e.target.value)
            }
            className='p-4 border rounded-2xl'
          />

          <select
            value={department}
            onChange={(e)=>
              setDepartment(e.target.value)
            }
            className='p-4 border rounded-2xl'
          >

            <option>La Paz</option>
            <option>Santa Cruz</option>
            <option>Cochabamba</option>
            <option>Oruro</option>
            <option>Potosí</option>
            <option>Tarija</option>
            <option>Beni</option>
            <option>Pando</option>
            <option>Chuquisaca</option>

          </select>

          <button
            onClick={sendWhatsApp}
            className='bg-green-500 text-white p-5 rounded-2xl text-xl font-black'
          >
            Pedir por WhatsApp
          </button>

          <button
            onClick={onClose}
            className='bg-slate-200 p-4 rounded-2xl'
          >
            Cancelar
          </button>

        </div>

      </div>

    </div>
  )
}