import { TRPCError } from '@trpc/server'
import { projectInputSchema } from '~/inputSchema'
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc'
import { z } from 'zod'
export const projectRouter = createTRPCRouter({
	postProject: publicProcedure
		.input(projectInputSchema)
		.mutation(async ({ ctx, input }) => {
			try {
				return await ctx.prisma.project.create({
					data: {
						...input,
					},
				})
			} catch (e) {
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: `An error occured`,
					cause: e,
				})
			}
		}),
	getAll: publicProcedure
		.input(
			z.object({
				approved: z.boolean(),
				complete: z.boolean().optional(),
			})
		)
		.query(async ({ ctx, input }) => {
			try {
				return await ctx.prisma.project.findMany({
					where: {
						approved: input.approved,
						complete: input.complete ?? false,
					},
					orderBy: {
						createdAt: 'desc',
					},
				})
			} catch (e) {
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'An error occured',
					cause: e,
				})
			}
		}),
	getProject: publicProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ ctx, input }) => {
			try {
				return await ctx.prisma.project.findUnique({ where: { id: input.id } })
			} catch (e) {
				throw new TRPCError({
					code: 'NOT_FOUND',
				})
			}
		}),
})
