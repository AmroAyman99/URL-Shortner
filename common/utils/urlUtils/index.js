import shortid from 'shortid';

class URLutils{
    
    static isValidUrl(url) {
        const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
        return urlRegex.test(url);
    }

    static generateShortUrl() {
        const shortUrl = shortid.generate();
        return shortUrl;
    }
}

export default URLutils;

