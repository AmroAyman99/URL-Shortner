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

    static  isValidExpirationDate(expirationDate) {
        const expiryDateObj = new Date(expirationDate);
        const currentDate = new Date();
    
        if (isNaN(expiryDateObj.getTime()) || expiryDateObj <= currentDate) {
            return false;
        }
        return true;
    }

}

export default URLutils;

