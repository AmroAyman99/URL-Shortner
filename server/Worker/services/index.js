//create a service that subscribes on the queue and processes the messages
import RedisMessageQueue from "../../../common/helpers/Redis/messageQueue.js";
import logger from "../../../common/utils/logger/index.js";
import URLshortnerModel from "../../URLshortner/models/index.js";
const serviceName = "server.Worker.services.index";


class WorkerService {
    static async processMessage(task) {
      logger.info(`Processing task: ${JSON.stringify(task)}`);
    
      if (task && task.shortUrl) {
          console.log(task.shortUrl);
          const result= await URLshortnerModel.incrementVisitCount(task.shortUrl);
          if(result){
            logger.info(serviceName, 'processMessage', 'Visit count incremented successfully');
          }
      }else {
        logger.error(serviceName, 'processMessage', 'Invalid task');
      }
    }

    static async  startWorker() {
        logger.info('Worker connected to Redis');
      
        while (true) {
          try {
            const task = await RedisMessageQueue.popMessage();
            if (task) {
              await this.processMessage(JSON.parse(task));
            } else {
              await new Promise(resolve => setTimeout(resolve, 10000)); // Wait for 10 second if the queue is empty
            }
          } catch (error) {
            logger.error(serviceName, 'startWorker', error.message);
          }
        }
      }

}
WorkerService.startWorker();