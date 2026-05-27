# app/page.tsx

```tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../src/lib/supabase'
import {
  FaShoppingCart,
  FaSearch,
  FaBars,
  FaWhatsapp,
  FaTools,
  FaHome,
  FaCar,
  FaStethoscope,
  FaPhoneAlt
} from 'react-icons/fa'

export default function Home() {

  const [products, setProducts] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState<any[]>([])

  useEffect(() => {
    getProducts()
  }, [])

  async function getProducts() {

    const { data } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending:false })

    if(data){
      setProducts(data)
    }
  }

  function addToCart(product:any){
    setCart([...cart, product])
  }

  const filteredProducts =
    products.filter((product)=>
      product.name
      ?.toLowerCase()
      .includes(search.toLowerCase())
    )

  return (

    <main className='bg-[#f5f5f5] min-h-screen'>

      {/* TOP BAR */}

      <div className='bg-black text-white text-sm py-2 px-4'>

        <div className='max-w-7xl mx-auto flex justify-between flex-wrap gap-3'>

          <p>
            👋 Bienvenido a ALDRSTORE
          </p>

          <div className='flex gap-5'>

            <p>
              🚚 Envíos a toda Bolivia
            </p>

            <p className='flex items-center gap-2'>
              <FaWhatsapp />
              +591 69580486
            </p>

          </div>

        </div>

      </div>

      {/* HEADER */}

      <header className='bg-[#0f172a] py-5 shadow-xl'>

        <div className='max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-5 px-5'>

          <div className='flex items-center gap-4'>

            <img
              src='/logo.png'
              className='w-24 h-24 object-contain'
            />

            <div>

              <h1 className='text-4xl font-black text-yellow-400'>
                ALDRSTORE
              </h1>

              <p className='text-slate-300'>
                Todo en un solo lugar
              </p>

            </div>

          </div>

          {/* SEARCH */}

          <div className='flex flex-1 max-w-3xl'>

            <button className='bg-yellow-400 px-5 rounded-l-2xl font-bold'>
              Todos
            </button>

            <input
              placeholder='Buscar productos...'
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
              className='flex-1 p-4 outline-none'
            />

            <button className='bg-yellow-400 px-6 rounded-r-2xl'>
              <FaSearch size={20} />
            </button>

          </div>

          {/* CART */}

          <div className='bg-black text-white px-5 py-3 rounded-2xl flex items-center gap-3 border border-yellow-400'>

            <FaShoppingCart size={28} className='text-yellow-400' />

            <div>

              <p className='text-sm'>
                Mi carrito
              </p>

              <h2 className='font-black text-xl'>
                {cart.length}
              </h2>

            </div>

          </div>

        </div>

      </header>

      {/* NAVBAR */}

      <nav className='bg-yellow-400 py-4 shadow-lg'>

        <div className='max-w-7xl mx-auto flex flex-wrap items-center justify-between px-5 gap-5'>

          <div className='flex items-center gap-3 font-black text-lg'>

            <FaBars />

            <span>
              CATEGORÍAS
            </span>

          </div>

          <div className='flex gap-10 font-bold'>

            <a>
              Inicio
            </a>

            <a>
              Productos
            </a>

            <a>
              Contactos
            </a>

            <a>
              Servicio Técnico
            </a>

          </div>

          <div className='bg-black text-yellow-400 px-5 py-2 rounded-full flex items-center gap-3 font-black'>

            <FaPhoneAlt />

            <span>
              +591 69580486
            </span>

          </div>

        </div>

      </nav>

      {/* HERO */}

      <section className='max-w-7xl mx-auto px-5 py-8'>

        <div className='bg-white rounded-[35px] overflow-hidden shadow-2xl grid lg:grid-cols-2'>

          <div className='p-10 flex flex-col justify-center'>

            <div className='bg-yellow-400 text-black inline-block px-5 py-2 rounded-full font-black text-xl mb-6'>
              SUPER OFERTAS
            </div>

            <h1 className='text-6xl font-black leading-tight text-slate-900'>
              Productos
              <span className='text-yellow-500'> PREMIUM</span>
            </h1>

            <p className='text-slate-600 text-xl mt-6 leading-relaxed'>
              Herramientas, productos médicos,
              hogar, repuestos y miles de artículos.
            </p>

            <div className='grid grid-cols-2 gap-4 mt-10'>

              <div className='bg-slate-100 p-5 rounded-2xl'>
                <FaTools className='text-4xl text-yellow-500 mb-3' />
                <h2 className='font-black'>Herramientas</h2>
              </div>

              <div className='bg-slate-100 p-5 rounded-2xl'>
                <FaStethoscope className='text-4xl text-yellow-500 mb-3' />
                <h2 className='font-black'>Médicos</h2>
              </div>

              <div className='bg-slate-100 p-5 rounded-2xl'>
                <FaHome className='text-4xl text-yellow-500 mb-3' />
                <h2 className='font-black'>Hogar</h2>
              </div>

              <div className='bg-slate-100 p-5 rounded-2xl'>
                <FaCar className='text-4xl text-yellow-500 mb-3' />
                <h2 className='font-black'>Repuestos</h2>
              </div>

            </div>

          </div>

          <div>

            <img
              src='https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=1200'
              className='w-full h-full object-cover'
            />

          </div>

        </div>

      </section>

      {/* INFO */}

      <section className='max-w-7xl mx-auto px-5 pb-8'>

        <div className='grid md:grid-cols-4 gap-5'>

          <div className='bg-white rounded-3xl p-6 shadow-lg'>
            <h2 className='font-black text-xl'>Compra segura</h2>
            <p className='text-slate-500 mt-2'>
              Protección garantizada
            </p>
          </div>

          <div className='bg-white rounded-3xl p-6 shadow-lg'>
            <h2 className='font-black text-xl'>Envíos rápidos</h2>
            <p className='text-slate-500 mt-2'>
              A toda Bolivia
            </p>
          </div>

          <div className='bg-white rounded-3xl p-6 shadow-lg'>
            <h2 className='font-black text-xl'>Productos originales</h2>
            <p className='text-slate-500 mt-2'>
              Calidad premium
            </p>
          </div>

          <div className='bg-white rounded-3xl p-6 shadow-lg'>
            <h2 className='font-black text-xl'>Soporte 24/7</h2>
            <p className='text-slate-500 mt-2'>
              Atención personalizada
            </p>
          </div>

        </div>

      </section>

      {/* PRODUCTS */}

      <section className='max-w-7xl mx-auto px-5 pb-20'>

        <div className='flex items-center justify-between mb-10'>

          <h1 className='text-4xl font-black text-slate-900'>
            PRODUCTOS DESTACADOS
          </h1>

          <button className='bg-yellow-400 px-5 py-3 rounded-2xl font-black'>
            Ver todos
          </button>

        </div>

        <div className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>

          {filteredProducts.map((product)=>(

            <div
              key={product.id}
              className='bg-white rounded-3xl overflow-hidden shadow-xl hover:scale-105 transition duration-300'
            >

              <div className='relative'>

                <img
                  src={product.image}
                  className='w-full h-72 object-cover'
                />

                <div className='absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full font-black'>
                  OFERTA
                </div>

              </div>

              <div className='p-5'>

                <p className='text-sm text-slate-500 font-bold'>
                  {product.category}
                </p>

                <h2 className='text-2xl font-black mt-2 min-h-[70px]'>
                  {product.name}
                </h2>

                <p className='text-slate-500 mt-3 line-clamp-2'>
                  {product.description}
                </p>

                <div className='flex items-center justify-between mt-6'>

                  <div>

                    <h3 className='text-3xl font-black text-yellow-500'>
                      Bs. {product.price}
                    </h3>

                    <p className='text-sm text-slate-500'>
                      Stock: {product.stock}
                    </p>

                  </div>

                </div>

                <button
                  onClick={()=>addToCart(product)}
                  className='bg-[#0f172a] text-white w-full p-4 rounded-2xl mt-6 font-black hover:bg-black transition'
                >
                  Añadir al carrito
                </button>

              </div>

            </div>

          ))}

        </div>

      </section>

    </main>
  )
}
```

# app/globals.css

```css
@import "tailwindcss";

body {
  margin: 0;
  padding: 0;
  background: #f5f5f5;
}

a {
  cursor: pointer;
}
```

# INSTALAR ICONOS

```bash
npm install react-icons
```

# PARA SUBIR

```bash
git add .
git commit -m "Nueva interfaz premium"
git push
```

# COLOCA TU LOGO

Pon tu logo dentro de:

```text
public/logo.png
```
