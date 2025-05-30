import React, { useEffect, useState } from 'react'
import { usePasStore } from '../../../store/pasStore'
import toast from 'react-hot-toast'
import { X } from 'lucide-react';
import { formatDate } from '../../../utils/date';

const FoodOrder = ({patient}) => {
  const {addFoodOrder, getFoodOrders, getPatientFoodOrderHistory, 
    getCanteenItems, setFoodPaidStatus,setFullFoodPaidStatus} =  usePasStore();
  const [items, setItems] = useState([]);
  const [purchasedItems, setPurchasedItems] = useState([]);
  const [count, setCount] = useState(0);
  const [foodItems,setFoodItems] = useState([]);
  const [buyDate,setBuyDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedItem, setSelectedItem] = useState({});
  const [quantity, setQuantity] = useState(0);
  const [total, setTotal] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [purTotal, setPurTotal] = useState(0);
  
  useEffect(()=>{
    console.log(patient)
    const fetchItems = async ()=>{
      const items = await getCanteenItems();
      const pItems = await getFoodOrders(patient.patient_code,buyDate);
      setPurchasedItems(pItems);
      setFoodItems(items);
    } 
     fetchItems();
    setItems([]);
  },[count,patient,buyDate]);

  useEffect(()=>{
    const sumTotal = items.reduce((acc, item) => acc + item.total_price, 0);
    setTotal(sumTotal)
  },[items]);

  useEffect(()=>{
    const sumTotal = purchasedItems.filter((item)=>item.status  !== 'PAID').reduce((acc, item) => acc + (item.total_price * item.item_qty), 0);
    setPurTotal(sumTotal)
  },[purchasedItems]);

  const handleAddItem = () =>{
    console.log(selectedItem)
    if(!selectedItem || quantity === 0){
      toast.error("Please select item and enter quantity");
      return;
    }
    const itemExists = items.some(item => item.item_id === selectedItem.id);
    if (itemExists) {
      toast.error("Item already added!");
      return;
    }
    setItems((prev)=>([...prev,{item_id:selectedItem.id,name:selectedItem.item_name,
      quantity,price:selectedItem.item_price,total_price:(Number(selectedItem.item_price) * Number(quantity))}]));
    setSelectedItem({});
    setQuantity(0);
    setSelectedIndex(-1);
  }

  const handleRemoveItem = (index) =>{
    console.log(items)
    const its = [...items];
    its.splice(index, 1);
    setItems(its);
  }

  const handleItemSelect = (e)=>{    
    const index = e.target.value;
    const item = foodItems[index];
    setSelectedItem({...item});
    setSelectedIndex(index)
  }

  const handlePurchaseItems = async() =>{
    try {
      const purchasedItems = await addFoodOrder(patient.patient_code, items);
      setPurchasedItems(purchasedItems);
      setCount((prev)=> prev + 1);
      toast.success("Items purchase successful!");
    } catch (error) {
      toast.error("Error while purchase: "+error.message);
    }
  }

  const handlePurchaseHistory = async() =>{
    try {
      const purchasedItems = await getPatientFoodOrderHistory(patient.patient_code);
      setPurchasedItems(purchasedItems);
    } catch (error) {
      toast.error("Error while getting purchases: "+error.message);
    }
  }

  const handlePurchases = async() =>{
    try {
      const purchasedItems = await getFoodOrders(patient.patient_code,buyDate);
      setPurchasedItems(purchasedItems);
    } catch (error) {
      toast.error("Error while getting purchases: "+error.message);
    }
  }

  const handleItemPay = async(id) =>{
    try {
      await setFoodPaidStatus(id);
      setCount((prev)=> prev + 1);
      toast.success("Item status set to PAID");
    } catch (error) {
      toast.error("Error while setting status: "+error.message);
    }
  }

  const handleFullPay = async() =>{
    try {
      await setFullFoodPaidStatus(patient.patient_code,buyDate);
      setCount((prev)=> prev + 1);
      toast.success("All items status set to PAID");
    } catch (error) {
      toast.error("Error while setting status: "+error.message);
    }
  }


  return (
    <div className="flex  w-6xl  bg-gray-400 ">
      <div className="flex flex-col ">
        <h1 className="flex m-2 font-semibold">Pharmacy Items</h1>
        <div className="flex gap-2 m-2">
          <input type="date" value={buyDate} onChange={(e)=>setBuyDate(e.target.value)} className="bg-gray-500 p-2 rounded"/>
          <select onChange={handleItemSelect} className="bg-gray-500 p-2 rounded" value={selectedIndex}>
            <option value="-1">-Select-</option>                     
            {foodItems && foodItems.map((item,index)=>(
            <option key={item.id} value={index}>{item.item_name}</option>
            ))}          
          </select>
          <input type="number" min="0" value={quantity} onChange={(e)=>setQuantity(e.target.value)} className="bg-gray-500 p-2 rounded w-20"/>
          <button className="flex bg-blue-800 text-gray-100 w-20 p-1 
          rounded cursor-pointer hover:bg-amber-500 justify-center" onClick={handleAddItem}>Add</button>
        </div>

        <div className="flex flex-col  m-2 border-1">
          <h1 className="flex m-2 font-semibold">Item Basket</h1>
          {items.length > 0 ?
          <div className="flex flex-col h-[300px] overflow-y-auto">
            <div className="flex bg-gray-600 w-full" >
                <div className=" border-r  w-full  whitespace-nowrap truncate p-0 flex justify-center">Item-Id</div>
                <div className=" border-r  w-full  whitespace-nowrap truncate p-0 flex justify-center">Name</div>
                <div className=" border-r  w-full  whitespace-nowrap truncate p-0 flex justify-center">Quantity</div>
                <div className=" border-r  w-full  whitespace-nowrap truncate p-0 flex justify-center">Unit Price</div>
                <div className=" border-r  w-full  whitespace-nowrap truncate p-0 flex justify-center">Total Price</div>
                <div className=" border-r  w-full  whitespace-nowrap truncate p-0 flex justify-center"></div>
              </div>
          {
            items && items.map((item,index)=>(
              <div className="flex  bg-gray-400 w-full" key={item.id}>
                <div className=" border-r  w-full  whitespace-nowrap truncate p-0 flex justify-center">{item.item_id}</div>
                <div className=" border-r  w-full  whitespace-nowrap truncate p-0 flex justify-start" title={item.name}>{item.name}</div>
                <div className=" border-r  w-full  whitespace-nowrap truncate p-0 flex justify-center">{item.quantity}</div>
                <div className=" border-r  w-full  whitespace-nowrap truncate p-0 flex justify-center">{item.price}</div>
                <div className=" border-r  w-full  whitespace-nowrap truncate p-0 flex justify-center">{item.total_price}</div>
                <X className="border-r  w-full  whitespace-nowrap truncate p-0 flex justify-center" color={'yellow'} size={20} onClick={(e)=>handleRemoveItem(index)}/>
              </div>
            ))
          }
          <div className="flex bg-gray-600 w-full  bottom-0 sticky" >
            <div className=" border-r  w-full  whitespace-nowrap truncate p-0 flex justify-center"></div>
            <div className=" border-r  w-full  whitespace-nowrap truncate p-0 flex justify-center"></div>
            <div className=" border-r  w-full  whitespace-nowrap truncate p-0 flex justify-center"></div>
            <div className=" border-r  w-full  whitespace-nowrap truncate p-0 flex justify-center">Total</div>
            <div className=" border-r  w-full  whitespace-nowrap truncate p-0 flex justify-center">{total}</div>
            <div className=" border-r  w-full  whitespace-nowrap truncate p-0 flex justify-center">
              <button className="flex bg-blue-800 text-gray-100 w-20 m-1 
          rounded cursor-pointer hover:bg-amber-500 justify-center" onClick={handlePurchaseItems}>Purchase</button>
            </div>
          </div>
          
          </div>:null}        
        </div>        
      </div>
      <div className="flex flex-col w-xl ">
        <div className="flex w-xl justify-between">
           <div className="flex cursor-pointer hover:text-blue-800" onClick={handlePurchases}>Purchased Items</div> 
           <div className="flex cursor-pointer hover:text-blue-800" onClick={handlePurchaseHistory}>Show Purchase History</div>
        </div>
        <div className="flex flex-col border-1 w-full  h-[300px]  overflow-y-auto ">
          <div className="flex bg-gray-600 w-full" >
            <div className=" border-r  w-full  whitespace-nowrap truncate pl-1 pr-1 flex justify-center">Item-Id</div>
            <div className=" border-r  w-full  whitespace-nowrap truncate pl-1 pr-1 flex justify-center">Name</div>
            <div className=" border-r  w-full  whitespace-nowrap truncate pl-1 pr-1 flex justify-center">Quantity</div>
            <div className=" border-r  w-full  whitespace-nowrap truncate pl-1 pr-1 flex justify-center">Date</div>
            <div className=" border-r  w-full  whitespace-nowrap truncate pl-1 pr-1 flex justify-center">Price</div>
            <div className=" border-r  w-full  whitespace-nowrap truncate pl-1 pr-1 flex justify-center">Total Price</div>
            <div className=" border-r  w-full  whitespace-nowrap truncate pl-1 pr-1 flex justify-center">Status</div>
            <div className=" border-r  w-full  whitespace-nowrap truncate pl-1 pr-1 flex justify-center"></div>
          </div>
          {
            purchasedItems && purchasedItems.map((item,index)=>(
              <div className="flex  bg-gray-400 w-full" key={item.id}>
                <div className=" border-r  w-full  whitespace-nowrap truncate pl-1 pr-1 flex justify-center">{item.item_id}</div>
                <div className=" border-r  w-full  whitespace-nowrap truncate pl-1 pr-1 flex justify-start" title={item.item_name}>{item.item_name}</div>
                <div className=" border-r  w-full  whitespace-nowrap truncate pl-1 pr-1 flex justify-center">{item.item_qty}</div>
                <div className=" border-r  w-full  whitespace-nowrap truncate pl-1 pr-1 flex justify-start" title={formatDate(item.buy_date)}>{formatDate(item.buy_date)}</div>
                <div className=" border-r  w-full  whitespace-nowrap truncate pl-1 pr-1 flex justify-center">{item.total_price}</div>
                <div className=" border-r  w-full  whitespace-nowrap truncate pl-1 pr-1 flex justify-center">{item.total_price * item.item_qty}</div>
                <div className={`border-r  w-full  whitespace-nowrap truncate 
                pl-1 pr-1 flex justify-center ${item.status === 'PAID' ? `text-green-700`:`text-yellow-500`}`}>{item.status}</div>
                <div className=" border-r  w-full  whitespace-nowrap truncate pl-1 pr-1 flex justify-center">
                  <button className={`flex m-2 w-10  rounded justify-center
                    ${(item.status === 'PAID') ? `bg-gray-300` :`bg-blue-800 hover:bg-amber-500`}`} 
                    onClick={()=>handleItemPay(item.id) } disabled={item.status === 'PAID'}>Pay</button>
                </div>
              </div>
            ))
          }
          {purchasedItems.length > 0 ? 
          <div className="flex bg-gray-600 w-full bottom-0 sticky" >
            <div className=" border-r  w-full  whitespace-nowrap truncate pl-1 pr-1 flex justify-center"></div>
            <div className=" border-r  w-full  whitespace-nowrap truncate pl-1 pr-1 flex justify-center"></div>
            <div className=" border-r  w-full  whitespace-nowrap truncate pl-1 pr-1 flex justify-center"></div>
            <div className=" border-r  w-full  whitespace-nowrap truncate pl-1 pr-1 flex justify-center"></div>
            <div className=" border-r  w-full  whitespace-nowrap truncate pl-1 pr-1 flex justify-center">Balance</div>
            <div className=" border-r  w-full  whitespace-nowrap truncate pl-1 pr-1 flex justify-center">{purTotal}</div>
            <div className=" border-r  w-full  whitespace-nowrap truncate pl-1 pr-1 flex justify-center"></div>
            <div className=" border-r  w-full  whitespace-nowrap truncate pl-1 pr-1 flex justify-center">
                  <button className={`flex w-30  ${(purTotal === 0) ? `bg-gray-300` :`bg-blue-800 hover:bg-amber-500`} 
                   rounded justify-center `} onClick={handleFullPay } disabled={purTotal === 0}>Pay All</button>
                </div>
          </div>: null}
        </div>
      </div>
    </div>
  )
}

export default FoodOrder
