
import swaggerAutogen from 'swagger-autogen';
import fs from 'fs';
import path from 'path';

const doc = JSON.parse(fs.readFileSync(path.resolve(__dirname, './api-manual-spec.json'), 'utf-8'));

// auto generate OpenAPI docs
const outputOASFile = './api-autogen-spec.json';
const endpointsFiles = ['./router.ts'];
swaggerAutogen()(outputOASFile, endpointsFiles, doc);
