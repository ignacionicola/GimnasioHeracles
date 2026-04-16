const swaggerAutogen = require("swagger-autogen")();

const doc = {
    info: {
        title: "GimnasioHeracles API",
        version: "1.0.0",
        description: "API para la gestión de un gimnasio, incluyendo usuarios, beneficios y cuotas."
    },
    host: "localhost:3000",
};

const outputFile = "./swagger_output.json";
const routes = ['./app.js'
];

swaggerAutogen(outputFile,routes,doc);