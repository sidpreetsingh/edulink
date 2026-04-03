import { api } from "../api/axios";

export const changePassword=async (data:{
    currentpassword:string;
    newpassword:string;
})=>{
    const res= await api.patch("/users/change-password",data);
    return res.data;
}