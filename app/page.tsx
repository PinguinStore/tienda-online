'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../src/lib/supabase'
import { motion } from 'framer-motion'
import {
  FaShoppingCart,
  FaTrash,
  FaEdit,
  FaMapMarkerAlt
} from 'react-icons/fa'

export default function Home() {

  const [products, setProducts] = useState<any[]>([])
  const [cart, setCart] = useState<any[]>([])

  const [search, setSearch] = useState('')

  const [admin, setAdmin] = useState(false)
  const [showLogin, setShowLogin] = useState(false)

  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')

  const [editingId, setEditingId] = useState<number | null>(null)

  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [image, setImage] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [stock, setStock] = useState('1')

  const [department, setDepartment] = useState('La Paz')

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

  function loginAdmin(){

    if(
      user === 'Aldair' &&
      pass === '30012022'
    ){
      setAdmin(true)
      alert('Bienvenido técnico')
    }else{
      alert('Datos incorrectos')
    }
  }

  async function addProduct(){

    if(editingId){

      const { error } = await supabase
        .from('products')
        .update({
          name,
          price,
          category,
          image,
          description,
          location,
          stock
        })
        .eq('id', editingId)

      if(error){
        alert(error.message)
        return
      }

      alert('Producto actualizado')

      setEditingId(null)

    }else{

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
            stock,
            sold:false
          }
        ])

      if(error){
        alert(error.message)
        return
      }

      alert('Producto agregado')
    }

    clearForm()

    getProducts()
  }

  function clearForm(){

    setName('')
    setPrice('')
    setCategory('')
    setImage('')
    setDescription('')
    setLocation('')
    setStock('1')
  }

  function editProduct(product:any){

    setEditingId(product.id)

    setName(product.name)
    setPrice(product.price)
    setCategory(product.category)
    setImage(product.image)
    setDescription(product.description)
    setLocation(product.location)
    setStock(product.stock)
  }

  async function deleteProduct(id:number){

    await supabase
      .from('products')
      .delete()
      .eq('id', id)

    getProducts()
  }

  function addToCart(product:any){

    if(product.stock <= 0){
      return
    }

    setCart([...cart, product])
  }

  function removeFromCart(index:number){

    const updated = [...cart]

    updated.splice(index,1)

    setCart(updated)
  }

  function sendWhatsApp(){

    const text = cart.map(
      (item,index)=>
      `${index+1}. ${item.name} - Bs.${item.price}`
    ).join('%0A')

    const total = cart.reduce(
      (acc,item)=>
      acc + Number(item.price),
      0
    )

    const phone = '59169580486'

    const url =
      `https://wa.me/${phone}?text=` +
      `Hola ALDRSTORE 👋%0A` +
      `Quiero pedir:%0A%0A` +
      `${text}%0A%0A` +
      `Departamento: ${department}%0A` +
      `TOTAL: Bs.${total}`

    window.open(url,'_blank')
  }

  const filteredProducts =
    products.filter((product)=>
      product.name
      .toLowerCase()
      .includes(search.toLowerCase())
    )

  return (

    <main className='min-h-screen bg-slate-100'>

      <header className='bg-[#020617] text-white sticky top-0 z-50 shadow-2xl'>

        <div className='max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-5 p-5'>

          <div className='flex items-center gap-4'>

            <img
              src='/logo.png'
              className='w-20 h-20 object-contain'
            />

            <div>

              <h1 className='text-3xl font-black text-yellow-400'>
                ALDRSTORE
              </h1>

              <p className='text-sm text-slate-300'>
                Herramientas • Hogar • Médicos • Repuestos
              </p>

            </div>

          </div>

          <input
            placeholder='Buscar productos...'
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            className='flex-1 min-w-[250px] max-w-xl p-4 rounded-2xl text-black outline-none'
          />

          <div className='flex items-center gap-3 bg-yellow-400 text-black px-5 py-3 rounded-2xl font-black shadow-lg'>

            <FaShoppingCart size={25} />

            <span>
              {cart.length}
            </span>

          </div>

        </div>

      </header>

      <section className='bg-gradient-to-r from-[#020617] via-[#0f172a] to-[#1e293b] text-white py-20 px-5'>

        <div className='max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center'>

          <div>

            <motion.h1
              initial={{ opacity:0, y:-50 }}
              animate={{ opacity:1, y:0 }}
              transition={{ duration:0.8 }}
              className='text-6xl font-black leading-tight'
            >
              Compra todo
              <span className='text-yellow-400'>
                {' '}en un solo lugar
              </span>
            </motion.h1>

            <p className='mt-6 text-xl text-slate-300 leading-relaxed'>
              Productos premium para hogar,
              medicina, herramientas,
              repuestos y mucho más.
            </p>

          </div>

          <motion.img
            initial={{ opacity:0, scale:0.8 }}
            animate={{ opacity:1, scale:1 }}
            transition={{ duration:0.8 }}
            src='https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1200'
            className='rounded-3xl shadow-2xl h-[450px] w-full object-cover'
          />

        </div>

      </section>

      <div className='max-w-7xl mx-auto grid lg:grid-cols-[1fr_350px] gap-8 p-5'>

        <div>

          {!admin ? (

            <div className='bg-white p-6 rounded-3xl shadow-xl mb-8'>

              {!showLogin ? (

                <button
                  onClick={()=>
                    setShowLogin(true)
                  }
                  className='bg-black text-yellow-400 w-full p-5 rounded-2xl text-2xl font-black hover:scale-105 transition'
                >
                  TÉCNICO
                </button>

              ) : (

                <>

                  <h2 className='text-3xl font-black mb-5'>
                    Acceso Técnico
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
                      className='bg-blue-950 text-white p-4 rounded-2xl font-bold hover:bg-black'
                    >
                      Ingresar
                    </button>

                  </div>

                </>

              )}

            </div>

          ) : (

            <div className='bg-white p-8 rounded-3xl shadow-xl mb-8'>

              <h2 className='text-4xl font-black mb-8 text-blue-950'>
                Panel Técnico
              </h2>

              <div className='grid md:grid-cols-2 gap-4'>

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
                  placeholder='URL Imagen'
                  value={image}
                  onChange={(e)=>setImage(e.target.value)}
                  className='p-4 border rounded-2xl'
                />

                <input
                  placeholder='Ubicación'
                  value={location}
                  onChange={(e)=>setLocation(e.target.value)}
                  className='p-4 border rounded-2xl'
                />

                <input
                  placeholder='Cantidad en stock'
                  value={stock}
                  onChange={(e)=>setStock(e.target.value)}
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

              <button
                onClick={addProduct}
                className='bg-yellow-400 text-black w-full p-5 rounded-2xl font-black text-xl mt-6 hover:scale-105 transition'
              >
                {editingId
                  ? 'Actualizar Producto'
                  : 'Añadir Producto'
                }
              </button>

            </div>

          )}

          <div className='grid sm:grid-cols-2 xl:grid-cols-3 gap-6'>

            {filteredProducts.map((product)=>(

              <motion.div
                key={product.id}
                whileHover={{
                  y:-10,
                  scale:1.02
                }}
                className='bg-white rounded-3xl overflow-hidden shadow-xl'
              >

                <img
                  src={product.image}
                  className='w-full h-72 object-cover'
                />

                <div className='p-5'>

                  <p className='text-sm text-slate-500 font-semibold'>
                    {product.category}
                  </p>

                  <h2 className='text-2xl font-black mt-2'>
                    {product.name}
                  </h2>

                  <p className='mt-3 text-slate-600'>
                    {product.description}
                  </p>

                  <div className='flex items-center gap-2 mt-4 text-slate-500'>

                    <FaMapMarkerAlt />

                    <span>
                      {product.location}
                    </span>

                  </div>

                  <h3 className='text-3xl font-black text-yellow-500 mt-5'>
                    Bs. {product.price}
                  </h3>

                  <p className='mt-2 text-sm text-slate-500'>
                    Stock disponible:
                    {' '}
                    {product.stock}
                  </p>

                  {product.stock > 0 ? (

                    <button
                      onClick={()=>
                        addToCart(product)
                      }
                      className='bg-blue-950 text-white w-full p-4 rounded-2xl mt-5 font-bold hover:bg-black'
                    >
                      Añadir al carrito
                    </button>

                  ) : (

                    <button
                      className='bg-red-500 text-white w-full p-4 rounded-2xl mt-5 font-bold'
                    >
                      AGOTADO
                    </button>

                  )}

                  {admin && (

                    <div className='grid grid-cols-2 gap-3 mt-4'>

                      <button
                        onClick={()=>
                          editProduct(product)
                        }
                        className='bg-yellow-400 text-black p-4 rounded-2xl font-bold'
                      >
                        <FaEdit />
                      </button>

                      <button
                        onClick={()=>
                          deleteProduct(product.id)
                        }
                        className='bg-red-500 text-white p-4 rounded-2xl font-bold'
                      >
                        <FaTrash />
                      </button>

                    </div>

                  )}

                </div>

              </motion.div>

            ))}

          </div>

        </div>

        <div className='bg-white rounded-3xl p-6 shadow-2xl h-fit sticky top-28'>

          <h2 className='text-3xl font-black mb-6'>
            Carrito 🛒
          </h2>

          {cart.length === 0 && (
            <p className='text-slate-500'>
              No hay productos
            </p>
          )}

          <div className='grid gap-4'>

            {cart.map((item,index)=>(

              <div
                key={index}
                className='border-b pb-4'
              >

                <h3 className='font-black'>
                  {item.name}
                </h3>

                <p className='text-yellow-500 font-bold'>
                  Bs. {item.price}
                </p>

                <button
                  onClick={()=>
                    removeFromCart(index)
                  }
                  className='bg-red-500 text-white px-4 py-2 rounded-xl mt-2'
                >
                  Eliminar
                </button>

              </div>

            ))}

          </div>

          <div className='mt-6'>

            <label className='font-bold'>
              Departamento entrega
            </label>

            <select
              value={department}
              onChange={(e)=>
                setDepartment(e.target.value)
              }
              className='w-full mt-2 p-4 border rounded-2xl'
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

          </div>

          <h3 className='text-3xl font-black mt-8'>

            Total:
            {' '}
            Bs.
            {cart.reduce(
              (acc,item)=>
              acc + Number(item.price),
              0
            )}

          </h3>

          <button
            onClick={sendWhatsApp}
            className='bg-green-500 text-white w-full p-5 rounded-2xl mt-6 text-xl font-black hover:scale-105 transition'
          >
            Pedir por WhatsApp
          </button>

        </div>

      </div>

    </main>
  )
}