import { FaShoppingCart } from 'react-icons/fa'

export default function Header({
  cart,
  search,
  setSearch
}:any){

  return (

    <header className='bg-[#020617] sticky top-0 z-50 shadow-xl'>

      <div className='max-w-7xl mx-auto flex flex-wrap gap-5 items-center justify-between p-5'>

        <div className='flex items-center gap-4'>

          <img
            src='/logo.png'
            className='w-16 h-16 object-contain'
          />

          <div>

            <h1 className='text-3xl font-black text-yellow-400'>
              ALDRSTORE
            </h1>

            <p className='text-slate-300 text-sm'>
              Todo tipo Amazon
            </p>

          </div>

        </div>

        <input
          placeholder='Buscar productos...'
          value={search}
          onChange={(e)=>
            setSearch(e.target.value)
          }
          className='flex-1 min-w-[250px] max-w-xl p-4 rounded-2xl outline-none'
        />

        <div className='bg-yellow-400 text-black px-5 py-3 rounded-2xl flex items-center gap-3 font-black'>

          <FaShoppingCart size={24} />

          <span>
            {cart.length}
          </span>

        </div>

      </div>

    </header>
  )
}