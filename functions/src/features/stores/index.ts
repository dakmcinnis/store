import { Feature } from '../types';
import router from './router';

const feature: Feature = {
    path: '/stores',
    router,
    isProtected: true,
};

export default feature;
