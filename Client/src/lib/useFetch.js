import { useState, useEffect } from "react";
import axiosConfig from "./axios";

function useFetch(link) {

    const [data, setData] = useState([]);
    const [Loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
          setLoading(true);
          try {
            const response = await axiosConfig.get(link);
            setData(response.data);
          } catch (err) {
            setError(err.message || "Something went wrong");
          } finally {
            setLoading(false);
          }
        };
    
        fetchData();
      }, [link]); // Refetch when 'link' changes
    
      return { data, Loading, error };
    }
    
    export default useFetch;
    