/**
 * project controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::project.project', (({ strapi }) => ({
    async find(ctx) {

        if (!ctx.state.user) {
            return 'user is not authorized'
        }

        ctx.query = {
            ...ctx.query,
            populate: '*'
        };

        const sanitizedQuery = await this.sanitizeQuery(ctx);
        //Добавление фильтрации по user id
        sanitizedQuery.filters = { user: ctx.state.user.id }

        const { results, pagination } = await strapi.service('api::project.project').find(sanitizedQuery)
        const sanitizedresults = await this.sanitizeOutput(results, ctx);

        return this.transformResponse(sanitizedresults, { pagination });
    },

    async create(ctx) {
        // Убедимся, что пользователь аутентифицирован
        if (!ctx.state.user) {
            return ctx.unauthorized('You must be logged in to create a project');
        }

        const results = await strapi.service('api::project.project').create({
            data: { ...ctx.request.body.data, user: ctx.state.user.id }
        });

        return this.transformResponse(results, {})
    }

})));
