import React, { useContext } from 'react'
import './CSS/ShopCategory.css'
import { ShopContext } from '../context/ShopContext'
import dropdown_icon from '../components/Assets/dropdown_icon.png'
import Item from '../components/Item/Item'
export default function ShopCategory (props) {
  const {all_product}= useContext(ShopContext);
  return (
    <div className='shop-category'>
      <img className='shopcategory-banner' src={props.banner} alt=''/>
      <div className='shopcategory-indexSort'>
        <p>
          <span>showing 1-12</span>out of 36 products
        </p>
        <div className='shopcategory-sort'>
          sort by <img src={dropdown_icon} alt=''/>
        </div>
      </div>
      <div className='shopcategory-products'>
        {all_product.map((item,index)=>{
        if (props.category===item.category){
        return <Item
        item={item}
        key={index}
        />
        }
       else{
        return null;
       }
})}
      </div>
      <div className="shopcategory-loadmore">
        Explore More
      </div>
    </div>
  )
}
