import axios from 'axios';
export const login = async (email: string, password: string) => {
    console.log("EMAIL: ", email)
    return axios({
        method: "POST",
        url: `${process.env.REACT_APP_SERVER_URL}/auth/login`,
        data: {
            email,
            password
        }
    })
}

export const register = async (email: string, password: string) => {
    return axios({
        method: "POST",
        url: `${process.env.REACT_APP_SERVER_URL}/auth/register`,
        data: {
            email,
            password
        }
    })
}