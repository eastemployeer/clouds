import axios, { AxiosResponse } from 'axios';

interface User {
    email: string;
    wins: number;
    loses: number;
}

export interface LeaderBoardResponse {
    data: User[];
}

export const getLeaderBoard = async () => {
    return axios<any, AxiosResponse<LeaderBoardResponse>>({
        method: "GET",
        url: `${process.env.REACT_APP_SERVER_URL}/user/leaderboard`,
    })
}

export const incrementWins = async (id: string) => {
    return axios<any, AxiosResponse<LeaderBoardResponse>>({
        method: "PATCH",
        url: `${process.env.REACT_APP_SERVER_URL}/user/wins`,
        data: {
            id
        }
    })
}

export const incrementLoses = async (id: string) => {
    return axios<any, AxiosResponse<LeaderBoardResponse>>({
        method: "PATCH",
        url: `${process.env.REACT_APP_SERVER_URL}/user/loses`,
        data: {
            id
        }
    })
}
