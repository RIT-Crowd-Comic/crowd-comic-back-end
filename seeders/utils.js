const getLinks = () => {
    const link = process.env.NODE_ENV === 'production' ? `http://${process.env.BUCKET_NAME}.s3.amazonaws.com/` : 'http://localhost:5000/crowd-comic/';
    const imageIDs = ['1_0df5e86e-c877-44e5-839c-a8703c26c23a', '1_a43f171d-c54d-4cdc-a8ce-00510e499b1d', '1_3714827c-1ba3-4ebe-be16-6ea52829f6be' ]; 
    const links = [];
    for (let i = 0; i < 3; i++) {
        links.push(link + imageIDs[i]);
    }
    return links;
};

module.exports = { getLinks };