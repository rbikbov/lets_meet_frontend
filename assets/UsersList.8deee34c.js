import{a$ as f,r as d,b0 as p,N as _,O as V,Q as c,R as e,U as o,B as n,ap as U,S as i,V as y,aY as C,M as k}from"./index.be0786c9.js";import{u as x,U as S}from"./keys.abfa1cc6.js";import{g}from"./fullName.61125800.js";import{V as h}from"./VContainer.0d9e09c0.js";import{g as B}from"./VAvatar.75e0fa98.js";import{a as b,V as v}from"./VRow.0910e68b.js";import{V as F}from"./VCard.8a782045.js";import"./VProgressCircular.6cfce55a.js";const l=f("users",()=>{const s=d([]);function t(r){s.value=r}return{users:s,setUsers:t}});function L(){return p.api.v1UsersList()}const M=_({__name:"UsersList",setup(s){const{users:t}=V(l()),{setUsers:r}=l(),m=x({queryKey:[S],queryFn:()=>L(),onSuccess:u=>{r(u.data)}});return(u,N)=>(o(),c(h,{fluid:""},{default:e(()=>[n(B,{class:"mx-auto",color:"success",type:"button",variant:"elevated",onClick:i(m).refetch},{default:e(()=>[U(" Fetch users ")]),_:1},8,["onClick"]),n(b,{dense:""},{default:e(()=>[(o(!0),y(k,null,C(i(t),a=>(o(),c(v,{key:a.id,cols:"12"},{default:e(()=>[n(F,{title:i(g)(a),subtitle:`User id is ${a.id}`,text:"Lorem ipsum dolor sit amet consectetur, adipisicing elit.?"},null,8,["title","subtitle"])]),_:2},1024))),128))]),_:1})]),_:1}))}});export{M as default};