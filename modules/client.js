import { request } from 'undici';

class TLSClient {
    /**
     * @description Create a new TlsClient
     * @param {TlsClientDefaultOptions} options 
    */
    constructor(options = {}) {}

    __build_default(options = {}) {}

    __combine_options(options = {}) {}

    __convert_body(body = {}) {}

    async sendRequest(options = {}) {}

    async __retry_request(options = {}) {}

    /**
     * @description Send a request
     * @param {URL|string} url 
     * @param {TlsClientOptions} options 
     * @returns {Promise<TlsClientResponse>}
     */
    async request(url, options = {}) {}
}

export default TLSClient;