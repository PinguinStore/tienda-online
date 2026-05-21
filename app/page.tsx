'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { motion } from 'framer-motion'
import {
  FaShoppingCart,
  FaTrash,
  FaUserShield,
  FaMapMarkerAlt,
  FaWhatsapp
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
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')

  const [department, setDepartment] = useState('La Paz')

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
          description,
          location,
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
    setDescription('')
    setLocation('')

    getProducts()
  }

  async function deleteProduct(id:number) {

    await supabase
      .from('products')
      .delete()
      .eq('id', id)

    getProducts()
  }

  async function toggleSold(id:number,sold:boolean) {

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
        `${index+1}. ${item.name}
Precio: Bs. ${item.price}
Ubicación: ${item.location}`
    ).join('%0A%0A')

    const total = cart.reduce(
      (acc,item)=>
      acc + Number(item.price),
      0
    )

    const phone = '59169580486'

    const url =
      `https://wa.me/${phone}?text=` +
      `Hola,%20quiero%20comprar:%0A%0A${text}%0A%0ADepartamento%20de%20entrega:%20${department}%0A%0ATotal:%20Bs.${total}`

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
        background:'#f1f5f9',
        minHeight:'100vh',
        fontFamily:'Arial'
      }}
    >

      <header
        style={{
          background:'#0f172a',
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
            gap:'15px'
          }}
        >

          <img
            src='https://cdn-icons-png.flaticon.com/512/3081/3081559.png'
            style={{
              width:'55px'
            }}
          />

          <div>

            <h1
              style={{
                margin:0
              }}
            >
              ADRIANSTORE
            </h1>

            <p
              style={{
                margin:0,
                color:'#cbd5e1'
              }}
            >
              Tienda online Bolivia
            </p>

          </div>

        </div>

        <input
          placeholder='Buscar productos...'
          value={search}
          onChange={(e)=>
            setSearch(e.target.value)
          }
          style={{
            width:'450px',
            maxWidth:'100%',
            padding:'15px',
            borderRadius:'14px',
            border:'none',
            outline:'none'
          }}
        />

        <div
          style={{
            display:'flex',
            alignItems:'center',
            gap:'10px',
            fontSize:'20px'
          }}
        >

          <FaShoppingCart />

          {cart.length}

        </div>

      </header>

      <section
        style={{
          background:
          'linear-gradient(to right,#2563eb,#7c3aed)',
          padding:'80px 20px',
          textAlign:'center',
          color:'white'
        }}
      >

        <motion.h1
          initial={{ opacity:0,y:-50 }}
          animate={{ opacity:1,y:0 }}
          transition={{ duration:0.7 }}
          style={{
            fontSize:'60px',
            marginBottom:'20px'
          }}
        >
          Compra fácil y rápido 🚀
        </motion.h1>

        <p
          style={{
            fontSize:'22px'
          }}
        >
          Productos modernos para toda Bolivia
        </p>

      </section>

      <div
        style={{
          display:'grid',
          gridTemplateColumns:'1fr 340px',
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
                placeholder='Descripción'
                value={description}
                onChange={(e)=>
                  setDescription(e.target.value)
                }
                style={input}
              />

              <input
                placeholder='Ubicación'
                value={location}
                onChange={(e)=>
                  setLocation(e.target.value)
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
              'repeat(auto-fit,minmax(280px,1fr))',
              gap:'25px',
              marginTop:'25px'
            }}
          >

            {filteredProducts.map((product)=>(

              <motion.div
                key={product.id}
                whileHover={{
                  scale:1.03,
                  y:-5
                }}
                style={{
                  background:'white',
                  borderRadius:'24px',
                  overflow:'hidden',
                  boxShadow:
                  '0 10px 30px rgba(0,0,0,0.1)'
                }}
              >

                <img
                  src={product.image}
                  style={{
                    width:'100%',
                    height:'260px',
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
                      color:'#64748b'
                    }}
                  >
                    {product.category}
                  </p>

                  <h2>
                    {product.name}
                  </h2>

                  <p
                    style={{
                      color:'#475569',
                      minHeight:'60px'
                    }}
                  >
                    {product.description}
                  </p>

                  <div
                    style={{
                      display:'flex',
                      alignItems:'center',
                      gap:'6px',
                      color:'#2563eb',
                      marginBottom:'10px'
                    }}
                  >

                    <FaMapMarkerAlt />

                    {product.location}

                  </div>

                  <h3
                    style={{
                      color:'#2563eb',
                      fontSize:'28px'
                    }}
                  >
                    Bs. {product.price}
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
            borderRadius:'24px',
            padding:'20px',
            height:'fit-content',
            position:'sticky',
            top:'90px',
            boxShadow:
            '0 10px 30px rgba(0,0,0,0.1)'
          }}
        >

          <h2>
            Carrito 🛒
          </h2>

          <select
            value={department}
            onChange={(e)=>
              setDepartment(e.target.value)
            }
            style={input}
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
            <p>
              No hay productos
            </p>
          )}

          {cart.map((item,index)=>(

            <div
              key={index}
              style={{
                borderBottom:'1px solid #e2e8f0',
                marginBottom:'15px',
                paddingBottom:'15px'
              }}
            >

              <h4>
                {item.name}
              </h4>

              <p>
                Bs. {item.price}
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

          <h2>
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
            style={{
              ...button,
              background:'#22c55e',
              marginTop:'20px'
            }}
          >

            <FaWhatsapp />

            Pedir por WhatsApp

          </button>

        </div>

      </div>

    </main>
  )
}

const adminBox:any = {
  background:'white',
  padding:'25px',
  borderRadius:'24px',
  boxShadow:'0 10px 30px rgba(0,0,0,0.1)'
}

const input:any = {
  width:'100%',
  padding:'15px',
  marginBottom:'12px',
  borderRadius:'14px',
  border:'1px solid #dbeafe',
  outline:'none'
}

const button:any = {
  width:'100%',
  padding:'15px',
  borderRadius:'14px',
  border:'none',
  background:'#2563eb',
  color:'white',
  cursor:'pointer',
  fontSize:'16px',
  display:'flex',
  justifyContent:'center',
  alignItems:'center',
  gap:'10px'
}

const soldButton:any = {
  width:'100%',
  padding:'15px',
  borderRadius:'14px',
  border:'none',
  background:'#ef4444',
  color:'white'
}

const redButton:any = {
  background:'#ef4444',
  color:'white',
  border:'none',
  padding:'10px',
  borderRadius:'10px',
  cursor:'pointer'
}

const yellowButton:any = {
  background:'#f59e0b',
  color:'white',
  border:'none',
  padding:'10px',
  borderRadius:'10px',
  cursor:'pointer'
}