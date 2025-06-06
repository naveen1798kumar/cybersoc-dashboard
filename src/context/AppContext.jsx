import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const AppContext = createContext()

export const AppProvider = ({ children }) => {
    
    const navigate = useNavigate()
    const [token, setToken] = useState(null)
    const [blogs, setBlogs] = useState([])
    const [input, setInput] = useState("")

    const fetchBlogs = async () => {
        try {
            const {data} = await axios.get('/blogs/all')
            data.success ? setBlogs(data.blogs) : toast.error(data.message);
        } catch (error) {
            console.error("Error fetching blogs:", error);
            // Optionally, you can handle the error by showing a message to the user
            toast.error("Failed to fetch blogs. Please try again later.", error.message);
        }
    }

    useEffect(()=> {
        fetchBlogs()
        const token = localStorage.getItem('token')
        if (token) {
            setToken(token)
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        } else {
            // navigate('/admin/login')
        }
    }, [])

    const value = {
        token,
        setToken,
        blogs,
        setBlogs,
        input,
        setInput,
        navigate,
        axios
    }

    return (
    <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
    return useContext(AppContext)
}
