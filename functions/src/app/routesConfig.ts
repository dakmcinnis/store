import { Application } from 'express';
import { Feature } from '../features/types';
import * as Middleware from './middleware';

const routesConfig = (app: Application, features: Feature[]) => {
    app.use(Middleware.logging);
    features.forEach((feature: Feature) => {
        if (feature.isProtected) {
            app.use(feature.path, Middleware.isAuthenticated);
        }
        app.use(feature.path, feature.router);
    });
};

export default routesConfig;