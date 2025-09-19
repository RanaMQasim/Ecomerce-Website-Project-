import React from 'react'
import './NewCollections.css'
import new_collection from '../Assets/new_collections'
import Item from '../Item/Item'
const NewCollections = () => {
  return (
    <div className='new-collections'>
        <h1>NEW COLLECTIONS </h1>
        <hr/>
        <div className='collections'>
            {new_collection.map((item,index)=>{
                return <Item
                item={item}
                key={index}
                />
            })}

        </div>
    </div>
  )
}

export default NewCollections

