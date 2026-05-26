'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function AdminPanel({
  refresh
}:any){

  const [admin,setAdmin] =
    useState(false)

  const [showLogin,setShowLogin] =
    useState(false)

  const [user,setUser] =
    useState('')

  const [pass,setPass] =
    useState('')

  const [name,setName] =
    useState('')

  const [price,setPrice] =
    useState('')

  const [category,setCategory] =
    useState('')

  const [image,setImage] =
    useState('')

  const [images,setImages] =
    useState('')

  const [description,setDescription] =
    useState('')

  const [stock,setStock] =
    useState('1')

  async function addProduct(){

    await supabase
      .from('products')
      .insert([
        {
          name,
          price,
          category,
          image,
          images,
          description,
          stock
        }
      ])

    alert('Producto agregado')

    refresh()
  }

  function login(){

    if(
      user === 'Aldair' &&
      pass === '30012022'
    ){
      setAdmin(true)
    }else{
      alert('Datos incorrectos')
    }
  }

  return (

    <div className='mb-10'>

      {!admin ? (

        <div className='bg-white rounded-3xl p-6 shadow-xl'>

          {!showLogin ? (

            <button
              onClick={()=>
                setShowLogin(true)
              }
              className='bg-black text-yellow-400 w-full p-5 rounded-2xl text-2xl font-black'
            >
              TÉCNICO
            </button>

          ) : (

            <div className='grid gap-4'>

              <input
                placeholder='Usuario'
                value={user}
                onChange={(e)=>
                  setUser(e.target.value)
                }
                className='p-4 border rounded-2xl'
              />

              <input
                type='password'
                placeholder='Contraseña'
                value={pass}
                onChange={(e)=>
                  setPass(e.target.value)
                }
                className='p-4 border rounded-2xl'
              />

              <button
                onClick={login}
                className='bg-blue-950 text-white p-4 rounded-2xl font-bold'
              >
                Ingresar
              </button>

            </div>

          )}

        </div>

      ) : (

        <div className='bg-white rounded-3xl p-8 shadow-xl'>

          <h2 className='text-4xl font-black mb-6'>
            Panel Técnico
          </h2>

          <div className='grid md:grid-cols-2 gap-4'>

            <input
              placeholder='Nombre'
              value={name}
              onChange={(e)=>
                setName(e.target.value)
              }
              className='p-4 border rounded-2xl'
            />

            <input
              placeholder='Precio'
              value={price}
              onChange={(e)=>
                setPrice(e.target.value)
              }
              className='p-4 border rounded-2xl'
            />

            <input
              placeholder='Categoría'
              value={category}
              onChange={(e)=>
                setCategory(e.target.value)
              }
              className='p-4 border rounded-2xl'
            />

            <input
              placeholder='Imagen principal'
              value={image}
              onChange={(e)=>
                setImage(e.target.value)
              }
              className='p-4 border rounded-2xl'
            />

            <input
              placeholder='Más imágenes separadas por coma'
              value={images}
              onChange={(e)=>
                setImages(e.target.value)
              }
              className='p-4 border rounded-2xl'
            />

            <input
              placeholder='Stock'
              value={stock}
              onChange={(e)=>
                setStock(e.target.value)
              }
              className='p-4 border rounded-2xl'
            />

          </div>

          <textarea
            placeholder='Descripción'
            value={description}
            onChange={(e)=>
              setDescription(e.target.value)
            }
            className='w-full p-4 border rounded-2xl mt-4 h-32'
          />

          <button
            onClick={addProduct}
            className='bg-yellow-400 text-black w-full p-5 rounded-2xl mt-5 font-black text-xl'
          >
            Añadir producto
          </button>

        </div>

      )}

    </div>
  )
}