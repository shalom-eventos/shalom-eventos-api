import fastifyMulter from 'fastify-multer';
import uploadConfig from '@/config/upload';

export const multer = fastifyMulter(uploadConfig.multer);
