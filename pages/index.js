import {Layout} from '@/components/Layout'
import { ProductItems } from '@/components/ProductItem'
import db from '@/utils/db'
import Product from '@/models/Product'

export default function Home({products}) {
  return (
    <Layout title="Homepage">
      <div className='grid grid-cols-5 gap-2 md:grid-cols-3 lg:grid-cols-5'>
        {products.map(product => (
          <ProductItems product={product} key={product.slug}></ProductItems>
        ))}
      </div>
    </Layout>
  )
}


export const getServerSideProps = async () => {
  await db.connect();
  const products = await Product.find().lean();
  return {
    props: {
      products: products.map(db.convertDocToObjects)
    }
  }
}