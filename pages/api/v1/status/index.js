import database from '../../../../infra/database.js'

async function status(request, response) {
  const result = await database.query('SELECT 1 + 1 as sum;')
  console.log(result.rows[0].sum)

  response.status(200).json({ message: 'DzScript é acima da média' })
}

export default status
