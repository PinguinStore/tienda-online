'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../src/lib/supabase'

import Header from '../src/components/Header'
import ProductCard from '../src/components/ProductCard'
import ProductModal from '../src/components/ProductModal'
import CartSidebar from '../src/components/CartSidebar'
import CheckoutModal from '../src/components/CheckoutModal'
import AdminPanel from '../src/components/AdminPanel'

export default function Home() {

  const [products,setProducts] = useState<any[]>([])
  const [cart,setCart] = useState<any[]>([])

  const [selectedProduct,setSelectedProduct] = useState<any>(null)

  const [showCheckout,setShowCheckout] = useState(false)

  const [search,setSearch] = useState('')

  useEffect(()=>{
    getProducts()
  },[])

  async function getProducts(){

    const { data } = await supabase
      .from('products')
      .select('*')
      .order('id',{ ascending:false })

    if(data){
      setProducts(data)
    }
  }

  function addToCart(product:any, quantity:number){

    const newItem = {
      ...product,
      quantity
    }

    setCart([...cart,newItem])

    setSelectedProduct(null)

    const continueShopping = confirm(
      '¿Deseas seguir comprando?'
    )

    if(!continueShopping){
      setShowCheckout(true)
    }
  }

  function removeCart(index:number){

    const updated = [...cart]

    updated.splice(index,1)

    setCart(updated)
  }

  const filteredProducts =
    products.filter((item)=>
      item.name
      .toLowerCase()
      .includes(search.toLowerCase())
    )

  return (

    <main className='min-h-screen bg-slate-100'>

      <Header
        cart={cart}
        search={search}
        setSearch={setSearch}
      />

      <section className='max-w-7xl mx-auto p-5'>

        <AdminPanel refresh={getProducts} />

        <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6'>

          {filteredProducts.map((product)=>(

            <ProductCard
              key={product.id}
              product={product}
              onClick={()=>
                setSelectedProduct(product)
              }
            />

          ))}

        </div>

      </section>

      <CartSidebar
        cart={cart}
        removeCart={removeCart}
        openCheckout={()=>
          setShowCheckout(true)
        }
      />

      {selectedProduct && (

        <ProductModal
          product={selectedProduct}
          onClose={()=>
            setSelectedProduct(null)
          }
          addToCart={addToCart}
        />

      )}

      {showCheckout && (

        <CheckoutModal
          cart={cart}
          onClose={()=>
            setShowCheckout(false)
          }
        />

      )}

    </main>
  )
}