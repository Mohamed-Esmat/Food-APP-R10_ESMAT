import React from 'react'
import noDataImg from '../../../../assets/images/no-data.png'

export default function DeleteConfirmation({deleteItem,itemName}) {
  return (
    <>
            <img className='img-fluid' src={noDataImg} alt="" />
            <h5 className='my-2'>Delete this {deleteItem}?</h5>
            <p>are you sure you want to delete {itemName} ? if you are sure just click on delete it</p>

    </>
  )
}
