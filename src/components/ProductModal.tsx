'use client'

import { useState } from 'react'

export default function ProductModal({
  product,
  onClose,
  addToCart
}:any){

  const images =
    product.images
    ? product.images.split(',')
    : [product.image]

  const [mainImage,setMainImage] =
    useState(images[0])

  const [quantity,setQuantity] =
    useState(1)

  return (

    <div className='fixed inset-0 bg-black/70 z-50 flex justify-center items-center p-5'>

      <div className='bg-white rounded-3xl max-w-6xl w-full max-h-[95vh] overflow-auto p-6 relative'>

        <button
          onClick={onClose}
          className='absolute top-5 right-5 text-4xl'
        >
          ×
        </button>

        <div className='grid lg:grid-cols-2 gap-10'>

          <div>

            <img
              src={mainImage}
              className='w-full rounded-3xl h-[500px] object-cover'
            />

            <div className='flex gap-3 mt-4 overflow-auto'>

              {images.map((img:string,index:number)=>(

                <img
                  key={index}
                  src={img}
                  onClick={()=>
                    setMainImage(img)
                  }
                  className='w-24 h-24 rounded-2xl object-cover cursor-pointer border-4 border-transparent hover:border-yellow-400'
                />

              ))}

            </div>

          </div>

          <div>

            <h1 className='text-5xl font-black'>
              {product.name}
            </h1>

            <p className='text-yellow-500 text-4xl font-black mt-6'>
              Bs. {product.price}
            </p>

            <p className='mt-6 text-slate-600 leading-relaxed text-lg'>
              {product.description}
            </p>

            <div className='mt-6'>

              <p className='font-bold'>
                Stock disponible:
                {' '}
                {product.stock}
              </p>

            </div>

            <div className='mt-8'>

              <label className='font-bold text-lg'>
                Cantidad
              </label>

              <input
                type='number'
                min='1'
                max={product.stock}
                value={quantity}
                onChange={(e)=>
                  setQuantity(Number(e.target.value))
                }
                className='w-full p-4 border rounded-2xl mt-3'
              />

            </div>

            <button
              onClick={()=>
                addToCart(product,quantity)
              }
              className='bg-blue-950 text-white w-full p-5 rounded-2xl mt-8 text-xl font-black hover:bg-black'
            >
              Añadir a la lista
            </button>

          </div>

        </div>

      </div>

    </div>
  )
}