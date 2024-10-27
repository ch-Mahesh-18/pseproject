import React from 'react'
import CategoryList from '../components/CategoryList'
import BannerProduct from '../components/BannerProduct'
import HorizontalCardProduct from '../components/HorizontalCardProduct'
import VerticalCardProduct from '../components/VerticalCardProduct'

const Home = () => {
  return (
    <div>
      <CategoryList/>
      <BannerProduct/>

      <VerticalCardProduct category={"airpodes"} heading={"Top's Airpodes"}/>
      <VerticalCardProduct category={"watches"} heading={"Popular's Watches"}/>

      <VerticalCardProduct category={"mobiles"} heading={"New Arrivals in Mobiles"}/>
      <VerticalCardProduct category={"Mouse"} heading={"Mouse"}/>
      <VerticalCardProduct category={"Laptops"} heading={"Laptops"}/>
      <VerticalCardProduct category={"televisions"} heading={" Must have Televisions"}/>
      <VerticalCardProduct category={"camera"} heading={"Best Camera & Photography"}/>
      <VerticalCardProduct category={"earphones"} heading={"Wired Earphones"}/>
      <VerticalCardProduct category={"speakers"} heading={"Bluetooth Speakers"}/>
      <VerticalCardProduct category={"refrigerator"} heading={"Refrigerator"}/>
      <VerticalCardProduct category={"trimmers"} heading={"Trimmers"}/>
    </div>
  )
}

export default Home