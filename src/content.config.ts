import { defineCollection, reference, z } from "astro:content";
import type { icons as lucideIcons } from "@iconify-json/lucide/icons.json";
import type { icons as simpleIcons } from "@iconify-json/simple-icons/icons.json";
import { file, glob } from "astro/loaders";

const other = defineCollection({
	loader: glob({ base: "src/content/other", pattern: "**/*.{md,mdx}" }),
});

// Forzamos que 'name' sea al menos un string con contenido. 
// Nota: Zod no puede leer tipos de TypeScript en tiempo de ejecución, pero nos aseguramos de que no esté vacío.
const lucideIconSchema = z.object({
	type: z.literal("lucide"),
	name: z.custom<keyof typeof lucideIcons>((val) => typeof val === "string" && val.length > 0, "El nombre del ícono Lucide no puede estar vacío"),
}).strict(); // .strict() prohíbe que se inyecten propiedades no declaradas

const simpleIconSchema = z.object({
	type: z.literal("simple-icons"),
	name: z.custom<keyof typeof simpleIcons>((val) => typeof val === "string" && val.length > 0, "El nombre del ícono Simple no puede estar vacío"),
}).strict();

const quickInfo = defineCollection({
	loader: file("src/content/info.json"),
	schema: z.object({
		id: z.number(),
		icon: z.union([lucideIconSchema, simpleIconSchema]),
		text: z.string().min(1, "[Info] El texto no puede estar vacío"),
	}).strict(),
});

const socials = defineCollection({
	loader: file("src/content/socials.json"),
	schema: z.object({
		id: z.number(),
		icon: z.union([lucideIconSchema, simpleIconSchema]),
		text: z.string().min(1, "[Socials] El texto es obligatorio"),
		link: z.string().url("[Socials] El link debe ser una URL válida (ej. https://...)"),
	}).strict(),
});

const workExperience = defineCollection({
	loader: file("src/content/work.json"),
	schema: z.object({
		id: z.number(),
		title: z.string().min(2, "[Work] El título debe tener al menos 2 caracteres"),
		company: z.string().min(1, "[Work] La compañía es obligatoria"),
		duration: z.string().min(4, "[Work] La duración es obligatoria (ej. '2023 - 2024')"),
		description: z.string().min(10, "[Work] La descripción debe ser detallada (mínimo 10 caracteres)"),
	}).strict(),
});

const tags = defineCollection({
	loader: file("src/content/tags.json"),
	schema: z.object({
		id: z.string().min(1),
	}).strict(),
});

const posts = defineCollection({
	loader: glob({ base: "src/content/posts", pattern: "**/*.{md,mdx}" }),
	schema: ({ image }) =>
		z.object({
			title: z.string().min(1, "El post debe tener un título"),
			createdAt: z.coerce.date({ required_error: "Falta la fecha de creación en el frontmatter" }),
			updatedAt: z.coerce.date().optional(),
			description: z.string().min(10, "Añade una breve descripción al post"),
			tags: z.array(reference("tags")),
			draft: z.boolean().optional().default(false),
			image: image(),
		}).strict(),
});

const projects = defineCollection({
	loader: glob({ base: "src/content/projects", pattern: "**/*.{md,mdx}" }),
	schema: ({ image }) =>
		z.object({
			title: z.string().min(1, "[Projects] El proyecto necesita un título"),
			description: z.string().min(10, "[Projects] La descripción del proyecto es muy corta"),
			date: z.coerce.date({ required_error: "[Projects] Añade la fecha del proyecto" }),
			image: image(),
			link: z.string().url().optional(),
			// AGREGAMOS ESTA LÍNEA PARA PERMITIR BORRADORES:
			draft: z.boolean().optional().default(false),
			info: z.array(
				z.object({
					text: z.string().min(1),
					icon: z.union([lucideIconSchema, simpleIconSchema]),
					link: z.string().url().optional(),
				}).strict()
			).optional().default([]),
		}).strict(),
});

export const collections = {
	tags,
	posts,
	projects,
	other,
	quickInfo,
	socials,
	workExperience,
};