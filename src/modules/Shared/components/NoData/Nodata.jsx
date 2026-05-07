import React from 'react'
import noDataImg from '../../../../assets/images/no-data.png'
export default function Nodata() {
  return (
    <>
    <div className='text-center'>
      <img src={noDataImg} alt="" />
      <h3>No Data!</h3>
      </div>
    </>
  )
}
