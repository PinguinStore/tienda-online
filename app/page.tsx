'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
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
  FaPhoneAlt,
  FaEye,
  FaTrash,
  FaEdit,
  FaPlus,
  FaTimes
} from 'react-icons/fa'

const categories = [
  'MÉDICOS',
  'HERRAMIENTAS',
  'PRODUCTOS DE CASA',
  'MANUALIDADES',
  'REPUESTOS',
  'MUJERES',
  'VARONES',
  'BEBES',
  'HIGIENE',
  'ACCESORIOS',
  'ELECTRONICOS',
  'RELOJES',
  'MASCOTAS',
  'LIMPIEZA'
]

export default function Home() {

  const [products, setProducts] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [cart, setCart] = useState<any[]>([])

  const [showModal, setShowModal] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)

  const [customerName, setCustomerName] = useState('')
  const [customerCity, setCustomerCity] = useState('La Paz')
  const [customerPhone, setCustomerPhone] = useState('')

  const [admin, setAdmin] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)

  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')

  const [editingId, setEditingId] = useState<number | null>(null)

  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState(categories[0])
  const [images, setImages] = useState('')
  const [description, setDescription] = useState('')
  const [stock, setStock] = useState('1')

  const [promoIndex, setPromoIndex] = useState(0)

  useEffect(() => {
    getProducts()

    const savedCart = localStorage.getItem('cart')

    if(savedCart){
      setCart(JSON.parse(savedCart))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  useEffect(() => {

    const womenProducts =
      products.filter((p)=>
        p.category?.toUpperCase().includes('MUJER')
      )

    if(womenProducts.length === 0) return

    const interval = setInterval(()=>{

      setPromoIndex((prev)=>
        prev >= womenProducts.length - 1
          ? 0
          : prev + 1
      )

    },3000)

    return ()=> clearInterval(interval)

  },[products])

  async function getProducts(){

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('id',{ ascending:false })

  if(error){
    console.log(error)
    return
  }

  if(data){

    const fixedProducts = data.map((p:any)=>({

      ...p,

      images:
        Array.isArray(p.images)
          ? p.images
          : p.image
            ? [p.image]
            : []

    }))

    setProducts(fixedProducts)
  }
}

  function playSound(){

    const audio = new Audio(
      'https://actions.google.com/sounds/v1/cartoon/pop.ogg'
    )

    audio.play()
  }

  function addToCart(product:any){

    playSound()

    setCart([...cart, product])

    setShowModal(true)
  }

  function removeFromCart(index:number){

    const updated = [...cart]

    updated.splice(index,1)

    setCart(updated)
  }

  function continueShopping(){

    playSound()

    setShowModal(false)
  }

  function finishShopping(){

    playSound()

    setShowModal(false)

    setShowCheckout(true)
  }

  function sendWhatsApp(){

    if(
      !customerName ||
      !customerPhone
    ){
      alert('Completa todos los datos')
      return
    }

    const text =
      cart.map(
        (item,index)=>
        `${index+1}. ${item.name} - Bs.${getPrice(item)}`
      ).join('%0A')

    const total =
      cart.reduce(
        (acc,item)=>
        acc + getPrice(item),
        0
      )

    const url =
      `https://wa.me/59169580486?text=`+
      `🛒 PEDIDO ALDRSTORE %0A%0A`+
      `👤 Nombre: ${customerName}%0A`+
      `📍 Ciudad: ${customerCity}%0A`+
      `📱 Celular: ${customerPhone}%0A%0A`+
      `${text}%0A%0A`+
      `💰 TOTAL: Bs.${total}`

    window.open(url,'_blank')
  }

  function loginAdmin(){

    if(
      user === 'Aldair' &&
      pass === '30012022'
    ){
      setAdmin(true)

      setTimeout(()=>{

        document
          .getElementById('admin-panel')
          ?.scrollIntoView({
            behavior:'smooth'
          })

      },200)
    }
    else{
      alert('Datos incorrectos')
    }
  }

  async function saveProduct(){

    if(editingId){

      await supabase
        .from('products')
        .update({
          name,
          price,
          category,
          images: images
  .split(',')
  .map(img => img.trim())
  .filter(img => img !== ''),
          description,
          stock
        })
        .eq('id', editingId)

      alert('Producto actualizado')

    }else{

      await supabase
        .from('products')
        .insert([
          {
            name,
            price,
            category,
            images: images
  .split(',')
  .map(img => img.trim())
  .filter(img => img !== ''),
            description,
            stock
          }
        ])

      alert('Producto agregado')
    }

    clearForm()

    getProducts()
  }

  function editProduct(product:any){

    setEditingId(product.id)

    setName(product.name || '')
    setPrice(product.price || '')
    setCategory(product.category || categories[0])
    setImages(
  product.images
    ? product.images.join(',')
    : ''
)
    setDescription(product.description || '')
    setStock(product.stock || '1')

    setTimeout(()=>{

      document
        .getElementById('admin-panel')
        ?.scrollIntoView({
          behavior:'smooth'
        })

    },200)
  }

  async function deleteProduct(id:number){

    await supabase
      .from('products')
      .delete()
      .eq('id', id)

    getProducts()
  }

  function clearForm(){

    setEditingId(null)

    setName('')
    setPrice('')
    setCategory(categories[0])
    setImages('')
    setDescription('')
    setStock('1')
  }

  function getPrice(product:any){

    const categoryText =
      product.category?.toUpperCase() || ''

    const hasDiscount =
      categoryText.includes('MUJER')

    const original =
      Number(product.price)

    if(hasDiscount){

      return Number(
        (original * 0.85).toFixed(2)
      )
    }

    return original
  }

  const womenProducts =
    products.filter((p)=>
      p.category?.toUpperCase().includes('MUJER')
    )

  const promoProduct =
    womenProducts[promoIndex]

  const filteredProducts = useMemo(()=>{

    return products.filter((product)=>{

      const matchesSearch =
        product.name
          ?.toLowerCase()
          .includes(search.toLowerCase())

      const matchesCategory =
        selectedCategory === ''
        ||
        product.category === selectedCategory

      return (
        matchesSearch &&
        matchesCategory
      )
    })

  },[
    products,
    search,
    selectedCategory
  ])

  return (

    <main className='bg-[#f5f5f5] min-h-screen'>

      {/* TOP */}

      <div className='bg-black text-white text-xs py-2 px-4'>

        <div className='max-w-7xl mx-auto flex justify-between flex-wrap gap-3'>

          <p>
            🚚 Envíos a toda Bolivia
          </p>

          <div className='flex gap-5'>

            <p>
              📦 Compra segura
            </p>

            <p className='flex items-center gap-2'>
              <FaWhatsapp />
              +591 69580486
            </p>

          </div>

        </div>

      </div>

      {/* HEADER */}

      <header className='bg-[#0f172a] py-4 shadow-xl sticky top-0 z-50'>

        <div className='max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 px-4'>

          <div className='flex items-center gap-3'>

            <img
              src='/logo.png'
              className='w-16 h-16 object-contain'
            />

            <div>

              <h1 className='text-2xl font-black text-yellow-400'>
                ALDRSTORE
              </h1>

              <p className='text-slate-300 text-xs'>
                Todo en un solo lugar
              </p>

            </div>

          </div>

          {/* SEARCH */}

          <div className='flex flex-1 max-w-2xl'>

            <button className='bg-yellow-400 px-4 rounded-l-2xl font-bold text-sm'>

              Todos

            </button>

            <input
              placeholder='Buscar productos...'
              value={search}
              onChange={(e)=>
                setSearch(e.target.value)
              }
              className='flex-1 p-3 outline-none text-sm'
            />

            <button className='bg-yellow-400 px-5 rounded-r-2xl'>

              <FaSearch />

            </button>

          </div>

          {/* CART */}

          <div className='bg-black text-white px-4 py-3 rounded-2xl flex items-center gap-3 border border-yellow-400'>

            <FaShoppingCart className='text-yellow-400' />

            <div>

              <p className='text-xs'>
                Mi carrito
              </p>

              <h2 className='font-black'>
                {cart.length}
              </h2>

            </div>

          </div>

        </div>

      </header>

      {/* NAVBAR */}

      <nav className='bg-yellow-400 py-3 shadow-lg overflow-auto'>

        <div className='max-w-7xl mx-auto flex items-center gap-5 px-5 min-w-max'>

          <div className='flex items-center gap-2 font-black text-sm'>

            <FaBars />

            <span>
              CATEGORÍAS
            </span>

          </div>

          {categories.map((cat)=>(

            <button
              key={cat}
              onClick={()=>
                setSelectedCategory(cat)
              }
              className={`
                px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap
                ${
                  selectedCategory === cat
                  ? 'bg-black text-yellow-400'
                  : 'bg-white text-black'
                }
              `}
            >
              {cat}
            </button>

          ))}

          <button
            onClick={()=>
              setSelectedCategory('')
            }
            className='bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold'
          >
            TODOS
          </button>

        </div>

      </nav>

      {/* PROMO */}

      {promoProduct && (

        <section className='max-w-7xl mx-auto px-5 py-6'>

          <div className='bg-gradient-to-r from-pink-500 to-red-500 rounded-[30px] overflow-hidden shadow-2xl grid lg:grid-cols-2'>

            <div className='p-8 flex flex-col justify-center text-white'>

              <div className='bg-white text-red-500 inline-block px-4 py-2 rounded-full font-black text-sm mb-5'>

                PROMOCIÓN DÍA DE LA MADRE

              </div>

              <h1 className='text-4xl font-black leading-tight'>

                15% DE DESCUENTO

              </h1>

              <p className='mt-4 text-lg'>

                En toda la categoría MUJERES

              </p>

            </div>

            <div className='relative'>

<img
  src={
    Array.isArray(promoProduct.images) &&
    promoProduct.images.length > 0 &&
    promoProduct.images[0] !== ''
      ? promoProduct.images[0]
      : 'https://via.placeholder.com/500'
  }
  className='w-full h-[320px] object-cover'
/>

              <div className='absolute bottom-5 left-5 bg-white text-black px-5 py-3 rounded-2xl shadow-xl'>

                <h2 className='font-black text-xl'>
                  {promoProduct.name}
                </h2>

                <p className='text-red-500 font-black text-2xl'>

                  Bs. {getPrice(promoProduct)}

                </p>

              </div>

            </div>

          </div>

        </section>

      )}

      {/* PRODUCTS */}

      <section className='max-w-7xl mx-auto px-5 pb-20'>

        <div className='flex items-center justify-between mb-8'>

          <h1 className='text-2xl font-black text-slate-900'>

            PRODUCTOS

          </h1>

          <button className='bg-yellow-400 px-4 py-2 rounded-2xl font-black text-sm'>

            {selectedCategory || 'TODOS'}

          </button>

        </div>

        <div className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>

          {filteredProducts.map((product)=>{

            const hasDiscount =
              product.category
                ?.toUpperCase()
                .includes('MUJER')

            const isLast =
              Number(product.stock) === 1

            return (

              <div
                key={product.id}
                className='bg-white rounded-3xl overflow-hidden shadow-xl hover:scale-105 transition duration-300'
              >

                <div className='relative'>

                  <div className='relative'>

<img
  src={
    Array.isArray(product.images) &&
    product.images.length > 0 &&
    product.images[0] !== ''
      ? product.images[0]
      : 'https://via.placeholder.com/500'
  }
  className='w-full h-64 object-cover'
/>

</div>
                  {hasDiscount && (

                    <div className='absolute top-3 left-3 bg-red-500 text-white px-4 py-2 rounded-full font-black text-xs'>

                      15% OFF

                    </div>

                  )}

                  {isLast && (

                    <div className='absolute top-14 left-3 bg-yellow-400 text-black px-4 py-2 rounded-full font-black text-xs'>

                      ÚLTIMO EN STOCK

                    </div>

                  )}

                </div>

                <div className='p-4'>

                  <p className='text-xs text-slate-500 font-bold'>

                    {product.category}

                  </p>

                  <h2 className='text-lg font-black mt-2 min-h-[50px]'>

                    {product.name}

                  </h2>

                  <p className='text-slate-500 mt-2 line-clamp-2 text-sm'>

                    {product.description}

                  </p>

                  <div className='mt-5 flex items-center justify-between'>

                    <div>

                      {hasDiscount && (

                        <p className='line-through text-slate-400 text-sm'>

                          Bs. {product.price}

                        </p>

                      )}

                      <h3 className='text-2xl font-black text-yellow-500'>

                        Bs. {getPrice(product)}

                      </h3>

                      <p className='text-xs text-slate-500'>

                        Stock: {product.stock}

                      </p>

                    </div>

                  </div>

                  <div className='grid grid-cols-2 gap-3 mt-5'>

                    <Link
                      href={`/product/${product.id}`}
                    >

                      <button className='bg-slate-200 text-black w-full p-3 rounded-2xl font-bold flex items-center justify-center gap-2 text-sm'>

                        <FaEye />

                        Ver

                      </button>

                    </Link>

                    <button
                      onClick={()=>
                        addToCart(product)
                      }
                      className='bg-[#0f172a] text-white w-full p-3 rounded-2xl font-bold flex items-center justify-center gap-2 text-sm'
                    >

                      <FaShoppingCart />

                      Comprar

                    </button>

                  </div>

                  {admin && (

                    <div className='grid grid-cols-2 gap-3 mt-3'>

                      <button
                        onClick={()=>
                          editProduct(product)
                        }
                        className='bg-yellow-400 text-black p-3 rounded-2xl font-bold flex items-center justify-center'
                      >

                        <FaEdit />

                      </button>

                      <button
                        onClick={()=>
                          deleteProduct(product.id)
                        }
                        className='bg-red-500 text-white p-3 rounded-2xl font-bold flex items-center justify-center'
                      >

                        <FaTrash />

                      </button>

                    </div>

                  )}

                </div>

              </div>

            )

          })}

        </div>

      </section>

      {/* ADMIN BUTTON */}

      {!admin && (

        <div className='fixed bottom-5 right-5 z-50'>

          <button
            onClick={()=>
              setShowAdmin(true)
            }
            className='bg-black text-yellow-400 px-6 py-4 rounded-full shadow-2xl font-black text-sm'
          >

            INGRESAR COMO ADMINISTRADOR

          </button>

        </div>

      )}

      {/* ADMIN MODAL */}

      {showAdmin && !admin && (

        <div className='fixed inset-0 bg-black/70 flex items-center justify-center z-[100]'>

          <div className='bg-white p-8 rounded-3xl w-[95%] max-w-md relative'>

            <button
              onClick={()=>
                setShowAdmin(false)
              }
              className='absolute top-4 right-4'
            >

              <FaTimes />

            </button>

            <h2 className='text-3xl font-black mb-6 text-center'>

              ADMIN

            </h2>

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
                onClick={loginAdmin}
                className='bg-black text-yellow-400 p-4 rounded-2xl font-black'
              >

                INGRESAR

              </button>

            </div>

          </div>

        </div>

      )}

      {/* ADMIN PANEL */}

      {admin && (

        <section
          id='admin-panel'
          className='max-w-7xl mx-auto px-5 pb-20'
        >

          <div className='bg-white p-8 rounded-3xl shadow-2xl'>

            <h1 className='text-3xl font-black mb-8'>

              PANEL ADMIN

            </h1>

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

              <select
                value={category}
                onChange={(e)=>
                  setCategory(e.target.value)
                }
                className='p-4 border rounded-2xl'
              >

                {categories.map((cat)=>(

                  <option key={cat}>
                    {cat}
                  </option>

                ))}

              </select>

              <textarea
  placeholder='Pega URLs separadas por coma'
  value={images}
  onChange={(e)=>setImages(e.target.value)}
  className='w-full p-4 border rounded-2xl h-28'
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
              className='w-full mt-4 p-4 border rounded-2xl h-32'
            />

            <div className='grid md:grid-cols-2 gap-4 mt-5'>

              <button
                onClick={saveProduct}
                className='bg-yellow-400 text-black p-5 rounded-2xl font-black flex items-center justify-center gap-3'
              >

                <FaPlus />

                {editingId
                  ? 'ACTUALIZAR PRODUCTO'
                  : 'AÑADIR PRODUCTO'
                }

              </button>

              <button
                onClick={clearForm}
                className='bg-slate-200 text-black p-5 rounded-2xl font-black'
              >

                LIMPIAR

              </button>

            </div>

          </div>

        </section>

      )}

      {/* MODAL */}

      {showModal && (

        <div className='fixed inset-0 bg-black/70 flex items-center justify-center z-[200]'>

          <div className='bg-white rounded-3xl p-10 w-[95%] max-w-md text-center shadow-2xl'>

            <div className='bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-5'>

              <FaShoppingCart className='text-green-500 text-4xl' />

            </div>

            <h2 className='text-3xl font-black'>

              Producto añadido

            </h2>

            <p className='text-slate-500 mt-3'>

              ¿Deseas continuar comprando
              o concluir tu pedido?

            </p>

            <div className='grid grid-cols-2 gap-4 mt-8'>

              <button
                onClick={continueShopping}
                className='bg-slate-200 p-4 rounded-2xl font-black'
              >

                Seguir

              </button>

              <button
                onClick={finishShopping}
                className='bg-green-500 text-white p-4 rounded-2xl font-black'
              >

                Concluir

              </button>

            </div>

          </div>

        </div>

      )}

      {/* CHECKOUT */}

      {showCheckout && (

        <div className='fixed inset-0 bg-black/70 flex items-center justify-center z-[300] overflow-auto p-5'>

          <div className='bg-white rounded-3xl p-10 w-full max-w-xl shadow-2xl relative'>

            <button
              onClick={()=>
                setShowCheckout(false)
              }
              className='absolute top-5 right-5'
            >

              <FaTimes />

            </button>

            <h2 className='text-3xl font-black mb-8 text-center'>

              FINALIZAR COMPRA

            </h2>

            <div className='grid gap-4'>

              <input
                placeholder='Nombre completo'
                value={customerName}
                onChange={(e)=>
                  setCustomerName(e.target.value)
                }
                className='p-4 border rounded-2xl'
              />

              <select
                value={customerCity}
                onChange={(e)=>
                  setCustomerCity(e.target.value)
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

              <input
                placeholder='Número de celular'
                value={customerPhone}
                onChange={(e)=>
                  setCustomerPhone(e.target.value)
                }
                className='p-4 border rounded-2xl'
              />

            </div>

            <div className='mt-8 bg-slate-100 rounded-3xl p-5'>

              <h3 className='font-black text-xl mb-4'>

                Resumen

              </h3>

              <div className='grid gap-3'>

                {cart.map((item,index)=>(

                  <div
                    key={index}
                    className='flex justify-between text-sm'
                  >

                    <span>
                      {item.name}
                    </span>

                    <span className='font-black'>

                      Bs. {getPrice(item)}

                    </span>

                  </div>

                ))}

              </div>

              <h2 className='text-3xl font-black mt-6 text-yellow-500'>

                Bs.
                {
                  cart.reduce(
                    (acc,item)=>
                    acc + getPrice(item),
                    0
                  )
                }

              </h2>

            </div>

            <button
              onClick={sendWhatsApp}
              className='bg-green-500 text-white w-full p-5 rounded-2xl mt-8 text-xl font-black flex items-center justify-center gap-3'
            >

              <FaWhatsapp />

              PEDIR POR WHATSAPP

            </button>

          </div>

        </div>

      )}

    </main>
  )
}