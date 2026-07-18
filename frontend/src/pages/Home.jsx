import React,{useEffect,useState}from"react";
import{ArrowRight,ChevronLeft,ChevronRight}from"lucide-react";
import{Link}from"react-router-dom";

const slides=[
 {eyebrow:"The New Edit",title:"Everyday elegance, made for you.",text:"Modern dresses and thoughtful details for days that deserve a little more style.",image:"https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=1800",position:"center 18%"},
 {eyebrow:"Occasion Dressing",title:"A fresh take on celebration style.",text:"Discover polished silhouettes made for weddings, festivities and everything beautiful in between.",image:"https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg?auto=compress&cs=tinysrgb&w=1800",position:"center 20%"},
 {eyebrow:"The Jewellery Edit",title:"Details that complete the story.",text:"Statement pieces and subtle sparkle, curated to elevate every look.",image:"https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1800&q=90",position:"center"}
];
const categories=[
 {name:"New Arrivals",to:"/dress",image:"https://images.unsplash.com/photo-1612722432474-b971cdcea546?auto=format&fit=crop&w=900&q=85"},
 {name:"Everyday Dresses",to:"/dress",image:"https://images.pexels.com/photos/13584944/pexels-photo-13584944.jpeg?auto=compress&cs=tinysrgb&w=900"},
 {name:"Occasion Wear",to:"/dress",image:"https://images.pexels.com/photos/12327758/pexels-photo-12327758.jpeg?auto=compress&cs=tinysrgb&w=900"},
 {name:"Jewellery",to:"/jewellery",image:"https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=85"}
];
export default function Home(){
 const[active,setActive]=useState(0);
 useEffect(()=>{const id=setInterval(()=>setActive(v=>(v+1)%slides.length),6000);return()=>clearInterval(id)},[]);
 const slide=slides[active];
 return <main className="new-home">
  <section className="nh-hero">
   {slides.map((s,i)=><img key={s.image} className={i===active?"active":""} src={s.image} alt="" style={{objectPosition:s.position}}/>)}
   <div className="nh-hero-shade"/>
   <div className="nh-hero-copy"><p>{slide.eyebrow}</p><h1>{slide.title}</h1><span>{slide.text}</span><div><Link to="/dress">Shop Dresses <ArrowRight/></Link><Link to="/jewellery">Shop Jewellery</Link></div></div>
   <div className="nh-slider-controls"><button onClick={()=>setActive(v=>(v-1+slides.length)%slides.length)}><ChevronLeft/></button><span>{String(active+1).padStart(2,"0")} <i/> {String(slides.length).padStart(2,"0")}</span><button onClick={()=>setActive(v=>(v+1)%slides.length)}><ChevronRight/></button></div>
  </section>
  <section className="nh-categories"><header><p>Shop by category</p><h2>Find your next favourite.</h2></header><div>{categories.map(c=><Link to={c.to} key={c.name}><figure><img src={c.image} alt={c.name}/></figure><span>{c.name}</span><ArrowRight/></Link>)}</div></section>
  <section className="nh-editorial"><div className="nh-editorial-image"><img src="https://images.pexels.com/photos/26973350/pexels-photo-26973350.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="The festive edit"/></div><div className="nh-editorial-copy"><p>Women’s Styles Edit 01</p><h2>Quiet luxury.<br/>Indian soul.</h2><span>Easy silhouettes, soft colours and expressive details come together in our latest curated collection.</span><Link to="/dress">Explore the collection <ArrowRight/></Link></div></section>
  <section className="nh-jewellery"><div><p>The finishing touch</p><h2>Jewellery that speaks softly and shines beautifully.</h2><Link to="/jewellery">Shop Jewellery <ArrowRight/></Link></div></section>
  <section className="nh-promises">{[["01","Curated with care","A considered selection of fashion and jewellery."],["02","Easy delivery","Reliable delivery to your doorstep."],["03","Secure checkout","Protected payments and a simple checkout."]].map(([n,t,d])=><div key={n}><small>{n}</small><h3>{t}</h3><p>{d}</p></div>)}</section>
 </main>;
}
