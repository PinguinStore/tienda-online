'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../src/lib/supabase'
import {
  FaShoppingCart,
  FaTrash,
  FaWhatsapp,
  FaSearch,
  FaTools,
  FaHome,
  FaCarBattery,
  FaHeartbeat
} from 'react-icons/fa'

export default function Home() {

  const [products, setProducts] = useState<any[]>([])
  const [cart, setCart] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('Todos')

  const [admin, setAdmin] = useState(false)

  const [user,setUser] = useState('')
  const [pass,setPass] = useState('')

  const [name,setName] = useState('')
  const [price,setPrice] = useState('')
  const [category,setCategory] = useState('')
  const [image,setImage] = useState('')
  const [description,setDescription] = useState('')
  const [location,setLocation] = useState('')

  const [department,setDepartment] = useState('La Paz')

  useEffect(()=>{
    getProducts()
  },[])

  async function getProducts(){

    const { data } = await supabase
      .from('products')
      .select('*')
      .order('id',{ascending:false})

    if(data){
      setProducts(data)
    }
  }

  function loginAdmin(){

    if(
      user === 'Aldair' &&
      pass === '30012022'
    ){
      setAdmin(true)
      alert('Bienvenido Aldair')
    }else{
      alert('Datos incorrectos')
    }
  }

  async function addProduct(){

    const { error } = await supabase
      .from('products')
      .insert([
        {
          name,
          price,
          category,
          image,
          description,
          location,
          sold:false
        }
      ])

    if(error){
      alert(error.message)
      return
    }

    setName('')
    setPrice('')
    setCategory('')
    setImage('')
    setDescription('')
    setLocation('')

    getProducts()
  }

  async function deleteProduct(id:number){

    await supabase
      .from('products')
      .delete()
      .eq('id',id)

    getProducts()
  }

  function addToCart(product:any){

    setCart([...cart,product])
  }

  function removeCart(index:number){

    const updated = [...cart]

    updated.splice(index,1)

    setCart(updated)
  }

  function sendWhatsApp(){

    const text = cart.map(
      (item,index)=>
      `${index+1}. ${item.name}
Bs.${item.price}`
    ).join('%0A')

    const total = cart.reduce(
      (acc,item)=>
      acc + Number(item.price),
      0
    )

    const phone = '59169580486'

    const url =
    `https://wa.me/${phone}?text=
Hola quiero comprar:%0A%0A${text}%0A%0ADepartamento:${department}%0A%0ATotal: Bs.${total}`

    window.open(url,'_blank')
  }

  const filteredProducts = products.filter((product)=>{

    const matchSearch =
      product.name
      .toLowerCase()
      .includes(search.toLowerCase())

    const matchCategory =
      categoryFilter === 'Todos'
      ||
      product.category === categoryFilter

    return matchSearch && matchCategory
  })

  return(

    <main className='bg-slate-100 min-h-screen'>

      {/* HEADER */}

      <header className='bg-black text-white px-6 py-4 sticky top-0 z-50 shadow-2xl'>

        <div className='flex flex-wrap items-center justify-between gap-5'>

          <div className='flex items-center gap-4'>

            <img
              src='/logo.png'
              className='w-20 h-20 object-contain'
            />

            <div>

              <h1 className='text-3xl font-bold text-yellow-400'>
                ALDRSTORE
              </h1>

              <p className='text-slate-300'>
                Tienda Online Premium
              </p>

            </div>

          </div>

          <div className='flex-1 max-w-2xl relative'>

            <FaSearch
              className='absolute top-4 left-4 text-slate-400'
            />

            <input
              placeholder='Buscar productos...'
              value={search}
              onChange={(e)=>
                setSearch(e.target.value)
              }
              className='w-full p-4 pl-12 rounded-2xl text-black outline-none'
            />

          </div>

          <div className='flex items-center gap-3 bg-yellow-500 px-5 py-3 rounded-2xl text-black font-bold'>

            <FaShoppingCart size={25} />

            {cart.length}

          </div>

        </div>

      </header>

      {/* HERO */}

      <section className='bg-gradient-to-r from-black via-slate-900 to-blue-950 text-white py-24 px-6'>

        <div className='max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center'>

          <div>

            <h1 className='text-6xl font-black leading-tight text-yellow-400'>

              Compra todo
              <br />
              en un solo lugar

            </h1>

            <p className='mt-6 text-2xl text-slate-300'>

              Herramientas, hogar,
              médicos, repuestos y mucho más.

            </p>

          </div>

          <div className='flex justify-center'>

            <img
              src='/logo.png'
              className='w-[350px] animate-pulse'
            />

          </div>

        </div>

      </section>

      {/* CATEGORIAS */}

      <section className='px-6 py-8'>

        <div className='flex flex-wrap gap-4 justify-center'>

          <button
            onClick={()=>setCategoryFilter('Todos')}
            className='bg-yellow-500 px-6 py-3 rounded-full font-bold'
          >
            Todos
          </button>

          <button
            onClick={()=>setCategoryFilter('Herramientas')}
            className='bg-white px-6 py-3 rounded-full shadow'
          >
            <FaTools className='inline mr-2' />
            Herramientas
          </button>

          <button
            onClick={()=>setCategoryFilter('Hogar')}
            className='bg-white px-6 py-3 rounded-full shadow'
          >
            <FaHome className='inline mr-2' />
            Hogar
          </button>

          <button
            onClick={()=>setCategoryFilter('Médicos')}
            className='bg-white px-6 py-3 rounded-full shadow'
          >
            <FaHeartbeat className='inline mr-2' />
            Médicos
          </button>

          <button
            onClick={()=>setCategoryFilter('Repuestos')}
            className='bg-white px-6 py-3 rounded-full shadow'
          >
            <FaCarBattery className='inline mr-2' />
            Repuestos
          </button>

        </div>

      </section>

      {/* CONTENIDO */}

      <div className='grid lg:grid-cols-[1fr_350px] gap-6 px-6 pb-10'>

        {/* PRODUCTOS */}

        <div>

          {/* ADMIN */}

          {!admin ? (

            <div className='bg-white p-6 rounded-3xl shadow-xl mb-6'>

              <h2 className='text-2xl font-bold mb-5'>
                Administrador
              </h2>

              <input
                placeholder='Usuario'
                value={user}
                onChange={(e)=>setUser(e.target.value)}
                className='w-full p-4 border rounded-2xl mb-3'
              />

              <input
                type='password'
                placeholder='Contraseña'
                value={pass}
                onChange={(e)=>setPass(e.target.value)}
                className='w-full p-4 border rounded-2xl mb-3'
              />

              <button
                onClick={loginAdmin}
                className='bg-blue-900 text-white w-full p-4 rounded-2xl font-bold'
              >
                Ingresar
              </button>

            </div>

          ) : (

            <div className='bg-white p-6 rounded-3xl shadow-xl mb-6'>

              <h2 className='text-3xl font-black mb-5 text-blue-950'>
                Panel Administrador
              </h2>

              <div className='grid md:grid-cols-2 gap-3'>

                <input
                  placeholder='Nombre'
                  value={name}
                  onChange={(e)=>setName(e.target.value)}
                  className='p-4 border rounded-2xl'
                />

                <input
                  placeholder='Precio'
                  value={price}
                  onChange={(e)=>setPrice(e.target.value)}
                  className='p-4 border rounded-2xl'
                />

                <input
                  placeholder='Categoría'
                  value={category}
                  onChange={(e)=>setCategory(e.target.value)}
                  className='p-4 border rounded-2xl'
                />

                <input
                  placeholder='Ubicación'
                  value={location}
                  onChange={(e)=>setLocation(e.target.value)}
                  className='p-4 border rounded-2xl'
                />

              </div>

              <textarea
                placeholder='Descripción'
                value={description}
                onChange={(e)=>setDescription(e.target.value)}
                className='w-full p-4 border rounded-2xl mt-3'
              />

              <input
                placeholder='URL Imagen'
                value={image}
                onChange={(e)=>setImage(e.target.value)}
                className='w-full p-4 border rounded-2xl mt-3'
              />

              <button
                onClick={addProduct}
                className='bg-yellow-500 text-black w-full p-4 rounded-2xl mt-4 font-black'
              >
                Añadir Producto
              </button>

            </div>

          )}

          {/* PRODUCTOS */}

          <div className='grid sm:grid-cols-2 xl:grid-cols-3 gap-6'>

            {filteredProducts.map((product)=>(

              <div
                key={product.id}
                className='bg-white rounded-3xl overflow-hidden shadow-xl hover:scale-105 transition duration-300'
              >

                <img
                  src={product.image}
                  className='w-full h-72 object-cover'
                />

                <div className='p-5'>

                  <p className='text-sm text-slate-500'>
                    {product.category}
                  </p>

                  <h2 className='text-2xl font-bold mt-2'>
                    {product.name}
                  </h2>

                  <p className='text-slate-600 mt-3 min-h-[80px]'>
                    {product.description}
                  </p>

                  <div className='mt-3 text-blue-900 font-bold'>
                    📍 {product.location}
                  </div>

                  <h3 className='text-3xl font-black text-yellow-500 mt-4'>
                    Bs. {product.price}
                  </h3>

                  <button
                    onClick={()=>
                      addToCart(product)
                    }
                    className='bg-blue-950 text-white w-full p-4 rounded-2xl mt-4 font-bold hover:bg-black'
                  >
                    Añadir al carrito
                  </button>

                  {admin && (

                    <button
                      onClick={()=>
                        deleteProduct(product.id)
                      }
                      className='bg-red-500 text-white w-full p-4 rounded-2xl mt-3'
                    >
                      <FaTrash className='inline mr-2' />
                      Eliminar
                    </button>

                  )}

                </div>

              </div>

            ))}

          </div>

        </div>

        {/* CARRITO */}

        <div className='bg-white rounded-3xl shadow-2xl p-6 h-fit sticky top-28'>

          <h2 className='text-3xl font-black mb-5'>
            Carrito 🛒
          </h2>

          <select
            value={department}
            onChange={(e)=>
              setDepartment(e.target.value)
            }
            className='w-full p-4 border rounded-2xl mb-5'
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

          {cart.length === 0 && (

            <p className='text-slate-500'>
              No hay productos
            </p>

          )}

          {cart.map((item,index)=>(

            <div
              key={index}
              className='border-b py-4'
            >

              <h3 className='font-bold'>
                {item.name}
              </h3>

              <p>
                Bs. {item.price}
              </p>

              <button
                onClick={()=>
                  removeCart(index)
                }
                className='bg-red-500 text-white px-4 py-2 rounded-xl mt-2'
              >
                Eliminar
              </button>

            </div>

          ))}

          <h2 className='text-3xl font-black mt-6 text-blue-950'>

            Total:
            Bs.
            {cart.reduce(
              (acc,item)=>
              acc + Number(item.price),
              0
            )}

          </h2>

          <button
            onClick={sendWhatsApp}
            className='bg-green-500 text-white w-full p-5 rounded-2xl mt-6 text-xl font-black hover:bg-green-600'
          >

            <FaWhatsapp className='inline mr-2' />

            Pedir por WhatsApp

          </button>

        </div>

      </div>

    </main>
  )
}