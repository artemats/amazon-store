import Layout from "../components/Layout";
import {Row} from "react-bootstrap";
import ProductItem from "../components/ProductItem";
import db from "../utils/db";
import Product from "../models/ProductModel";

export default function Home({ products }) {
  return (
    <Layout title="Home">
      <Row>
        { products.map((product, index) => <ProductItem product={product} key={index}/>) }
      </Row>
    </Layout>
  )
}

export async function getServerSideProps() {
  await db.dbConnect();
  const products = await Product.find().lean();
  return {
    props: {
      products: products.map(db.convertDocToObj)
    },
  }
}
