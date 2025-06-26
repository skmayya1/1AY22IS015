import {Router} from 'express';

import shortUrlsRouter from './shorturls';

const router = Router();

router.use('/shorturls', shortUrlsRouter);



export default router;