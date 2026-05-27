'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

import { supabase } from '../../../src/lib/supabase'

import {
  FaArrowLeft,
  FaShoppingCart,
  FaWhatsapp
} from 'react-icons/fa'

export default function ProductPage() {

  const params = useParams()

  const [product,setProduct] = useState<any>(null)

  const [quantity,setQuantity] = useState(1)

  useEffect(()=>{

    getProduct()

  },[])

  async function getProduct(){

    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('id', params.id)
      .single()

    if(data){
      setProduct(data)
    }

  }

  function addToCart(){

    const existingCart =
      JSON.parse(
        localStorage.getItem('cart') || '[]'
      )

    const updatedCart = [
      ...existingCart,
      {
        ...product,
        quantity
      }
    ]

    localStorage.setItem(
      'cart',
      JSON.stringify(updatedCart)
    )

    alert('Producto añadido al carrito')

  }

  function buyWhatsApp(){

    const total =
      Number(product.price) * quantity

    const phone = '59169580486'

    const text =
      `Hola ALDRSTORE 👋%0A%0A` +
      `Quiero pedir:%0A%0A` +
      `${product.name}%0A` +
      `Cantidad: ${quantity}%0A` +
      `Precio: Bs.${product.price}%0A` +
      `TOTAL: Bs.${total}`

    window.open(
      `https://wa.me/${phone}?text=${text}`,
      '_blank'
    )

  }

  if(!product){

    return (

      <main className='min-h-screen bg-[#f5f5f5] flex items-center justify-center'>

        <h1 className='text-4xl font-black'>
          Cargando...
        </h1>

      </main>

    )

  }

  const isDiscount =
    product.category
      ?.toLowerCase()
      .includes('mujer')

  const finalPrice =
    isDiscount
      ? Number(product.price) * 0.85
      : Number(product.price)

  return (

    <main className='min-h-screen bg-[#f5f5f5]'>

      <header className='bg-[#0f172a] text-white py-5 shadow-xl'>

        <div className='max-w-7xl mx-auto px-5 flex items-center justify-between'>

          <div className='flex items-center gap-4'>

            <img
              src='/logo.png'
              className='w-20 h-20 object-contain'
            />

            <div>

              <h1 className='text-3xl font-black text-yellow-400'>
                ALDRSTORE
              </h1>

              <p className='text-slate-300'>
                Todo en un solo lugar
              </p>

            </div>

          </div>

          <Link
            href='/'
            className='bg-yellow-400 text-black px-5 py-3 rounded-2xl font-black flex items-center gap-3'
          >
            <FaArrowLeft />
            Volver
          </Link>

        </div>

      </header>

      <section className='max-w-7xl mx-auto p-5 py-10'>

        <div className='bg-white rounded-[35px] shadow-2xl overflow-hidden grid lg:grid-cols-2'>

          <div className='bg-slate-100 p-10 flex items-center justify-center relative'>

            {isDiscount && (

              <div className='absolute top-5 left-5 bg-red-500 text-white px-5 py-2 rounded-full font-black z-20'>
                15% OFF
              </div>

            )}

            {product.stock == 1 && (

              <div className='absolute top-5 right-5 bg-orange-500 text-white px-5 py-2 rounded-full font-black z-20'>
                ÚLTIMO EN STOCK
              </div>

            )}

            <img
              src={product.image}
              className='max-h-[600px] object-contain rounded-3xl'
            />

          </div>

          <div className='p-10 flex flex-col justify-center'>

            <p className='text-slate-500 font-bold text-lg'>
              {product.category}
            </p>

            <h1 className='text-5xl font-black mt-3 text-slate-900'>
              {product.name}
            </h1>

            <p className='text-slate-600 text-xl mt-6 leading-relaxed'>
              {product.description}
            </p>

            <div className='mt-8'>

              {isDiscount && (

                <p className='text-2xl text-slate-400 line-through'>
                  Bs. {product.price}
                </p>

              )}

              <h2 className='text-6xl font-black text-yellow-500'>
                Bs. {finalPrice.toFixed(2)}
              </h2>

            </div>

            <div className='mt-6'>

              <p className='text-lg font-bold'>
                Stock disponible:
                {' '}
                {product.stock}
              </p>

            </div>

            <div className='mt-8'>

              <label className='font-black text-lg'>
                Cantidad
              </label>

              <input
                type='number'
                min='1'
                max={product.stock}
                value={quantity}
                onChange={(e)=>
                  setQuantity(Number(e.target.value))
                }
                className='w-full mt-3 p-5 border-2 rounded-2xl text-2xl'
              />

            </div>

            <div className='grid md:grid-cols-2 gap-5 mt-10'>

              <button
                onClick={addToCart}
                className='bg-[#0f172a] text-white p-5 rounded-2xl text-xl font-black flex items-center justify-center gap-3 hover:bg-black transition'
              >
                <FaShoppingCart />
                Añadir al carrito
              </button>

              <button
                onClick={buyWhatsApp}
                className='bg-green-500 text-white p-5 rounded-2xl text-xl font-black flex items-center justify-center gap-3 hover:bg-green-600 transition'
              >
                <FaWhatsapp />
                Comprar ahora
              </button>

            </div>

          </div>

        </div>

      </section>

    </main>
  )
}