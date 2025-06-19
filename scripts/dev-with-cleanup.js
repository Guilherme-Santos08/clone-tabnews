const { spawn } = require('child_process')

// Detectar se é Windows
const isWindows = process.platform === 'win32'
const npmCmd = isWindows ? 'npm.cmd' : 'npm'

// Cleanup quando receber Ctrl+C
process.on('SIGINT', () => {
  console.log('\n🧹 Parando services...')
  spawn(npmCmd, ['run', 'services:stop'], {
    stdio: 'inherit',
    shell: isWindows,
  }).on('close', () => process.exit(0))
})

// Executar o comando dev original (com logs em tempo real)
spawn(npmCmd, ['run', 'dev:original'], { stdio: 'inherit', shell: isWindows })
