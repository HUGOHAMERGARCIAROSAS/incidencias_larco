import { useState, useRef, useEffect } from 'react';

const useSidebar = (initialState = true) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(initialState);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const sidebarRef = useRef(null);

    const handleWindowResize = () => {
        setWindowWidth(window.innerWidth);
    };

    useEffect(() => {
        window.addEventListener('resize', handleWindowResize);
        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);

    useEffect(() => {
        if (windowWidth >= 768) {
            setIsSidebarOpen(true);
        } else {
            setIsSidebarOpen(false);
        }
    }, [windowWidth]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleClickOutside = (event) => {
        if (windowWidth < 768 && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
            setIsSidebarOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [windowWidth]);

    return { isSidebarOpen, toggleSidebar, sidebarRef };
};

export default useSidebar;