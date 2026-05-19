'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../src/lib/supabase'
import { motion } from 'framer-motion'

export default function Home() {

  const [products, setProducts] = useState<any[]>([])
  const [cart, setCart] = useState<any[]>([])

  const [search, setSearch] = useState('')

  const [admin, setAdmin] = useState(false)

  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')

  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [image, setImage] = useState('')

  useEffect(() => {
    getProducts()
  }, [])

  async function getProducts() {

    const { data } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending:false })

    if(data) {
      setProducts(data)
    }
  }

  function loginAdmin() {

    if(
      user === 'Aldair' &&
      pass === '30012022'
    ) {
      setAdmin(true)
      alert('Bienvenido')
    }
    else {
      alert('Datos incorrectos')
    }
  }

  async function addProduct() {

    const { error } = await supabase
      .from('products')
      .insert([
        {
          name,
          price,
          category,
          image,
          sold:false
        }
      ])

    if(error) {
      alert(error.message)
      return
    }

    setName('')
    setPrice('')
    setCategory('')
    setImage('')

    getProducts()
  }

  async function deleteProduct(id:number) {

    await supabase
      .from('products')
      .delete()
      .eq('id', id)

    getProducts()
  }

  async function toggleSold(
    id:number,
    sold:boolean
  ) {

    await supabase
      .from('products')
      .update({
        sold: !sold
      })
      .eq('id', id)

    getProducts()
  }

  function addToCart(product:any) {
    setCart([...cart, product])
  }

  function removeFromCart(index:number) {

    const updated = [...cart]

    updated.splice(index,1)

    setCart(updated)
  }

  function sendWhatsApp() {

    const text = cart.map(
      (item,index)=>
      `${index+1}. ${item.name} - $${item.price}`
    ).join('%0A')

    const total = cart.reduce(
      (acc,item)=>
      acc + Number(item.price),
      0
    )

    const phone = '59169580486'

    const url =
      `https://wa.me/${phone}?text=` +
      `Hola quiero comprar:%0A${text}%0A%0ATotal:$${total}`

    window.open(url,'_blank')
  }

  const filteredProducts =
    products.filter((product)=>
      product.name
      .toLowerCase()
      .includes(search.toLowerCase())
    )

  return (

    <main
      style={{
        background:
          'linear-gradient(135deg,#0f172a,#1e293b)',
        minHeight:'100vh',
        color:'white',
        padding:'20px',
        fontFamily:'Arial'
      }}
    >

      <div
        style={{
          display:'flex',
          justifyContent:'space-between',
          alignItems:'center',
          flexWrap:'wrap',
          gap:'20px',
          marginBottom:'30px'
        }}
      >

        <div>

          <h1
            style={{
              fontSize:'50px',
              fontWeight:'bold'
            }}
          >
            ALDAIR STORE
          </h1>

          <p>
            Tienda moderna premium 🚀
          </p>

        </div>

        <input
          placeholder='Buscar productos...'
          value={search}
          onChange={(e)=>
            setSearch(e.target.value)
          }
          style={{
            padding:'15px',
            borderRadius:'15px',
            border:'none',
            width:'300px',
            fontSize:'16px'
          }}
        />

      </div>

      <div
        style={{
          display:'grid',
          gridTemplateColumns:
            '1fr 320px',
          gap:'20px'
        }}
      >

        <div>

          {!admin && (

            <div style={glass}>

              <h2>
                Acceso Administrador
              </h2>

              <input
                placeholder='Usuario'
                value={user}
                onChange={(e)=>
                  setUser(e.target.value)
                }
                style={input}
              />

              <input
                type='password'
                placeholder='Contraseña'
                value={pass}
                onChange={(e)=>
                  setPass(e.target.value)
                }
                style={input}
              />

              <button
                onClick={loginAdmin}
                style={button}
              >
                Entrar
              </button>

            </div>

          )}

          {admin && (

            <div style={glass}>

              <h2>
                Panel Administrador
              </h2>

              <input
                placeholder='Nombre'
                value={name}
                onChange={(e)=>
                  setName(e.target.value)
                }
                style={input}
              />

              <input
                placeholder='Precio'
                value={price}
                onChange={(e)=>
                  setPrice(e.target.value)
                }
                style={input}
              />

              <input
                placeholder='Categoría'
                value={category}
                onChange={(e)=>
                  setCategory(e.target.value)
                }
                style={input}
              />

              <input
                placeholder='URL Imagen'
                value={image}
                onChange={(e)=>
                  setImage(e.target.value)
                }
                style={input}
              />

              <button
                onClick={addProduct}
                style={button}
              >
                Añadir Producto
              </button>

            </div>

          )}

          <div
            style={{
              display:'grid',
              gridTemplateColumns:
                'repeat(auto-fit,minmax(260px,1fr))',
              gap:'20px',
              marginTop:'20px'
            }}
          >

            {filteredProducts.map((product)=>(

              <motion.div
                whileHover={{
                  y:-10,
                  scale:1.03
                }}
                transition={{
                  duration:0.2
                }}
                key={product.id}
                style={{
                  background:'white',
                  borderRadius:'25px',
                  overflow:'hidden',
                  color:'black',
                  boxShadow:
                    '0 10px 30px rgba(0,0,0,0.3)'
                }}
              >

                <img
                  src={product.image}
                  style={{
                    width:'100%',
                    height:'230px',
                    objectFit:'cover'
                  }}
                />

                <div
                  style={{
                    padding:'20px'
                  }}
                >

                  <p
                    style={{
                      color:'gray'
                    }}
                  >
                    {product.category}
                  </p>

                  <h2>
                    {product.name}
                  </h2>

                  <h3>
                    ${product.price}
                  </h3>

                  {!product.sold ? (

                    <button
                      onClick={()=>
                        addToCart(product)
                      }
                      style={button}
                    >
                      Añadir al carrito
                    </button>

                  ) : (

                    <button
                      style={soldButton}
                    >
                      VENDIDO
                    </button>

                  )}

                  {admin && (

                    <div
                      style={{
                        display:'flex',
                        gap:'10px',
                        marginTop:'10px'
                      }}
                    >

                      <button
                        onClick={()=>
                          toggleSold(
                            product.id,
                            product.sold
                          )
                        }
                        style={yellowButton}
                      >
                        Estado
                      </button>

                      <button
                        onClick={()=>
                          deleteProduct(product.id)
                        }
                        style={redButton}
                      >
                        Eliminar
                      </button>

                    </div>

                  )}

                </div>

              </motion.div>

            ))}

          </div>

        </div>

        <div style={glass}>

          <h2>
            Carrito 🛒
          </h2>

          {cart.length === 0 && (
            <p>
              No hay productos
            </p>
          )}

          {cart.map((item,index)=>(

            <div
              key={index}
              style={{
                marginBottom:'15px',
                borderBottom:
                  '1px solid rgba(255,255,255,0.2)',
                paddingBottom:'10px'
              }}
            >

              <h4>
                {item.name}
              </h4>

              <p>
                ${item.price}
              </p>

              <button
                onClick={()=>
                  removeFromCart(index)
                }
                style={redButton}
              >
                Eliminar
              </button>

            </div>

          ))}

          <h3>
            Total: $
            {cart.reduce(
              (acc,item)=>
              acc + Number(item.price),
              0
            )}
          </h3>

          <button
            onClick={sendWhatsApp}
            style={{
              ...button,
              background:'#25D366',
              marginTop:'20px'
            }}
          >
            Pedir por WhatsApp
          </button>

        </div>

      </div>

    </main>
  )
}

const glass = {
  background:'rgba(255,255,255,0.1)',
  backdropFilter:'blur(12px)',
  padding:'20px',
  borderRadius:'25px'
}

const input = {
  width:'100%',
  padding:'14px',
  borderRadius:'12px',
  border:'none',
  marginBottom:'10px',
  fontSize:'16px'
}

const button = {
  width:'100%',
  padding:'14px',
  borderRadius:'14px',
  border:'none',
  background:'#2563eb',
  color:'white',
  fontSize:'16px',
  cursor:'pointer'
}

const soldButton = {
  width:'100%',
  padding:'14px',
  borderRadius:'14px',
  border:'none',
  background:'red',
  color:'white'
}

const redButton = {
  background:'red',
  color:'white',
  border:'none',
  padding:'10px',
  borderRadius:'10px',
  cursor:'pointer'
}

const yellowButton = {
  background:'#f59e0b',
  color:'white',
  border:'none',
  padding:'10px',
  borderRadius:'10px',
  cursor:'pointer'
}