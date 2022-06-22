import React, { useState, useEffect, Children } from 'react';
import mockUser from './mockData.js/mockUser';
import mockRepos from './mockData.js/mockRepos';
import mockFollowers from './mockData.js/mockFollowers';
import axios from 'axios';

const rootUrl = 'https://api.github.com';

const GithubContext = React.createContext();

// Provider, Consumer - GithubContext.Provider

const GithubProvider = ({children}) => {
    const [githubUser,setGithubUser] = useState(mockUser)
    const [githubFollowers,setGithubFollowers] = useState(mockFollowers)
    const [githubRepos,setGithubRepos] = useState(mockRepos)
    // loading
    const [requests,setRequests] = useState(0)
    const [isLoading,setIsLoading] = useState(false)
    //
    // Error
    const [error,setError] = useState({show:false, msg: ""})
    // Search Github user
    const searchGithubUser = async(user) => {
        toggleError()
        setIsLoading(true)
        const response = await axios(`${rootUrl}/users/${user}`).catch((error) => console.log(error))
        if (response){
        setGithubUser(response.data);
        const {login, followers_url} = response.data
        //
        // PromiseAll
        Promise.all([
            axios(`${followers_url}?per_page=100`),
            axios(`${rootUrl}/users/${login}/repos?per_page=100`),
        ]).then((result) => {
            console.log(result)
            const [followers, repos] = result;
            const status = 200
            // const status = "fulfilled"
            if (repos.status === status){
                setGithubRepos(repos.data)
                // setGithubRepos(repos.value.data)
            }
            if (followers.status === status){
                setGithubFollowers(followers.data)
                // setGithubFollowers(followers.value.data)
            }
        }).catch(error => console.log(error))
        } else {
            toggleError(true, "there is no user by this name.")
        }
        //
        checkRequests()
        setIsLoading(false)
    };
    // Check rate limit.
    const checkRequests = ()=> {
        axios(`${rootUrl}/rate_limit`).then(({data}) => {
            let {rate: {remaining}} = data
            setRequests(remaining)
            if (remaining === 0) {
                toggleError(true, "Sorry, you have exceeded your limit!")
            }
        }).catch((error) => console.log(error))
    }
    //
    // error (User doesn't exist or user used all requests)
    const toggleError = (show = false,msg = "") => {
        setError({show,msg})
    }
    //
    useEffect( checkRequests, [])
    // 
    return (
    <GithubContext.Provider
        value={{
            githubFollowers,
            githubUser,
            githubRepos,
            requests,
            error,
            searchGithubUser,
            isLoading,
        }}
    >
        {children}
    </GithubContext.Provider>
)}

export {GithubContext, GithubProvider}