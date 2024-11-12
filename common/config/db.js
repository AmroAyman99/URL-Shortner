// database.js
import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger/index.js';

const prisma = new PrismaClient();

async function connectDatabase() {
  try {
    await prisma.$connect();
    logger.info('Database Connection: ', 'connectDatabase', 'Connected to the database successfully');
  } catch (error) {
    logger.error('Failed to connect to the database', error);
    process.exit(1); // Exit the process with failure
  }
}

export { prisma, connectDatabase };