import{a$ as _,O as u,P as p,r as C,b0 as N,N as V,Q as f,R as s,U as c,B as r,ap as b,S as d,V as h,aY as y,M as S}from"./index.be0786c9.js";import{u as k}from"./actionCable.b175de01.js";import{u as v,D as g}from"./keys.abfa1cc6.js";import{V as x}from"./VContainer.0d9e09c0.js";import{g as B}from"./VAvatar.75e0fa98.js";import{a as L,V as T}from"./VRow.0910e68b.js";import{V as A}from"./VCard.8a782045.js";import"./VProgressCircular.6cfce55a.js";const m=_("notifications",()=>{const{accessToken:a}=u(p()),e=C([]);function i(t){e.value=t}return k({accessToken:a}).subscribeToNotificationsChannel({received(t){e.value.push(t.notification)},connected:(...t)=>console.log("Connected",t)}),{notifications:e,setNotifications:i}});function D(a){return N.api.v1UsersNotificationsDetail(String(a))}const G=V({__name:"NotificationsList",setup(a){const{notifications:e}=u(m()),{setNotifications:i}=m(),{user:l}=u(p()),t=v({queryKey:[g],queryFn:()=>{var o;return D((o=l.value)==null?void 0:o.id)},onSuccess:o=>{i(o.data)}});return(o,F)=>(c(),f(x,{fluid:""},{default:s(()=>[r(B,{class:"mx-auto",color:"success",type:"button",variant:"elevated",onClick:d(t).refetch},{default:s(()=>[b(" Fetch notifications ")]),_:1},8,["onClick"]),r(L,{dense:""},{default:s(()=>[(c(!0),h(S,null,y(d(e),n=>(c(),f(T,{key:n.created_at,cols:"12"},{default:s(()=>[r(A,{title:JSON.stringify(n.content),subtitle:`Notification created at ${n.created_at}`,text:"Lorem ipsum dolor sit amet consectetur, adipisicing elit.?"},null,8,["title","subtitle"])]),_:2},1024))),128))]),_:1})]),_:1}))}});export{G as default};