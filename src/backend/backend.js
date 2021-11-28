

import axios from "axios";

export async function getImages(name, page, per_page) {
    const searchParams = {
        params: {
            key: "24557124-39f2c475ddfc51b2a4ee57f05",
            q:`${name}`,
            image_type: "photo",
            orientation: "horizontal",
            safesearch: true,
            page,
            per_page,
        }
    };

    const response = await axios.get("https://pixabay.com/api/", searchParams);
    return response.data;
};