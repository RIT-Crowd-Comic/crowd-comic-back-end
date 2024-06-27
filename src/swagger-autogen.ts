
import swaggerAutogen from 'swagger-autogen';


// const jsDocoptions = {
//     definition: {
//         openapi: '3.1.0',
//         info: {
//             title: 'Crowd Comic API',
//             description: "API endpoints Crowd Comic",
//             contact: {
//                 name: "",
//                 email: "",
//                 url: ""
//             },
//             version: '1.0.0',
//         },
//         servers: [
//             {
//                 url: "http://localhost:3000/",
//                 description: "Local server"
//             },
//             {
//                 url: "<your live url here>",
//                 description: "Live server"
//             },
//         ]
//     },
//     // looks for configuration in specified directories
//     apis: ['./router.ts'],
// }

const meta = {
    info: {
        title: 'Crowd Comic API',
        description: "API endpoints Crowd Comic",
        contact: {
            name: "",
            email: "",
            url: ""
        },
        version: '1.0.0',
    },
    servers: [
        {
            url: "http://localhost:3000/",
            description: "Local server"
        },
        {
            url: "<your live url here>",
            description: "Live server"
        },
    ]
}

// auto generate OpenAPI docs
const outputOASFile = './api-spec.json';
const endpointsFiles = ['./router.ts']
swaggerAutogen(outputOASFile, endpointsFiles, meta);
