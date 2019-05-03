module.exports = {
    baseUrl: '/',
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/api':{
                target:'http://localhost:8082',
                changeOrigin:true,
                pathRewrite:{
                   '^/api': '/'
                }
            },
            '/ms':{
                target: 'https://www.easy-mock.com/mock/592501a391470c0ac1fab128',
                changeOrigin: true
            }
        }
    }
}