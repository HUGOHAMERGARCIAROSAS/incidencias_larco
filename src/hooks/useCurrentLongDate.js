import { useEffect, useState } from "react";

import { formatDate } from "../utils";

const useCurrentLongDate = () => {

    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentDate(new Date());
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);


    return {
        currentDate: formatDate(currentDate),
    };
}

export default useCurrentLongDate

