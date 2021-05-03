import { useState, useEffect, useCallback } from 'react';

export function useRouterRefresh(history, path, resetRoute = '/') {

    let handler;

    const refresh = () => {

        if (history.location.pathname === path) {
            history.push(resetRoute);
            handler = setTimeout(() => history.push(path), 10);
        } else {
            history.push(path);
        }

    }

    useEffect(() => {
        return () => handler && clearTimeout(handler);
    }, [handler]);

    return refresh;

}

export function useRefresh() {

    const [refresh, setRefresh] = useState(false);
    
    const onRefresh = useCallback(() => {
        setRefresh(!refresh);
    }, [refresh]);

    return onRefresh;
}