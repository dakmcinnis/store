import { Feature } from '../types';
import router from './router';

const feature: Feature = {
    path: '/users',
    router,
    isProtected: false,
};

export default feature;
