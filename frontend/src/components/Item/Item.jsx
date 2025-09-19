import React from 'react'
import './Item.css'
import Product from '../../Pages/Product'
import {Link} from 'react-router-dom';
const Item = (props) => {
  return (
    <div className='item'>
    <Link to={`/product/${props.item.id}`}><img src={props.item.image} alt=''/></Link>
    <p>{props.item.name}</p>
    <div className='item-prices'>
    <div className='item-price-new'>
            ${props.item.new_price}
    </div>
    <div className='item-price-old'>
            ${props.item.old_price}

    </div>
    </div>
    </div>
  )
}
export default Item
