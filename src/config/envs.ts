import "dotenv/config"
import * as joi from "joi"

interface EnvVars { 
    PORT: number,
    PAGE: number, 
    LIMIT: number, 
    PRODUCT_MICROSERVICE_HOST: string,
    PRODUCT_MICROSERVICE_PORT: number,
}

const envsSchema = joi.object({
    PORT: joi.number().required(),
    PAGE: joi.number().required(),
    LIMIT: joi.number().required(),
    PRODUCT_MICROSERVICE_HOST: joi.string().required(),
    PRODUCT_MICROSERVICE_PORT: joi.number().required(),
})
.unknown(true)

const { error, value } = envsSchema.validate(process.env)

if ( error ) { 
    throw new Error(`Config validation error: ${error.message}`)
}

const envVars: EnvVars = value;

export const envs = {
    port: envVars.PORT,
    page: envVars.PAGE,
    limit: envVars.LIMIT,
    productMicroserviceHost: envVars.PRODUCT_MICROSERVICE_HOST,
    productMicroservicePort: envVars.PRODUCT_MICROSERVICE_PORT,
}