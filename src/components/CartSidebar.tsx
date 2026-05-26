export default function CartSidebar({
  cart,
  removeCart,
  openCheckout
}:any){

  return (

    <div className='fixed bottom-5 right-5 bg-white rounded-3xl shadow-2xl p-5 w-96 max-h-[80vh] overflow-auto z-40'>

      <h2 className='text-3xl font-black mb-5'>
        Lista 🛒
      </h2>

      {cart.length === 0 && (
        <p>No hay productos</p>
      )}

      <div className='grid gap-4'>

        {cart.map((item:any,index:number)=>(

          <div
            key={index}
            className='border-b pb-4'
          >

            <h3 className='font-black'>
              {item.name}
            </h3>

            <p>
              Cantidad:
              {' '}
              {item.quantity}
            </p>

            <p className='text-yellow-500 font-black'>
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

      </div>

      {cart.length > 0 && (

        <button
          onClick={openCheckout}
          className='bg-green-500 text-white w-full p-5 rounded-2xl mt-5 font-black text-xl'
        >
          Realizar pedido
        </button>

      )}

    </div>
  )
}