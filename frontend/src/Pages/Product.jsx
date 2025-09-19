import React, {useContext, useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import Breadcrum from '../components/Breadcrums/Breadcrum';
import {ShopContext} from '../context/ShopContext'
import ProductDisplay from '../components/ProductDisplay/ProductDisplay';

const Product=()=> {
  const{all_product}=useContext(ShopContext)
  const {productId}=useParams();
  const [product,setProduct] = useState()
  useEffect(() => {
    console.log(all_product);
    console.log(productId)
    console.log(all_product?.find((p) => p.id === Number(productId)));
    setProduct(
      all_product?.find((p) => p.id === Number(productId))
    )
  },[])
  return (
    <div>
      {
        product &&
         <>
          <h1>{product.name}</h1>
          <Breadcrum product={product}/>
          <ProductDisplay product={product}/>
         </>
      }
    </div>
  )
}
export default Product
