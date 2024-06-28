
import swaggerAutogen from 'swagger-autogen';

const doc = {
    info: {
        title:       'Crowd Comic API',
        description: 'API endpoints Crowd Comic',
        contact:     {
            name:  '',
            email: '',
            url:   ''
        },
        version: '1.0.0',
    },
    servers: [
        {
            url:         'http://localhost:3000/',
            description: 'Local server'
        },
        {
            url:         '<your live url here>',
            description: 'Live server'
        },
    ],
    definitions: {
        userDefinition: {
            email:        'example@example.com',
            password:     'asdfASDF1234',
            display_name: 'John Doe',
        },
        userResponse: {
            email:        'example@example.com',
            display_name: 'John Doe',
            id:           'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee'
        },
        error: { message: 'string | string[]' }
    }
};

// auto generate OpenAPI docs
const outputOASFile = './api-spec.json';
const endpointsFiles = ['./router.ts'];
swaggerAutogen()(outputOASFile, endpointsFiles, doc);
