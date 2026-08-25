import axios from 'axios';
import React from 'react'
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    // State to hold the authentication token
    const [token, setToken_] = useState(null);
    const [ready, setReady] = useState(false);
    const [isActor, setIsActor] = useState(false);
    const [isDirector, setIsDirector] = useState(false);
    const [actorProfileExists, setActorProfileExists] = useState(false);
    const [directorProfileExists, setDirectorProfileExists] = useState(false);

    const fetchProfiles = async (newToken, newIsActor, newIsDirector) => {
        try {
            const requests = [];

            if (newIsActor) {
                requests.push(axios.get('https://localhost:7118/api/ActorProfile/ActorProfileExists'));
            }
            if (newIsDirector) {
                requests.push(axios.get('https://localhost:7118/api/CastingDirectorProfile/DirectorProfileExists'));
            }

            const results = await Promise.all(requests);

            let i = 0;
            if (newIsActor) setActorProfileExists(results[i++].data);
            if (newIsDirector) setDirectorProfileExists(results[i++].data);

        } catch {
            setActorProfileExists(false);
            setDirectorProfileExists(false);
        }
    };

    useEffect(() => {
        const saved = localStorage.getItem("token");
        const savedIsActor = localStorage.getItem("isActor") === 'true';
        const savedIsDirector = localStorage.getItem("isDirector") === 'true';
        if (saved) {
            axios.defaults.headers.common["Authorization"] = "Bearer " + saved;
            setIsActor(savedIsActor);
            setIsDirector(savedIsDirector);
            fetchProfiles(saved, savedIsActor, savedIsDirector);
        }
        setToken_(saved ?? null);
        setReady(true);
    }, []);

    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    setToken_(null);
                    setIsActor(false);
                    setIsDirector(false);
                    setActorProfileExists(false);
                    setDirectorProfileExists(false);
                    localStorage.removeItem('token');
                    localStorage.removeItem('isActor');
                    localStorage.removeItem('isDirector');
                    delete axios.defaults.headers.common["Authorization"];
                }
                return Promise.reject(error);
            }
        );
        return () => axios.interceptors.response.eject(interceptor);
    }, []);

    const setToken = (newToken, newIsActor = false, newIsDirector = false) => {
        setToken_(newToken);
        if (newToken) {
            localStorage.setItem('token', newToken);
            localStorage.setItem('isActor', newIsActor);
            localStorage.setItem('isDirector', newIsDirector);
            axios.defaults.headers.common["Authorization"] = "Bearer " + newToken;
            setIsActor(newIsActor);
            setIsDirector(newIsDirector);
            fetchProfiles(newToken, newIsActor, newIsDirector);
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('isActor');
            localStorage.removeItem('isDirector');
            delete axios.defaults.headers.common["Authorization"];
            setIsActor(false);
            setIsDirector(false);
            setActorProfileExists(false);
            setDirectorProfileExists(false);
        }
    };

    const value = useMemo(() => ({
        token, setToken, ready,
        isActor, isDirector,
        actorProfileExists, directorProfileExists,
    }), [token, ready, isActor, isDirector, actorProfileExists, directorProfileExists]);

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthProvider;