import axios from 'axios';
let sourceCancel = void 0;
class http {
    static pendHttpList = [];
    static http(url, params, method) {
        const CancelToken = axios.CancelToken;
        sourceCancel && sourceCancel({ code: 888 });
        const instance = axios.create({
            timeout: Number.MAX_SAFE_INTEGER,
            // baseURL:  process.env.BASE_API,
        });


        const match = this.pendHttpList?.find(item => item.method === method && item.url === url);

        const data = {
            url: '/api' + url,
            responseType: 'json',
            method,
            withCredentials: false,
            // headers: {},
            // cancelToken: match && new CancelToken((cancel) => {
            //     sourceCancel = cancel;
            // })
        }

        Object.assign(data, params);

        (!match) && this.pendHttpList.push({
            url,
            method,
        });

        return new Promise((resolve, reject) => {
            instance(data)
                .then(res => {
                    if (res.data.code !== 200) {
                        throw new Error('9999999');
                    }
                    resolve(res.data);
                }).catch(error => {
                    console.log(error);

                    reject(error);
                    // if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) return window.$toast({ message: '请求超时~' });
                    // if (error.message && error.message.code === 888) return console.warn(`${url}已被拦截器关闭`);
                    // if (error.search('9999999') !== -1) return;
                    // window.$toast({ message: 'Net Error！' });
                }).finally(() => {
                    const index = this.pendHttpList.findIndex(item => item.url === url);
                    this.pendHttpList.splice(index, 1);
                })
        })
    }

    static post(url, data) {
        return this.http(url, { data }, 'post');
    }

    static get(url, params) {
        return this.http(url, { params }, 'get');
    }

    static put(url, params) {
        return this.http(url, { params }, 'put');
    }

    static delete(url, params) {
        return this.http(url, { params }, 'delete');
    }
}

export default http;