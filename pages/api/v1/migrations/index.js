import migrationRunner from 'node-pg-migrate'
import { resolve } from 'node:path'
import database from 'infra/database'

export default async function migrations(request, response) {
  const requestAllowedMethods = ['GET', 'POST']
  if (!requestAllowedMethods.includes(request.method)) {
    return response
      .status(405)
      .json({ error: `Method ${request.method} not allowed` })
  }

  let dbClient

  try {
    dbClient = await database.getNewClient()

    const defaultMigrationOptions = {
      dbClient,
      dryRun: true,
      dir: resolve('infra', 'migrations'),
      direction: 'up',
      verbose: true,
      migrationsTable: 'pgmigrations',
    }

    if (request.method === 'GET') {
      const pendingMigrations = await migrationRunner(defaultMigrationOptions)

      response.status(200).json(pendingMigrations)
    }

    if (request.method === 'POST') {
      const migratedMigrations = await migrationRunner({
        ...defaultMigrationOptions,
        dryRun: false,
      })

      if (migratedMigrations.length > 0) {
        return response.status(201).json(migratedMigrations)
      }

      response.status(200).json(migratedMigrations)
    }
  } catch (err) {
    console.error(err)
    return response.status(500).json({ error: 'Internal server error' })
  } finally {
    await dbClient.end()
  }
}
