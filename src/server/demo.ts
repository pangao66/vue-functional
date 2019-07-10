import {server} from './server'
import axios from 'axios'


interface User {
  name: string
  age: number
}

//
// export const getInsuranceTableData = <T>(data: any) => {
//   return axios.post<ResInterface<T>>('/insurance/company/query/simple', data)
// }
// //
// // //
// async function test() {
//   const user = await getInsuranceTableData<User>({age: 1})
//   console.log(user.data.result.age)
// }

export const getInsuranceTableData = (data: any) => server.post<User>('/insurance/company/query/simple', data)

async function test() {
  const res = await getInsuranceTableData({})
  console.log(res.data.age)
}

// // export const editInsurerStatus = (data: any) => server.post('/insurance/company/modify/enable', data)
