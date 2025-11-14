import { nextServer } from './api';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/stories';

const perPage = 10;

export const fetchStories = async (page: number): Promise<any> => {
    const params = {
        page,
        perPage
    };


    try {
        const response = await axios.get<any>(API_URL, {
            params,
            // headers: {
            //     Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
            //     accept: 'application/json'
            // }
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};