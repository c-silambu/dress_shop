import React,{useEffect,useMemo,useState}from"react";
import{ChevronDown,ChevronLeft,ChevronRight,ChevronUp,Grid2X2,Grid3X3,LayoutGrid,ListFilter,Search,X}from"lucide-react";
import api from"../api/api";
import{fetchFirstProductPage,getCachedFirstPage,isProductCacheFresh,PRODUCT_PAGE_SIZE}from"../api/productCache";
import ProductCard from"../components/ProductCard";
import ProductLoader from"../Productlode/ProductLoader";

const norm=v=>v?.toString().trim().toLowerCase()||"";
const uniq=a=>[...new Set(a.filter(Boolean).map(v=>v.toString().trim()))];
export default function ProductList({category,cacheCategory}){
 const queryCategory=cacheCategory||category;
 const initialCache=getCachedFirstPage(queryCategory);
 const[items,setItems]=useState(()=>initialCache?.products||[]),[total,setTotal]=useState(()=>initialCache?.total||0),[page,setPage]=useState(1),[loading,setLoading]=useState(()=>!initialCache),[search,setSearch]=useState(""),[filtersOpen,setFiltersOpen]=useState(false),[sortOpen,setSortOpen]=useState(false),[sort,setSort]=useState("featured"),[grid,setGrid]=useState(3),[subCategory,setSubCategory]=useState(""),[sizes,setSizes]=useState([]),[colors,setColors]=useState([]),[maxPrice,setMaxPrice]=useState(0),[sections,setSections]=useState({type:true,size:true,color:true,price:true});
 useEffect(()=>{
  let active=true;
  const cached=getCachedFirstPage(queryCategory);
  setPage(1);
  if(cached){setItems(cached.products);setTotal(cached.total);setLoading(false)}else{setItems([]);setTotal(0);setLoading(true)}
  if(!isProductCacheFresh(cached))fetchFirstProductPage(queryCategory)
   .then(entry=>{if(active){setItems(entry.products);setTotal(entry.total)}})
   .catch(error=>{if(active&&!cached)setItems([]);console.error(`[products] Failed to load ${queryCategory}`,error)})
   .finally(()=>{if(active)setLoading(false)});
  return()=>{active=false};
 },[queryCategory]);
 useEffect(()=>setMaxPrice(Math.ceil(Math.max(0,...items.map(p=>Number(p.discountPrice||p.price||0))))),[items]);
 const goToPage=target=>{
  if(target===page||target<1||target>Math.ceil(total/PRODUCT_PAGE_SIZE))return;
  if(target===1){
   const cached=getCachedFirstPage(queryCategory);
   if(cached){
    setItems(cached.products);setTotal(cached.total);setPage(1);window.scrollTo({top:0,behavior:"smooth"});
    if(!isProductCacheFresh(cached))fetchFirstProductPage(queryCategory).then(entry=>{setItems(entry.products);setTotal(entry.total)}).catch(error=>console.error(`[products] Failed to refresh ${queryCategory}`,error));
    return;
   }
   setLoading(true);
   fetchFirstProductPage(queryCategory).then(entry=>{setItems(entry.products);setTotal(entry.total);setPage(1);window.scrollTo({top:0,behavior:"smooth"})}).catch(error=>console.error(`[products] Failed to load page 1`,error)).finally(()=>setLoading(false));
   return;
  }
  setLoading(true);
  api.get("/products",{params:{category:queryCategory,page:target,limit:PRODUCT_PAGE_SIZE,status:"Active"}})
   .then(r=>{setItems(r.data);setTotal(Number(r.headers["x-total-count"]??total));setPage(target);window.scrollTo({top:0,behavior:"smooth"})})
   .catch(error=>console.error(`[products] Failed to load page ${target}`,error))
   .finally(()=>setLoading(false));
 };
 const types=useMemo(()=>uniq(items.map(p=>p.subCategory)),[items]),sizeOptions=useMemo(()=>uniq(items.flatMap(p=>p.sizes||[])),[items]),colorOptions=useMemo(()=>uniq(items.flatMap(p=>p.colors||[])),[items]);
 const ceiling=Math.ceil(Math.max(0,...items.map(p=>Number(p.discountPrice||p.price||0))));
 const totalPages=Math.ceil(total/PRODUCT_PAGE_SIZE);
 const pageNumbers=useMemo(()=>{if(totalPages<=7)return Array.from({length:totalPages},(_,i)=>i+1);const middle=[];for(let n=Math.max(2,page-1);n<=Math.min(totalPages-1,page+1);n++)middle.push(n);return[1,...(page>4?["start-gap"]:page===4?[2]:[]),...middle,...(page<totalPages-3?["end-gap"]:page===totalPages-3?[totalPages-1]:[]),totalPages]},[page,totalPages]);
 const products=useMemo(()=>{let out=items.filter(p=>(!search||norm(p.name).includes(norm(search)))&&(!subCategory||norm(p.subCategory)===norm(subCategory))&&(!sizes.length||sizes.some(s=>(p.sizes||[]).map(norm).includes(norm(s))))&&(!colors.length||colors.some(c=>(p.colors||[]).map(norm).includes(norm(c))))&&(!maxPrice||Number(p.discountPrice||p.price||0)<=maxPrice));if(sort==="low")out.sort((a,b)=>Number(a.discountPrice||a.price)-Number(b.discountPrice||b.price));if(sort==="high")out.sort((a,b)=>Number(b.discountPrice||b.price)-Number(a.discountPrice||a.price));if(sort==="az")out.sort((a,b)=>a.name.localeCompare(b.name));if(sort==="za")out.sort((a,b)=>b.name.localeCompare(a.name));return out},[items,search,subCategory,sizes,colors,maxPrice,sort]);
 const toggle=(setter,value)=>setter(cur=>cur.includes(value)?cur.filter(x=>x!==value):[...cur,value]);
 const section=(key,title,content)=><div className="pl-filter-section"><button onClick={()=>setSections(s=>({...s,[key]:!s[key]}))}><b>{title}</b>{sections[key]?<ChevronUp/>:<ChevronDown/>}</button>{sections[key]&&content}</div>;
 if(loading)return <ProductLoader/>;
 return <main className="pl-page">
  <header className="pl-title"><h1>{category||"Products"}</h1></header>
  <div className="pl-toolbar">
   <button className="pl-filter-toggle" onClick={()=>setFiltersOpen(v=>!v)}>{filtersOpen?"Hide Filters":"Filter"}<ListFilter/></button>
   <div className="pl-sort"><button onClick={()=>setSortOpen(v=>!v)}>{({featured:"Featured",low:"Price, low to high",high:"Price, high to low",az:"Alphabetically, A-Z",za:"Alphabetically, Z-A"})[sort]}<ListFilter/></button>{sortOpen&&<div>{[["featured","Featured"],["low","Price, low to high"],["high","Price, high to low"],["az","Alphabetically, A-Z"],["za","Alphabetically, Z-A"]].map(([v,l])=><button className={sort===v?"active":""} key={v} onClick={()=>{setSort(v);setSortOpen(false)}}>{l}</button>)}</div>}</div>
   <div className="pl-grid-buttons"><button className={grid===2?"active":""} onClick={()=>setGrid(2)} title="2 columns"><Grid2X2/></button><button className={grid===3?"active":""} onClick={()=>setGrid(3)} title="3 columns"><LayoutGrid/></button><button className={grid===4?"active":""} onClick={()=>setGrid(4)} title="4 columns"><Grid3X3/></button></div>
  </div>
  <div className={`pl-body ${filtersOpen?"filters-visible":""}`}>
   <aside className="pl-sidebar"><div className="pl-sidebar-inner">
    <div className="pl-mobile-head"><b>Filters</b><button onClick={()=>setFiltersOpen(false)}><X/></button></div>
    {section("type","Product Type",<div className="pl-checks"><label><span>All products</span><input type="checkbox" checked={!subCategory} onChange={()=>setSubCategory("")}/></label>{types.map(v=><label key={v}><span>{v}</span><input type="checkbox" checked={subCategory===v} onChange={()=>setSubCategory(subCategory===v?"":v)}/></label>)}</div>)}
    {sizeOptions.length>0&&section("size","Size",<div className="pl-checks">{sizeOptions.map(v=><label key={v}><span>{v}</span><input type="checkbox" checked={sizes.includes(v)} onChange={()=>toggle(setSizes,v)}/></label>)}</div>)}
    {colorOptions.length>0&&section("color","Color",<div className="pl-colors">{colorOptions.map(v=><button key={v} title={v} className={colors.includes(v)?"active":""} style={{backgroundColor:v}} onClick={()=>toggle(setColors,v)}><span>{v}</span></button>)}</div>)}
    {section("price","Price",<div className="pl-price"><input type="range" min="0" max={ceiling||1} value={maxPrice} onChange={e=>setMaxPrice(Number(e.target.value))}/><div><span>₹ 0</span><span>₹ {maxPrice.toLocaleString("en-IN")}</span></div></div>)}
    <button className="pl-clear" onClick={()=>{setSubCategory("");setSizes([]);setColors([]);setMaxPrice(ceiling);setSearch("")}}>Clear all</button>
   </div></aside>
   <section className="pl-results">
    <div className="pl-result-meta"><span>{total?`${(page-1)*PRODUCT_PAGE_SIZE+1}-${Math.min(page*PRODUCT_PAGE_SIZE,total)} of ${total}`:`${products.length} items`}</span><label><Search/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products"/></label></div>
    <div className={`pl-products grid-${grid}`}>{products.map(p=><ProductCard key={p._id} p={p}/>)}{!products.length&&<div className="pl-empty"><Search/><h2>No products found</h2><p>Try changing your filters.</p></div>}</div>
    {totalPages>1&&<nav aria-label="Product pages" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginTop:48,flexWrap:"wrap"}}>
     <button aria-label="Previous page" disabled={page===1} onClick={()=>goToPage(page-1)} style={{width:42,height:42,border:"1px solid #ddd",display:"grid",placeItems:"center",opacity:page===1?.35:1}}><ChevronLeft size={17}/></button>
     {pageNumbers.map(n=>typeof n==="number"?<button key={n} aria-label={`Page ${n}`} aria-current={page===n?"page":undefined} onClick={()=>goToPage(n)} style={{width:42,height:42,border:`1px solid ${page===n?"#171717":"#ddd"}`,background:page===n?"#171717":"#fff",color:page===n?"#fff":"#171717",fontSize:12}}>{n}</button>:<span key={n} style={{padding:"0 4px"}}>…</span>)}
     <button aria-label="Next page" disabled={page===totalPages} onClick={()=>goToPage(page+1)} style={{width:42,height:42,border:"1px solid #ddd",display:"grid",placeItems:"center",opacity:page===totalPages?.35:1}}><ChevronRight size={17}/></button>
    </nav>}
   </section>
  </div>{filtersOpen&&<button className="pl-mobile-backdrop" onClick={()=>setFiltersOpen(false)}/>}
 </main>;
}
