'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../src/lib/supabase'

export default function Home() {

  const [products, setProducts] = useState<any[]>([])
  const [cart, setCart] = useState<any[]>([])

  useEffect(() => {
    getProducts()
  }, [])

  async function getProducts() {

    const { data } = await supabase
      .from('products')
      .select('*')

    if (data) {
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
      (acc, item) => acc + Number(item.price),
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
        padding: '30px',
        background: '#f3f3f3',
        minHeight: '100vh',
        fontFamily: 'Arial'
      }}
    >

      <h1
        style={{
          fontSize: '40px',
          marginBottom: '30px'
        }}
      >
        ALDAIR STORE
      </h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '3fr 1fr',
          gap: '20px'
        }}
      >

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit,minmax(250px,1fr))',
            gap: '20px'
          }}
        >

          {products.map((product) => (

            <div
              key={product.id}
              style={{
                background: 'white',
                padding: '20px',
                borderRadius: '20px'
              }}
            >

              <img
                src={product.image}
                style={{
                  width: '100%',
                  height: '220px',
                  objectFit: 'cover',
                  borderRadius: '15px'
                }}
              />

              <h2>{product.name}</h2>

              <p>{product.category}</p>

              <h3>${product.price}</h3>

              {product.sold ? (

                <button
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'red',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px'
                  }}
                >
                  VENDIDO
                </button>

              ) : (

                <button
                  onClick={() => addToCart(product)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'black',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer'
                  }}
                >
                  Añadir al carrito
                </button>

              )}

            </div>

          ))}

        </div>

        <div
          style={{
            background: 'white',
            padding: '20px',
            borderRadius: '20px',
            height: 'fit-content',
            position: 'sticky',
            top: '20px'
          }}
        >

          <h2>Carrito</h2>

          {cart.length === 0 && (
            <p>No hay productos</p>
          )}

          {cart.map((item, index) => (

            <div
              key={index}
              style={{
                borderBottom: '1px solid #ddd',
                paddingBottom: '10px',
                marginBottom: '10px'
              }}
            >

              <h4>{item.name}</h4>

              <p>${item.price}</p>

              <button
                onClick={() => removeFromCart(index)}
                style={{
                  background: 'red',
                  color: 'white',
                  border: 'none',
                  padding: '6px 10px',
                  borderRadius: '8px'
                }}
              >
                Eliminar
              </button>

            </div>

          ))}

          <h3>
            Total: $
            {cart.reduce(
              (acc, item) =>
                acc + Number(item.price),
              0
            )}
          </h3>

          <button
            onClick={sendWhatsApp}
            style={{
              width: '100%',
              padding: '15px',
              background: 'green',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '18px',
              cursor: 'pointer'
            }}
          >
            Pedir por WhatsApp
          </button>

        </div>

      </div>

    </main>
  )
}