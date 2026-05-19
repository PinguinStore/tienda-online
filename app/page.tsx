'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../src/lib/supabase'
import { motion } from 'framer-motion'

export default function Home() {

  const [products, setProducts] = useState<any[]>([])
  const [cart, setCart] = useState<any[]>([])

  const [admin, setAdmin] = useState(false)

  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')

  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [image, setImage] = useState('')

  const ADMIN_USER = 'Aldair'
  const ADMIN_PASS = '30012022'

  useEffect(() => {
    getProducts()
  }, [])

  async function getProducts() {

    const { data } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: false })

    if(data) {
      setProducts(data)
    }
  }

  function addToCart(product:any) {
    setCart([...cart, product])
  }

  function removeFromCart(index:number) {

    const newCart = [...cart]

    newCart.splice(index, 1)

    setCart(newCart)
  }

  function loginAdmin() {

    if(
      user === ADMIN_USER &&
      pass === ADMIN_PASS
    ) {
      setAdmin(true)
      alert('Bienvenido administrador')
    }
    else {
      alert('Datos incorrectos')
    }
  }

  async function addProduct() {

    if(
      !name ||
      !price ||
      !category ||
      !image
    ) {
      alert('Completa todos los campos')
      return
    }

    await supabase
      .from('products')
      .insert([
        {
          name,
          price,
          category,
          image,
          sold: false
        }
      ])

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

  function sendWhatsApp() {

    if(cart.length === 0) {
      alert('Carrito vacío')
      return
    }

    const text = cart.map(
      (item, index) =>
      `${index + 1}. ${item.name} - $${item.price}`
    ).join('%0A')

    const total = cart.reduce(
      (acc, item) =>
      acc + Number(item.price),
      0
    )

    const phone = '59169580486'

    const url =
      `https://wa.me/${phone}?text=` +
      `Hola,%20quiero%20comprar:%0A${text}%0A%0ATotal:%20$${total}`

    window.open(url, '_blank')
  }

  return (

    <main
      style={{
        background:
          'linear-gradient(to bottom,#f5f7fa,#e4ecf5)',
        minHeight: '100vh',
        padding: '20px',
        fontFamily: 'Arial'
      }}
    >

      <div
        style={{
          display:'flex',
          justifyContent:'space-between',
          alignItems:'center',
          marginBottom:'30px',
          flexWrap:'wrap',
          gap:'20px'
        }}
      >

        <div>

          <h1
            style={{
              fontSize:'42px',
              fontWeight:'bold'
            }}
          >
            ALDAIR STORE
          </h1>

          <p>
            Tienda online moderna 🚀
          </p>

        </div>

        <div
          style={{
            background:'white',
            padding:'15px',
            borderRadius:'20px',
            minWidth:'280px',
            boxShadow:'0 4px 15px rgba(0,0,0,0.1)'
          }}
        >

          {!admin ? (

            <>

              <h3>Administrador</h3>

              <input
                placeholder='Usuario'
                value={user}
                onChange={(e)=>
                  setUser(e.target.value)
                }
                style={inputStyle}
              />

              <input
                type='password'
                placeholder='Contraseña'
                value={pass}
                onChange={(e)=>
                  setPass(e.target.value)
                }
                style={inputStyle}
              />

              <button
                onClick={loginAdmin}
                style={blackButton}
              >
                Ingresar
              </button>

            </>

          ) : (

            <>

              <h3>
                Panel Administrador
              </h3>

              <input
                placeholder='Nombre'
                value={name}
                onChange={(e)=>
                  setName(e.target.value)
                }
                style={inputStyle}
              />

              <input
                placeholder='Precio'
                value={price}
                onChange={(e)=>
                  setPrice(e.target.value)
                }
                style={inputStyle}
              />

              <input
                placeholder='Categoría'
                value={category}
                onChange={(e)=>
                  setCategory(e.target.value)
                }
                style={inputStyle}
              />

              <input
                placeholder='URL Imagen'
                value={image}
                onChange={(e)=>
                  setImage(e.target.value)
                }
                style={inputStyle}
              />

              <button
                onClick={addProduct}
                style={blackButton}
              >
                Añadir Producto
              </button>

            </>

          )}

        </div>

      </div>

      <div
        style={{
          display:'grid',
          gridTemplateColumns:
            '3fr 1fr',
          gap:'20px'
        }}
      >

        <div
          style={{
            display:'grid',
            gridTemplateColumns:
              'repeat(auto-fit,minmax(250px,1fr))',
            gap:'20px'
          }}
        >

          {products.map((product)=>(

            <motion.div
              whileHover={{
                scale:1.03
              }}
              key={product.id}
              style={{
                background:'white',
                borderRadius:'25px',
                overflow:'hidden',
                boxShadow:
                  '0 6px 20px rgba(0,0,0,0.1)'
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

                <h3>
                  ${product.price}
                </h3>

                {product.sold ? (

                  <button
                    style={{
                      ...redButton,
                      width:'100%'
                    }}
                  >
                    VENDIDO
                  </button>

                ) : (

                  <button
                    onClick={()=>
                      addToCart(product)
                    }
                    style={{
                      ...blackButton,
                      width:'100%'
                    }}
                  >
                    Añadir al carrito
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

        <div
          style={{
            background:'white',
            padding:'20px',
            borderRadius:'25px',
            height:'fit-content',
            position:'sticky',
            top:'20px',
            boxShadow:
              '0 4px 20px rgba(0,0,0,0.1)'
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
                borderBottom:
                  '1px solid #ddd',
                marginBottom:'10px',
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
              background:'#25D366',
              color:'white',
              border:'none',
              width:'100%',
              padding:'15px',
              borderRadius:'15px',
              fontSize:'18px',
              cursor:'pointer'
            }}
          >
            Pedir por WhatsApp
          </button>

        </div>

      </div>

    </main>
  )
}

const inputStyle = {
  width:'100%',
  padding:'12px',
  marginBottom:'10px',
  borderRadius:'12px',
  border:'1px solid #ddd'
}

const blackButton = {
  background:'black',
  color:'white',
  border:'none',
  padding:'12px',
  borderRadius:'12px',
  cursor:'pointer'
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
  background:'#f4b400',
  color:'white',
  border:'none',
  padding:'10px',
  borderRadius:'10px',
  cursor:'pointer'
}