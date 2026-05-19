'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../src/lib/supabase'
import { motion } from 'framer-motion'
import {
  FaShoppingCart,
  FaTrash,
  FaUserShield
} from 'react-icons/fa'

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
      alert('Bienvenido administrador')
    }
    else {
      alert('Usuario incorrecto')
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

    const phone = '59170000000'

    const url =
      `https://wa.me/${phone}?text=` +
      `Hola,%20quiero%20comprar:%0A${text}%0A%0ATotal:%20$${total}`

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
        background:'#f3f4f6',
        minHeight:'100vh',
        fontFamily:'Arial'
      }}
    >

      <header
        style={{
          background:'#131921',
          padding:'15px 30px',
          color:'white',
          display:'flex',
          justifyContent:'space-between',
          alignItems:'center',
          flexWrap:'wrap',
          gap:'20px',
          position:'sticky',
          top:0,
          zIndex:1000
        }}
      >

        <div
          style={{
            display:'flex',
            alignItems:'center',
            gap:'10px'
          }}
        >

          <img
            src='https://cdn-icons-png.flaticon.com/512/3081/3081559.png'
            style={{
              width:'50px'
            }}
          />

          <h1>
            ALDAIR STORE
          </h1>

        </div>

        <input
          placeholder='Buscar productos...'
          value={search}
          onChange={(e)=>
            setSearch(e.target.value)
          }
          style={{
            width:'400px',
            maxWidth:'100%',
            padding:'14px',
            borderRadius:'10px',
            border:'none'
          }}
        />

        <div
          style={{
            display:'flex',
            alignItems:'center',
            gap:'15px'
          }}
        >

          <FaShoppingCart size={30} />

          <span>
            {cart.length}
          </span>

        </div>

      </header>

      <section
        style={{
          background:
            'linear-gradient(to right,#2563eb,#1e3a8a)',
          color:'white',
          padding:'60px 30px',
          textAlign:'center'
        }}
      >

        <motion.h1
          initial={{ opacity:0,y:-40 }}
          animate={{ opacity:1,y:0 }}
          transition={{ duration:0.7 }}
          style={{
            fontSize:'55px',
            marginBottom:'20px'
          }}
        >
          Bienvenido a Aldair Store
        </motion.h1>

        <p
          style={{
            fontSize:'22px'
          }}
        >
          Compra productos increíbles 🚀
        </p>

      </section>

      <div
        style={{
          display:'grid',
          gridTemplateColumns:
            '1fr 320px',
          gap:'20px',
          padding:'20px'
        }}
      >

        <div>

          {!admin ? (

            <div style={adminBox}>

              <h2>
                <FaUserShield />
                Administrador
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
                Ingresar
              </button>

            </div>

          ) : (

            <div style={adminBox}>

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
                key={product.id}
                whileHover={{
                  y:-8,
                  scale:1.02
                }}
                style={{
                  background:'white',
                  borderRadius:'20px',
                  overflow:'hidden',
                  boxShadow:
                    '0 10px 25px rgba(0,0,0,0.1)'
                }}
              >

                <img
                  src={product.image}
                  style={{
                    width:'100%',
                    height:'240px',
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

                  <h3
                    style={{
                      color:'#2563eb'
                    }}
                  >
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
                        <FaTrash />
                      </button>

                    </div>

                  )}

                </div>

              </motion.div>

            ))}

          </div>

        </div>

        <div
          style={{
            background:'white',
            borderRadius:'20px',
            padding:'20px',
            height:'fit-content',
            position:'sticky',
            top:'100px',
            boxShadow:
              '0 10px 25px rgba(0,0,0,0.1)'
          }}
        >

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
                borderBottom:'1px solid #ddd',
                paddingBottom:'10px',
                marginBottom:'10px'
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

const adminBox = {
  background:'white',
  padding:'20px',
  borderRadius:'20px',
  boxShadow:'0 10px 25px rgba(0,0,0,0.1)'
}

const input = {
  width:'100%',
  padding:'14px',
  marginBottom:'10px',
  borderRadius:'10px',
  border:'1px solid #ddd'
}

const button = {
  width:'100%',
  padding:'14px',
  borderRadius:'12px',
  border:'none',
  background:'#2563eb',
  color:'white',
  cursor:'pointer',
  fontSize:'16px'
}

const soldButton = {
  width:'100%',
  padding:'14px',
  borderRadius:'12px',
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