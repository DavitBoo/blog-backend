# Graph Report - blog-backend  (2026-08-30)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 289 nodes · 427 edges · 31 communities (28 shown, 3 thin omitted)
- Extraction: 82% EXTRACTED · 18% INFERRED · 0% AMBIGUOUS · INFERRED: 76 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `30680716`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- dependencies
- devDependencies
- app.ts
- projectRoutes.ts
- slugify
- package.json
- vidaItemController.ts
- compilerOptions
- postRoutes.ts
- vidaLibroRoutes.ts
- "Post"
- 20260818070450_add_vida_archipielago/migration.sql
- commentRoutes.ts
- vidaCategoriaRoutes.ts
- labelRoutes.ts
- seedVida.ts
- .prettierrc.json
- authMiddleware.ts
- express.d.ts
- testConnection.js

## God Nodes (most connected - your core abstractions)
1. `slugify()` - 17 edges
2. `scripts` - 9 edges
3. `revalidate()` - 8 edges
4. `compilerOptions` - 8 edges
5. `cacheControl()` - 7 edges
6. `noStore()` - 7 edges
7. `mapCategoria()` - 6 edges
8. `createItem()` - 6 edges
9. `updateItem()` - 6 edges
10. `"VidaItem"` - 6 edges

## Surprising Connections (you probably didn't know these)
- `exclude` --extends--> `prisma`  [EXTRACTED]
  tsconfig.json → package.json
- `createCategoria()` --calls--> `slugify()`  [EXTRACTED]
  src/controllers/vidaCategoriaController.ts → src/utils/slugify.ts
- `updateCategoria()` --calls--> `slugify()`  [EXTRACTED]
  src/controllers/vidaCategoriaController.ts → src/utils/slugify.ts
- `createProject()` --calls--> `slugify()`  [EXTRACTED]
  src/controllers/projectController.ts → src/utils/slugify.ts
- `createPost()` --calls--> `slugify()`  [EXTRACTED]
  src/controllers/postController.ts → src/utils/slugify.ts

## Import Cycles
- None detected.

## Communities (31 total, 3 thin omitted)

### Community 0 - "dependencies"
Cohesion: 0.05
Nodes (39): bcrypt, cors, dotenv, express, express-rate-limit, helmet, jsonwebtoken, multer (+31 more)

### Community 1 - "devDependencies"
Cohesion: 0.08
Nodes (25): eslint, eslint-config-prettier, @eslint/js, eslint-plugin-sonarjs, devDependencies, eslint, eslint-config-prettier, @eslint/js (+17 more)

### Community 2 - "app.ts"
Cohesion: 0.10
Nodes (17): app, authLimiter, generalLimiter, authenticateJwt, prisma, getTech(), loginUser(), prisma (+9 more)

### Community 3 - "projectRoutes.ts"
Cohesion: 0.14
Nodes (18): deleteImage(), deleteMultipleImages(), getImage(), listImages(), uploadImage(), createProject(), deleteProject(), getProjectById() (+10 more)

### Community 4 - "slugify"
Cohesion: 0.19
Nodes (15): createCategory(), deleteCategory(), getCategories(), getCategoryById(), prisma, updateCategory(), createTag(), deleteTag() (+7 more)

### Community 5 - "package.json"
Cohesion: 0.11
Nodes (17): author, description, license, main, name, prisma, seed, scripts (+9 more)

### Community 6 - "vidaItemController.ts"
Cohesion: 0.23
Nodes (15): buildScalarData(), createItem(), deleteItem(), getItemById(), getItems(), getItemsBackend(), ITEM_INCLUDE, mapItemBackend() (+7 more)

### Community 7 - "compilerOptions"
Cohesion: 0.17
Nodes (11): prisma, prisma, compilerOptions, esModuleInterop, module, outDir, rootDir, skipLibCheck (+3 more)

### Community 8 - "postRoutes.ts"
Cohesion: 0.30
Nodes (10): createPost(), deletePost(), getPostById(), getPostBySlug(), getPosts(), getPostsBackEnd(), prisma, storage (+2 more)

### Community 9 - "vidaLibroRoutes.ts"
Cohesion: 0.30
Nodes (10): createLibro(), deleteLibro(), getLecturasResumen(), getLibroById(), getLibros(), getLibrosBackend(), getLibrosPreview(), prisma (+2 more)

### Community 10 - ""Post""
Cohesion: 0.24
Nodes (7): "Comment", "Post", "User", "Label", "_PostToLabel", "Project", "ProjectCategory"

### Community 11 - "20260818070450_add_vida_archipielago/migration.sql"
Cohesion: 0.33
Nodes (9): "VidaCategoria", "VidaEnlace", "VidaItem", "_VidaItemToVidaTag", "VidaLecturasInfo", "VidaLibro", "VidaMedia", "VidaRelacion" (+1 more)

### Community 12 - "commentRoutes.ts"
Cohesion: 0.31
Nodes (8): createComment(), deleteComment(), getAllComments(), getCommentsByPost(), prisma, toggleApproveComment(), jwtAuth, router

### Community 13 - "vidaCategoriaRoutes.ts"
Cohesion: 0.44
Nodes (8): createCategoria(), deleteCategoria(), getCategoriaById(), getCategorias(), getCategoriasBackend(), mapCategoria(), prisma, updateCategoria()

### Community 14 - "labelRoutes.ts"
Cohesion: 0.36
Nodes (7): createLabel(), deleteLabel(), getAllLabels(), getLabelById(), prisma, updateLabel(), router

### Community 15 - "seedVida.ts"
Cohesion: 0.25
Nodes (6): CATEGORIAS, ITEMS, LIBROS, PLACEHOLDER_DESC, prisma, SeedItem

### Community 16 - ".prettierrc.json"
Cohesion: 0.33
Nodes (5): printWidth, semi, singleQuote, tabWidth, trailingComma

## Knowledge Gaps
- **90 isolated node(s):** `SeedItem`, `UserPayload`, `Request`, `bcrypt`, `cors` (+85 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `package.json`, `compilerOptions`?**
  _High betweenness centrality (0.063) - this node is a cross-community bridge._
- **Why does `slugify()` connect `slugify` to `postRoutes.ts`, `projectRoutes.ts`, `vidaCategoriaRoutes.ts`, `vidaItemController.ts`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Are the 7 inferred relationships involving `revalidate()` (e.g. with `commentRoutes.ts` and `labelRoutes.ts`) actually correct?**
  _`revalidate()` has 7 INFERRED edges - model-reasoned connections that need verification._
- **What connects `SeedItem`, `UserPayload`, `Request` to the rest of the system?**
  _90 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05128205128205128 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._