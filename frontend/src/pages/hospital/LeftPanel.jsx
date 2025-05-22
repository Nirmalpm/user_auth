import React, { useEffect, useState } from 'react'
import { usePasStore } from '../../store/pasStore';
import { Loader } from 'lucide-react';

const LeftPanel = () => {
    const[isLoading,setIsLoading] = useState(false);
    const [page,setPage] = useState(1);
    const {getHealthNews} = usePasStore();
    const [total,setTotal] = useState(0);
    const [articles, setArticles] = useState([]);
    const [pages,setPages] = useState([])

    useEffect(()=>{
        const fetchNews = async () =>{
            setIsLoading(true);
            const response = await getHealthNews(page,11);
            console.log(response.data)
            const {totalResults} = response.data;
            setTotal(totalResults);
            setArticles(response.data.articles);
            
            const pages = Array.from({ length: Math.ceil(totalResults/11) }, (_, i) => i + 1);
            setPages(pages);
            setIsLoading(false);
        }
        fetchNews();
    },[page]);
  return (
    <div className="flex flex-col  justify-center items-start p-3 m-2 rounded">   
    {isLoading ? <Loader size={35}  className='size-6 animate-spin mx-auto'/> : (
      <div>
        <h1 className="text-2xl text-blue-800">Latest in Health</h1>
      <ul className="list-disc m-2">
        {
            articles && articles.map((article,ind)=>(
                <li key={ind} className="p2 text-blue-900"><a href={article.url} target='_blank'>{article.title}</a></li>
            ))
        }
      </ul>
       <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
      {pages.map((pg) => (
        <button
          key={pg}
          onClick={() => setPage(pg)}
          style={{
            padding: "8px 12px",
            backgroundColor: page === pg ? "#007bff" : "#eee",
            color: page === pg ? "#fff" : "#333",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          {pg}
        </button>
      ))}
    </div>
    </div>)}    
      
    </div>
  )
}

export default LeftPanel
