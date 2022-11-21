import APICaller from './api_callers';


/***
 * 
 * ORDERS 
 * 
 */
exports.getVendorOrders=async (callback,eCallback)=>{APICaller.authAPI('GET','vendor/orders',{},callback,eCallback)};
exports.getVendorOrder=async (id,callback,eCallback)=>{APICaller.authAPI('GET','vendor/orders/order/'+id,{},callback,eCallback)};
exports.getVendorEarnings=async (callback,eCallback)=>{APICaller.authAPI('GET','vendor/orders/earnings',{},callback,eCallback)};
exports.assignDriverToOrder=async (data,callback,eCallback)=>{APICaller.authAPI('POST','vendor/update_order_drivers',data,callback,eCallback)};
exports.getAllDrivers=async (callback,eCallback)=>{APICaller.authAPI('GET','vendor/drivers',{},callback,eCallback)};