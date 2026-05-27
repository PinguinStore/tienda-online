'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

import { supabase } from '../../../src/lib/supabase'

import {
  FaArrowLeft,
  FaShoppingCart,
  FaWhatsapp,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa'

export default function ProductPage() {

  const params = useParams()
  const router = useRouter()

  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const [current, setCurrent] = useState(0)

  const [cart, setCart] = useState<any[]>([])

  const [showModal, setShowModal] = useState(false)

  useEffect(() => {

    const savedCart = localStorage.getItem('cart')

    if(savedCart){
      setCart(JSON.parse(savedCart))
    }

  }, [])

  useEffect(() => {

    if(params?.id){
      getProduct()
    }

  }, [params])

  useEffect(() => {

    if(!product?.images?.length) return

    const interval = setInterval(() => {

      setCurrent((prev) =>
        prev >= product.images.length - 1
          ? 0
          : prev + 1
      )

    }, 3000)

    return () => clearInterval(interval)

  }, [product])

  async function getProduct(){

    setLoading(true)

    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('id', params.id)
      .single()

if(data){

  // convertir image antigua a images
  if(
    (!data.images || data.images.length === 0)
    &&
    data.image
  ){
    data.images = [data.image]
  }

  // si images viene como texto
  if(
    typeof data.images === 'string'
  ){
    data.images = data.images
      .split(',')
      .map((img:string)=>img.trim())
  }

  // seguridad
  if(
    !Array.isArray(data.images)
  ){
    data.images = []
  }

  setProduct(data)
}

    setLoading(false)
  }

  function getPrice(){

    if(!product) return 0

    const isWomen =
      product.category
        ?.toUpperCase()
        .includes('MUJER')

    const price = Number(product.price)

    if(isWomen){
      return Number(
        (price * 0.85).toFixed(2)
      )
    }

    return price
  }

  function playSound(){

    const audio = new Audio(
      'https://actions.google.com/sounds/v1/cartoon/pop.ogg'
    )

    audio.play()
  }

  function addToCart(){

    playSound()

    const updated = [...cart, product]

    setCart(updated)

    localStorage.setItem(
      'cart',
      JSON.stringify(updated)
    )

    setShowModal(true)
  }

  function nextImage(){

    if(!product?.images?.length) return

    setCurrent((prev)=>
      prev >= product.images.length - 1
        ? 0
        : prev + 1
    )
  }

  function prevImage(){

    if(!product?.images?.length) return

    setCurrent((prev)=>
      prev <= 0
        ? product.images.length - 1
        : prev - 1
    )
  }

  if(loading){

    return (

      <main className='min-h-screen flex items-center justify-center bg-[#f5f5f5]'>

        <h1 className='text-3xl font-black'>
          Cargando...
        </h1>

      </main>

    )
  }

  if(!product){

    return (

      <main className='min-h-screen flex items-center justify-center bg-[#f5f5f5]'>

        <div className='text-center'>

          <h1 className='text-4xl font-black'>
            Producto no encontrado
          </h1>

          <Link href='/'>

            <button className='mt-6 bg-black text-white px-6 py-4 rounded-2xl font-bold'>

              Volver

            </button>

          </Link>

        </div>

      </main>

    )
  }

const images = (
  product.images?.length
    ? product.images
    : product.image
      ? [product.image]
      : []
)
.filter(
  (img:string)=>
    img &&
    img.trim() !== ''
)
  const isWomen =
    product.category
      ?.toUpperCase()
      .includes('MUJER')

  const isLast =
    Number(product.stock) === 1

  return (

    <main className='bg-[#f5f5f5] min-h-screen pb-20'>

      {/* HEADER */}

      <div className='bg-[#0f172a] py-5 shadow-xl'>

        <div className='max-w-7xl mx-auto px-5 flex items-center justify-between'>

          <Link href='/'>

            <button className='bg-yellow-400 text-black px-5 py-3 rounded-2xl font-black flex items-center gap-3'>

              <FaArrowLeft />

              VOLVER

            </button>

          </Link>

          <h1 className='text-yellow-400 text-3xl font-black'>

            ALDRSTORE

          </h1>

        </div>

      </div>

      {/* PRODUCT */}

      <section className='max-w-7xl mx-auto px-5 py-10 grid lg:grid-cols-2 gap-10'>

        {/* IMAGES */}

        <div>

          <div className='relative bg-white rounded-3xl overflow-hidden shadow-2xl'>

            <img
  src={
    images[current]
    ||
    'https://via.placeholder.com/600x600'
  }
  className='w-full h-[500px] object-cover rounded-3xl'
/>

            {/* BADGES */}

            {isWomen && (

              <div className='absolute top-5 left-5 bg-red-500 text-white px-5 py-3 rounded-full font-black text-sm'>

                15% OFF

              </div>

            )}

            {isLast && (

              <div className='absolute top-20 left-5 bg-yellow-400 text-black px-5 py-3 rounded-full font-black text-sm'>

                ÚLTIMO EN STOCK

              </div>

            )}

            {/* ARROWS */}

            {images.length > 1 && (

              <>

                <button
                  onClick={prevImage}
                  className='absolute left-4 top-1/2 -translate-y-1/2 bg-black/70 text-white w-12 h-12 rounded-full flex items-center justify-center'
                >

                  <FaChevronLeft />

                </button>

                <button
                  onClick={nextImage}
                  className='absolute right-4 top-1/2 -translate-y-1/2 bg-black/70 text-white w-12 h-12 rounded-full flex items-center justify-center'
                >

                  <FaChevronRight />

                </button>

              </>

            )}

          </div>

          {/* MINI IMAGES */}

          <div className='flex gap-3 mt-5 overflow-auto'>

{images
  .filter((img:string)=>img && img.trim() !== '')
  .map((img:string,index:number)=>(

  <button
    key={index}
                onClick={()=>
                  setCurrent(index)
                }
                className={`
                  border-4 rounded-2xl overflow-hidden min-w-[90px]
                  ${
                    current === index
                      ? 'border-yellow-400'
                      : 'border-transparent'
                  }
                `}
              >

                <img
  src={
    img ||
    'https://via.placeholder.com/100'
  }
  className='w-[90px] h-[90px] object-cover'
/>

              </button>

            ))}

          </div>

        </div>

        {/* INFO */}

        <div className='bg-white rounded-3xl shadow-2xl p-8 flex flex-col justify-center'>

          <p className='text-sm text-slate-500 font-black'>

            {product.category}

          </p>

          <h1 className='text-4xl font-black mt-3'>

            {product.name}

          </h1>

          <p className='text-slate-600 mt-6 text-lg leading-relaxed'>

            {product.description}

          </p>

          <div className='mt-8'>

            {isWomen && (

              <p className='line-through text-slate-400 text-2xl'>

                Bs. {product.price}

              </p>

            )}

            <h2 className='text-5xl font-black text-yellow-500'>

              Bs. {getPrice()}

            </h2>

            <p className='mt-3 text-sm text-slate-500'>

              Stock disponible: {product.stock}
            </p>

          </div>

          <div className='grid md:grid-cols-2 gap-5 mt-10'>

            <button
              onClick={addToCart}
              className='bg-[#0f172a] text-white p-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3'
            >

              <FaShoppingCart />

              AÑADIR

            </button>

            <a
              href={`https://wa.me/59169580486?text=Hola quiero el producto ${product.name}`}
              target='_blank'
            >

              <button className='bg-green-500 text-white w-full p-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3'>

                <FaWhatsapp />

                WHATSAPP

              </button>

            </a>

          </div>

        </div>

      </section>

      {/* MODAL */}

      {showModal && (

        <div className='fixed inset-0 bg-black/70 flex items-center justify-center z-50'>

          <div className='bg-white p-10 rounded-3xl max-w-md w-[95%] text-center shadow-2xl'>

            <div className='bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6'>

              <FaShoppingCart className='text-green-500 text-4xl' />

            </div>

            <h2 className='text-3xl font-black'>

              Producto añadido
            </h2>

            <p className='text-slate-500 mt-4'>

              Tu carrito sigue guardado
            </p>

            <div className='grid grid-cols-2 gap-4 mt-8'>

              <button
                onClick={()=>
                  setShowModal(false)
                }
                className='bg-slate-200 p-4 rounded-2xl font-black'
              >

                Seguir

              </button>

              <button
                onClick={()=>
                  router.push('/')
                }
                className='bg-yellow-400 p-4 rounded-2xl font-black'
              >

                Inicio

              </button>

            </div>

          </div>

        </div>

      )}

    </main>
  )
}