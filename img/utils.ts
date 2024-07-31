const getImages = () => {
    const link = process.env.NODE_ENV === 'production' ? `http://${process.env.BUCKET_NAME}.s3.amazonaws.com` : 'http://localhost:5000/crowd-comic';
    const imageIDs = ['1_9eb775c0-cd4f-4227-9dd8-1af7f9412604', '1_eb071f2a-fe89-43f1-b73b-02175ed77819', '1_d94663cb-1d58-4e5f-bf9c-5eba27862475'];
    const links = [] as String[];
    for (let i = 0; i < 3; i++) {
        links.push(link + imageIDs[i]);
    }
    return links;
}