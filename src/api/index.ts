import { authRoutes, userRoutes } from './routes';

export default (app: any) => {
    app.use('/auth', authRoutes);
    app.use('/user', userRoutes);
};