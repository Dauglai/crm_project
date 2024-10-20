import { useState } from "react";

function useFetching (callback) {
    const [isLoading, setIsloading] = useState(false);
    const [error, setError] = useState('');

    const fetching = async (...args) => {
        try {
            setIsloading(true)
            await callback(...args)
        } catch (e) {
            setError(e.message)
        } finally {
            setIsloading(false)
        }
    }

    return [fetching, isLoading, error]
}

export default useFetching;