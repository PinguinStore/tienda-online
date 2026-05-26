import { motion } from 'framer-motion'

export default function ProductCard({
  product,
  onClick
}:any){

  return (

    <motion.div
      whileHover={{
        y:-8,
        scale:1.02
      }}
      onClick={onClick}
      className='bg-white rounded-3xl overflow-hidden shadow-lg cursor-pointer'
    >

      <img
        src={product.image}
        className='w-full aspect-square object-cover'
      />

      <div className='p-4'>

        <h2 className='font-bold text-lg line-clamp-2'>
          {product.name}
        </h2>

        <p className='text-yellow-500 font-black text-2xl mt-2'>
          Bs. {product.price}
        </p>

      </div>

    </motion.div>
  )
}